/**
 * اسکریپت پیش‌بارگذاری v2ray-core
 * این اسکریپت قبل از اجرای برنامه، v2ray-core را دانلود می‌کند
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const V2RAY_VERSION = 'v5.19.0';
const V2RAY_URL = `https://github.com/v2fly/v2ray-core/releases/download/${V2RAY_VERSION}/v2ray-windows-64.zip`;
const V2RAY_DIR = path.join(__dirname, 'v2ray-core');
const V2RAY_EXE = path.join(V2RAY_DIR, 'v2ray.exe');

async function downloadV2RayCore() {
    // اگر موجود است، نیازی به دانلود نیست
    if (fs.existsSync(V2RAY_EXE)) {
        console.log('✓ v2ray-core موجود است');
        return true;
    }

    console.log('========================================');
    console.log('  دانلود v2ray-core');
    console.log('========================================');
    console.log('');
    console.log('این فقط یکبار انجام می‌شود...');
    console.log('');

    // ایجاد پوشه
    if (!fs.existsSync(V2RAY_DIR)) {
        fs.mkdirSync(V2RAY_DIR, { recursive: true });
    }

    const zipPath = path.join(V2RAY_DIR, 'v2ray.zip');

    try {
        // دانلود
        console.log('در حال دانلود از GitHub...');
        await downloadFile(V2RAY_URL, zipPath);
        
        // استخراج
        console.log('در حال استخراج...');
        const AdmZip = require('adm-zip');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(V2RAY_DIR, true);
        
        // حذف ZIP
        fs.unlinkSync(zipPath);
        
        console.log('✓ v2ray-core آماده است!');
        console.log('');
        return true;
        
    } catch (error) {
        console.error('خطا:', error.message);
        console.log('');
        console.log('لطفاً دستی دانلود کنید:');
        console.log(V2RAY_URL);
        console.log('');
        return false;
    }
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        
        const download = (downloadUrl) => {
            https.get(downloadUrl, (response) => {
                // Handle redirects
                if (response.statusCode === 301 || response.statusCode === 302) {
                    download(response.headers.location);
                    return;
                }
                
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}`));
                    return;
                }
                
                const totalSize = parseInt(response.headers['content-length'], 10);
                let downloaded = 0;
                
                console.log(`حجم: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
                
                response.on('data', (chunk) => {
                    downloaded += chunk.length;
                    const percent = ((downloaded / totalSize) * 100).toFixed(0);
                    process.stdout.write(`\rدانلود: ${percent}%`);
                });
                
                response.pipe(file);
                
                file.on('finish', () => {
                    file.close();
                    console.log('\n✓ دانلود کامل');
                    resolve();
                });
                
            }).on('error', (err) => {
                fs.unlink(dest, () => {});
                reject(err);
            });
        };
        
        download(url);
    });
}

// اجرا
if (require.main === module) {
    downloadV2RayCore().then((success) => {
        if (success) {
            console.log('موفق! می‌توانید برنامه را اجرا کنید.');
            process.exit(0);
        } else {
            console.log('ناموفق. لطفاً دستی دانلود کنید.');
            process.exit(1);
        }
    });
}

module.exports = { downloadV2RayCore };

