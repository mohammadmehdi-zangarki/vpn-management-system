const axios = require('axios');
const v2rayManager = require('./v2ray-manager');

// تنظیمات API
const API_BASE_URL = 'http://localhost:3000/api';

// وضعیت برنامه
let currentState = {
    isConnected: false,
    connectedServer: null,
    categories: [],
    servers: [],
    selectedCategory: null
};

// المنت‌های DOM
const elements = {
    status: document.getElementById('status'),
    statusText: document.getElementById('statusText'),
    connectionPanel: document.getElementById('connectionPanel'),
    connectionTitle: document.getElementById('connectionTitle'),
    connectionMessage: document.getElementById('connectionMessage'),
    disconnectBtn: document.getElementById('disconnectBtn'),
    categoriesContainer: document.getElementById('categoriesContainer'),
    serversSection: document.getElementById('serversSection'),
    serversSectionTitle: document.getElementById('serversSectionTitle'),
    serversContainer: document.getElementById('serversContainer'),
    backBtn: document.getElementById('backBtn')
};

// بارگذاری دسته‌بندی‌ها
async function loadCategories() {
    try {
        elements.categoriesContainer.innerHTML = '<div class="loading">در حال بارگذاری...</div>';
        
        const response = await axios.get(`${API_BASE_URL}/categories`);
        currentState.categories = response.data.categories;
        
        if (currentState.categories.length === 0) {
            elements.categoriesContainer.innerHTML = '<div class="loading">هنوز دسته‌بندی ایجاد نشده است</div>';
            return;
        }
        
        renderCategories();
    } catch (error) {
        console.error('خطا در دریافت دسته‌بندی‌ها:', error);
        elements.categoriesContainer.innerHTML = `
            <div class="loading">
                خطا در اتصال به سرور!<br>
                لطفاً مطمئن شوید Backend در حال اجرا است.<br>
                <button class="btn btn-primary" onclick="loadCategories()" style="margin-top: 1rem;">تلاش مجدد</button>
            </div>
        `;
    }
}

// نمایش دسته‌بندی‌ها
function renderCategories() {
    elements.categoriesContainer.innerHTML = currentState.categories.map(category => `
        <button class="category-card" onclick="loadServers(${category.id}, '${category.name}')">
            <h3>${category.name}</h3>
            <p>${category.description || 'بدون توضیحات'}</p>
        </button>
    `).join('');
}

// بارگذاری سرورها
async function loadServers(categoryId, categoryName) {
    try {
        currentState.selectedCategory = { id: categoryId, name: categoryName };
        
        elements.serversContainer.innerHTML = '<div class="loading">در حال بارگذاری...</div>';
        elements.serversSection.style.display = 'block';
        elements.serversSectionTitle.textContent = `سرورهای ${categoryName}`;
        
        const response = await axios.get(`${API_BASE_URL}/configs/category/${categoryId}`);
        currentState.servers = response.data.configs;
        
        if (currentState.servers.length === 0) {
            elements.serversContainer.innerHTML = '<div class="loading">سروری در این دسته‌بندی یافت نشد</div>';
            return;
        }
        
        renderServers();
    } catch (error) {
        console.error('خطا در دریافت سرورها:', error);
        elements.serversContainer.innerHTML = '<div class="loading">خطا در دریافت سرورها</div>';
    }
}

// نمایش سرورها
function renderServers() {
    elements.serversContainer.innerHTML = currentState.servers.map(server => {
        const isConnected = currentState.connectedServer && currentState.connectedServer.id === server.id;
        return `
            <div class="server-card ${isConnected ? 'connected' : ''}">
                <div class="server-header">
                    <div class="server-name">${server.name}</div>
                    <div class="server-badge ${isConnected ? 'connected' : ''}">
                        ${isConnected ? 'متصل' : 'آماده'}
                    </div>
                </div>
                <div class="server-config">${server.config_url}</div>
                <div class="server-actions">
                    ${isConnected ? 
                        `<button class="btn btn-disconnect" onclick="disconnectVPN()">قطع اتصال</button>` :
                        `<button class="btn btn-primary" onclick='connectVPN(${JSON.stringify(server).replace(/'/g, "\\'")})'
                            ${currentState.isConnected ? 'disabled' : ''}>
                            اتصال
                        </button>`
                    }
                    <button class="btn btn-copy" onclick='copyConfig("${server.config_url}")'>کپی لینک</button>
                </div>
            </div>
        `;
    }).join('');
}

// اتصال به VPN
async function connectVPN(server) {
    try {
        console.log('در حال اتصال به سرور:', server.name);
        
        // نمایش پیام در حال اتصال
        showNotification('در حال اتصال', 'لطفاً صبر کنید...');
        
        // اتصال واقعی به VPN با v2ray
        await v2rayManager.start(server.config_url);
        
        currentState.isConnected = true;
        currentState.connectedServer = server;
        
        updateConnectionStatus();
        renderServers();
        
        showNotification('موفقیت', `✓ به سرور "${server.name}" متصل شدید\n\nحالا تمام ترافیک شما از VPN می‌گذرد!`);
        
    } catch (error) {
        console.error('خطا در اتصال:', error);
        currentState.isConnected = false;
        currentState.connectedServer = null;
        updateConnectionStatus();
        
        let errorMessage = 'خطا در اتصال به سرور';
        if (error.message) {
            errorMessage += '\n\n' + error.message;
        }
        showNotification('خطا', errorMessage);
    }
}

// قطع اتصال VPN
async function disconnectVPN() {
    try {
        console.log('در حال قطع اتصال...');
        
        // قطع اتصال واقعی VPN
        await v2rayManager.stop();
        
        currentState.isConnected = false;
        currentState.connectedServer = null;
        
        updateConnectionStatus();
        renderServers();
        
        showNotification('اطلاع', '✓ اتصال قطع شد\n\nProxy سیستم غیرفعال شد');
        
    } catch (error) {
        console.error('خطا در قطع اتصال:', error);
        showNotification('خطا', 'خطا در قطع اتصال');
    }
}

// کپی کردن کانفیگ
function copyConfig(configUrl) {
    navigator.clipboard.writeText(configUrl).then(() => {
        showNotification('موفقیت', 'لینک کانفیگ کپی شد');
    }).catch(err => {
        console.error('خطا در کپی:', err);
    });
}

// به‌روزرسانی وضعیت اتصال
function updateConnectionStatus() {
    if (currentState.isConnected && currentState.connectedServer) {
        elements.status.classList.add('connected');
        elements.statusText.textContent = 'متصل';
        elements.connectionPanel.classList.add('connected');
        elements.connectionTitle.textContent = 'متصل به سرور';
        elements.connectionMessage.textContent = `سرور: ${currentState.connectedServer.name}`;
        elements.disconnectBtn.style.display = 'block';
    } else {
        elements.status.classList.remove('connected');
        elements.statusText.textContent = 'غیرفعال';
        elements.connectionPanel.classList.remove('connected');
        elements.connectionTitle.textContent = 'وضعیت اتصال';
        elements.connectionMessage.textContent = 'به سرور متصل نیستید';
        elements.disconnectBtn.style.display = 'none';
    }
}

// نمایش نوتیفیکیشن
function showNotification(title, message) {
    // می‌توانید از Electron Notification API استفاده کنید
    console.log(`${title}: ${message}`);
    alert(`${title}\n${message}`);
}

// بازگشت به دسته‌بندی‌ها
elements.backBtn.addEventListener('click', () => {
    elements.serversSection.style.display = 'none';
    currentState.selectedCategory = null;
});

// قطع اتصال از دکمه بالا
elements.disconnectBtn.addEventListener('click', disconnectVPN);

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    updateConnectionStatus();
});

