const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

const execAsync = promisify(exec);

class V2RayManager {
    constructor() {
        this.v2rayProcess = null;
        this.isRunning = false;
        
        // تشخیص اینکه برنامه در حالت development یا package است
        const isPackaged = process.mainModule && process.mainModule.filename.indexOf('app.asar') !== -1;
        
        if (isPackaged) {
            // در حالت package شده
            const appPath = process.resourcesPath;
            this.configPath = path.join(appPath, 'v2ray-config.json');
            this.v2rayPath = path.join(appPath, 'v2ray-core', 'v2ray.exe');
            this.v2rayDir = path.join(appPath, 'v2ray-core');
        } else {
            // در حالت development
            this.configPath = path.join(__dirname, 'v2ray-config.json');
            this.v2rayPath = path.join(__dirname, 'v2ray-core', 'v2ray.exe');
            this.v2rayDir = path.join(__dirname, 'v2ray-core');
        }
        
        console.log('V2Ray Manager initialized:');
        console.log('  isPackaged:', isPackaged);
        console.log('  v2rayPath:', this.v2rayPath);
        console.log('  configPath:', this.configPath);
    }

    /**
     * دانلود خودکار v2ray-core اگر وجود نداشته باشد
     */
    async ensureV2RayCore() {
        if (fs.existsSync(this.v2rayPath)) {
            console.log('✓ v2ray-core موجود است');
            return true;
        }

        console.log('در حال دانلود v2ray-core...');
        
        // ایجاد پوشه
        if (!fs.existsSync(this.v2rayDir)) {
            fs.mkdirSync(this.v2rayDir, { recursive: true });
        }

        // URL نسخه مشخص v2ray-core برای Windows (64-bit)
        const version = 'v5.19.0';
        const downloadUrl = `https://github.com/v2fly/v2ray-core/releases/download/${version}/v2ray-windows-64.zip`;
        
        try {
            console.log('دانلود از:', downloadUrl);
            await this.downloadAndExtract(downloadUrl);
            return true;
        } catch (error) {
            console.error('خطا در دانلود v2ray-core:', error);
            throw new Error(`خطا در دانلود v2ray-core\n\nلطفاً دستی دانلود کنید از:\nhttps://github.com/v2fly/v2ray-core/releases\n\nو در پوشه ${this.v2rayDir} قرار دهید`);
        }
    }

    /**
     * دانلود و استخراج v2ray-core
     */
    async downloadAndExtract(url) {
        const AdmZip = require('adm-zip');
        const zipPath = path.join(this.v2rayDir, 'v2ray.zip');

        console.log('شروع دانلود...');

        // دانلود فایل با follow redirects
        await new Promise((resolve, reject) => {
            const file = fs.createWriteStream(zipPath);
            let totalSize = 0;
            
            const download = (downloadUrl) => {
                const protocol = downloadUrl.startsWith('https') ? https : require('http');
                
                protocol.get(downloadUrl, (response) => {
                    // Handle redirects
                    if (response.statusCode === 301 || response.statusCode === 302) {
                        console.log('Redirect به:', response.headers.location);
                        download(response.headers.location);
                        return;
                    }
                    
                    if (response.statusCode !== 200) {
                        reject(new Error(`دانلود ناموفق: ${response.statusCode}`));
                        return;
                    }
                    
                    totalSize = parseInt(response.headers['content-length'], 10);
                    console.log(`حجم فایل: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
                    
                    let downloaded = 0;
                    response.on('data', (chunk) => {
                        downloaded += chunk.length;
                        const percent = ((downloaded / totalSize) * 100).toFixed(1);
                        if (downloaded % 500000 === 0 || downloaded === totalSize) {
                            console.log(`دانلود شده: ${percent}%`);
                        }
                    });
                    
                    response.pipe(file);
                    
                    file.on('finish', () => {
                        file.close();
                        console.log('✓ دانلود کامل شد');
                        resolve();
                    });
                }).on('error', (err) => {
                    fs.unlink(zipPath, () => {});
                    reject(err);
                });
            };
            
            download(url);
        });

        console.log('در حال استخراج...');
        
        // استخراج ZIP
        try {
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(this.v2rayDir, true);
            console.log('✓ استخراج کامل شد');
        } catch (error) {
            console.error('خطا در استخراج:', error);
            throw new Error('خطا در استخراج فایل ZIP');
        }
        
        // حذف ZIP
        try {
            fs.unlinkSync(zipPath);
            console.log('✓ فایل ZIP حذف شد');
        } catch (error) {
            console.log('نتوانستم ZIP را حذف کنم (مشکلی نیست)');
        }
        
        console.log('✓ v2ray-core آماده است');
    }

    /**
     * تبدیل vless:// URL به v2ray config
     */
    parseVlessUrl(vlessUrl) {
        try {
            // حذف vless://
            const url = vlessUrl.replace('vless://', '');
            
            // جدا کردن بخش‌ها
            const [credentials, paramsWithName] = url.split('?');
            const [uuid, serverPort] = credentials.split('@');
            const [server, port] = serverPort.split(':');
            
            // پارس پارامترها
            const params = {};
            if (paramsWithName) {
                const [queryString, name] = paramsWithName.split('#');
                queryString.split('&').forEach(param => {
                    const [key, value] = param.split('=');
                    params[key] = decodeURIComponent(value);
                });
                params.name = name ? decodeURIComponent(name) : 'Unknown';
            }

            return {
                uuid,
                server,
                port: parseInt(port),
                encryption: params.encryption || 'none',
                security: params.security || 'none',
                type: params.type || 'tcp',
                headerType: params.headerType || 'none',
                host: params.host || '',
                path: params.path || '',
                name: params.name || 'Server'
            };
        } catch (error) {
            console.error('خطا در پارس vless URL:', error);
            throw new Error('فرمت لینک کانفیگ نامعتبر است');
        }
    }

    /**
     * ایجاد فایل کانفیگ v2ray
     */
    createV2RayConfig(parsedConfig) {
        // ساخت streamSettings بر اساس نوع
        const streamSettings = {
            "network": parsedConfig.type || "tcp",
            "security": parsedConfig.security || "none"
        };

        // اضافه کردن تنظیمات TCP اگر نوع tcp باشد
        if (parsedConfig.type === "tcp") {
            const headerType = parsedConfig.headerType || "none";
            
            if (headerType === "http") {
                streamSettings.tcpSettings = {
                    "header": {
                        "type": "http",
                        "request": {
                            "version": "1.1",
                            "method": "GET",
                            "path": [parsedConfig.path || "/"],
                            "headers": {
                                "Host": [parsedConfig.host || parsedConfig.server],
                                "User-Agent": [
                                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                                ],
                                "Accept-Encoding": ["gzip, deflate"],
                                "Connection": ["keep-alive"],
                                "Pragma": "no-cache"
                            }
                        }
                    }
                };
            } else {
                streamSettings.tcpSettings = {
                    "header": {
                        "type": "none"
                    }
                };
            }
        }

        // اضافه کردن تنظیمات TLS اگر security=tls باشد
        if (parsedConfig.security === "tls") {
            streamSettings.tlsSettings = {
                "allowInsecure": true,
                "fingerprint": "chrome"
            };
        }

        const config = {
            "log": {
                "loglevel": "info"
            },
            "inbounds": [
                {
                    "port": 10808,
                    "listen": "127.0.0.1",
                    "protocol": "socks",
                    "sniffing": {
                        "enabled": true,
                        "destOverride": ["http", "tls"]
                    },
                    "settings": {
                        "auth": "noauth",
                        "udp": true,
                        "allowTransparent": false
                    }
                },
                {
                    "port": 10809,
                    "listen": "127.0.0.1",
                    "protocol": "http",
                    "sniffing": {
                        "enabled": true,
                        "destOverride": ["http", "tls"]
                    },
                    "settings": {
                        "timeout": 300,
                        "allowTransparent": false,
                        "userLevel": 0
                    }
                }
            ],
            "outbounds": [
                {
                    "protocol": "vless",
                    "settings": {
                        "vnext": [
                            {
                                "address": parsedConfig.server,
                                "port": parsedConfig.port,
                                "users": [
                                    {
                                        "id": parsedConfig.uuid,
                                        "encryption": parsedConfig.encryption || "none",
                                        "flow": "",
                                        "level": 0
                                    }
                                ]
                            }
                        ]
                    },
                    "streamSettings": streamSettings
                },
                {
                    "protocol": "freedom",
                    "tag": "direct"
                },
                {
                    "protocol": "blackhole",
                    "tag": "block"
                }
            ],
            "routing": {
                "domainStrategy": "IPIfNonMatch",
                "rules": [
                    {
                        "type": "field",
                        "ip": ["geoip:private"],
                        "outboundTag": "direct"
                    }
                ]
            },
            "dns": {
                "servers": [
                    "1.1.1.1",
                    "8.8.8.8"
                ]
            }
        };

        // ذخیره کانفیگ
        fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
        console.log('✓ فایل کانفیگ ایجاد شد');
        console.log('Server:', parsedConfig.server + ':' + parsedConfig.port);
        
        return config;
    }

    /**
     * شروع v2ray
     */
    async start(vlessUrl) {
        try {
            console.log('=== شروع اتصال VPN ===');
            
            // اطمینان از وجود v2ray-core
            await this.ensureV2RayCore();
            console.log('✓ v2ray-core موجود است');

            // پارس و ایجاد کانفیگ
            const parsedConfig = this.parseVlessUrl(vlessUrl);
            console.log('✓ کانفیگ پارس شد:', parsedConfig);
            
            this.createV2RayConfig(parsedConfig);
            console.log('✓ فایل کانفیگ ایجاد شد');

            // اگر قبلاً در حال اجرا است، متوقف کن
            if (this.isRunning) {
                console.log('قطع اتصال قبلی...');
                await this.stop();
            }

            // اجرای v2ray
            return new Promise(async (resolve, reject) => {
                console.log('در حال اجرای v2ray-core...');
                console.log('Path:', this.v2rayPath);
                console.log('Config:', this.configPath);
                
                // کشتن تمام v2ray های قبلی قبل از شروع
                const { execSync } = require('child_process');
                try {
                    execSync('taskkill /F /IM v2ray.exe 2>nul', { stdio: 'ignore' });
                    console.log('✓ Process های قبلی v2ray بسته شدند');
                    // صبر کردن تا پورت آزاد شود
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (e) {
                    // اگر v2ray قبلی نبود، مشکلی نیست
                }

                this.v2rayProcess = spawn(this.v2rayPath, ['run', '-config', this.configPath], {
                    cwd: this.v2rayDir,
                    detached: false,
                    windowsHide: false,  // تغییر برای دیدن پنجره و debug
                    stdio: 'pipe'
                });

                let startupOutput = '';

                this.v2rayProcess.stdout.on('data', (data) => {
                    const output = data.toString();
                    console.log(`V2Ray stdout: ${output}`);
                    startupOutput += output;
                });

                this.v2rayProcess.stderr.on('data', (data) => {
                    const output = data.toString();
                    console.log(`V2Ray stderr: ${output}`);
                    startupOutput += output;
                });

                this.v2rayProcess.on('error', (error) => {
                    console.error('خطا در اجرای V2Ray process:', error);
                    reject(new Error(`خطا در اجرای v2ray:\n${error.message}`));
                });

                this.v2rayProcess.on('exit', (code) => {
                    console.log(`V2Ray process بسته شد با کد: ${code}`);
                    this.isRunning = false;
                    this.v2rayProcess = null;
                });

                // صبر کردن برای شروع v2ray
                setTimeout(async () => {
                    if (this.v2rayProcess && !this.v2rayProcess.killed) {
                        this.isRunning = true;
                        
                        console.log('✓ v2ray-core در حال اجرا است');
                        console.log('در حال تنظیم System Proxy...');
                        
                        // تنظیم System Proxy
                        await this.enableSystemProxy();
                        
                        console.log('✓ V2Ray شروع شد و Proxy فعال شد');
                        console.log('=== اتصال موفق ===');
                        resolve(true);
                    } else {
                        const error = `V2Ray شروع نشد.\n\nخروجی:\n${startupOutput}`;
                        console.error(error);
                        reject(new Error(error));
                    }
                }, 3000);
            });
        } catch (error) {
            console.error('خطا در شروع V2Ray:', error);
            throw error;
        }
    }

    /**
     * متوقف کردن v2ray
     */
    async stop() {
        try {
            // غیرفعال کردن System Proxy
            await this.disableSystemProxy();

            // متوقف کردن process
            if (this.v2rayProcess && !this.v2rayProcess.killed) {
                this.v2rayProcess.kill();
                this.v2rayProcess = null;
            }

            this.isRunning = false;
            console.log('✓ V2Ray متوقف شد و Proxy غیرفعال شد');
            return true;
        } catch (error) {
            console.error('خطا در متوقف کردن V2Ray:', error);
            throw error;
        }
    }

    /**
     * فعال کردن System Proxy در ویندوز
     */
    async enableSystemProxy() {
        try {
            const host = '127.0.0.1';
            const httpPort = 10809;
            
            // فعال کردن Proxy در ویندوز
            await execAsync(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f`);
            await execAsync(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer /t REG_SZ /d "${host}:${httpPort}" /f`);
            
            console.log('✓ System Proxy فعال شد');
        } catch (error) {
            console.error('خطا در فعال‌سازی Proxy:', error);
        }
    }

    /**
     * غیرفعال کردن System Proxy
     */
    async disableSystemProxy() {
        try {
            await execAsync(`reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f`);
            await execAsync(`reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer /f`);
            
            console.log('✓ System Proxy غیرفعال شد');
        } catch (error) {
            console.error('خطا در غیرفعال‌سازی Proxy:', error);
        }
    }

    /**
     * بررسی وضعیت
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            hasV2RayCore: fs.existsSync(this.v2rayPath)
        };
    }
}

module.exports = new V2RayManager();

