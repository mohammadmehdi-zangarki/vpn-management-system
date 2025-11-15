package com.vpnapp

import android.content.Intent
import android.net.VpnService
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class V2RayVPNModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val TAG = "V2RayVPNModule"
    private var isConnected = false
    private var currentConfig: String? = null

    override fun getName(): String {
        return "V2RayVPN"
    }

    /**
     * درخواست مجوز VPN از کاربر
     */
    @ReactMethod
    fun requestVPNPermission(promise: Promise) {
        try {
            val intent = VpnService.prepare(reactApplicationContext)
            if (intent != null) {
                // نیاز به مجوز کاربر
                currentActivity?.startActivityForResult(intent, VPN_REQUEST_CODE)
                promise.resolve(false) // نیاز به مجوز
            } else {
                // قبلاً مجوز داده شده
                promise.resolve(true)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error requesting VPN permission", e)
            promise.reject("VPN_PERMISSION_ERROR", e.message)
        }
    }

    /**
     * اتصال به سرور VPN
     * @param configUrl - لینک کانفیگ vless:// یا vmess://
     */
    @ReactMethod
    fun connect(configUrl: String, promise: Promise) {
        try {
            Log.d(TAG, "Attempting to connect with config: $configUrl")

            // پارس کردن کانفیگ
            val config = parseVlessConfig(configUrl)
            if (config == null) {
                promise.reject("INVALID_CONFIG", "کانفیگ نامعتبر است")
                return
            }

            // در اینجا باید V2Ray Core را فراخوانی کنید
            // برای مثال:
            // V2RayCore.start(config)
            
            // فعلاً شبیه‌سازی می‌کنیم
            isConnected = true
            currentConfig = configUrl
            
            // ارسال رویداد به React Native
            sendEvent("onVPNStateChanged", createStateMap(true, "Connected"))

            Log.d(TAG, "VPN Connected successfully")
            
            val result = Arguments.createMap().apply {
                putBoolean("success", true)
                putString("message", "به سرور متصل شدید")
                putString("config", configUrl)
            }
            promise.resolve(result)

        } catch (e: Exception) {
            Log.e(TAG, "Error connecting to VPN", e)
            promise.reject("CONNECTION_ERROR", e.message)
        }
    }

    /**
     * قطع اتصال VPN
     */
    @ReactMethod
    fun disconnect(promise: Promise) {
        try {
            Log.d(TAG, "Disconnecting VPN")

            // در اینجا باید V2Ray Core را متوقف کنید
            // برای مثال:
            // V2RayCore.stop()

            isConnected = false
            currentConfig = null

            // ارسال رویداد به React Native
            sendEvent("onVPNStateChanged", createStateMap(false, "Disconnected"))

            Log.d(TAG, "VPN Disconnected successfully")
            
            val result = Arguments.createMap().apply {
                putBoolean("success", true)
                putString("message", "اتصال قطع شد")
            }
            promise.resolve(result)

        } catch (e: Exception) {
            Log.e(TAG, "Error disconnecting VPN", e)
            promise.reject("DISCONNECTION_ERROR", e.message)
        }
    }

    /**
     * دریافت وضعیت اتصال
     */
    @ReactMethod
    fun getConnectionStatus(promise: Promise) {
        val status = Arguments.createMap().apply {
            putBoolean("isConnected", isConnected)
            putString("config", currentConfig)
        }
        promise.resolve(status)
    }

    /**
     * پارس کردن کانفیگ VLESS
     */
    private fun parseVlessConfig(configUrl: String): Map<String, String>? {
        return try {
            if (!configUrl.startsWith("vless://")) {
                return null
            }

            // مثال: vless://uuid@server:port?encryption=none&security=tls&type=tcp#name
            val url = configUrl.removePrefix("vless://")
            val parts = url.split("?", "#")
            
            if (parts.isEmpty()) return null
            
            val credentials = parts[0]
            val (uuid, serverPort) = credentials.split("@")
            val (server, port) = serverPort.split(":")
            
            mapOf(
                "uuid" to uuid,
                "server" to server,
                "port" to port,
                "protocol" to "vless"
            )
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing vless config", e)
            null
        }
    }

    /**
     * ارسال رویداد به React Native
     */
    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    /**
     * ایجاد نقشه وضعیت
     */
    private fun createStateMap(isConnected: Boolean, message: String): WritableMap {
        return Arguments.createMap().apply {
            putBoolean("isConnected", isConnected)
            putString("message", message)
        }
    }

    companion object {
        private const val VPN_REQUEST_CODE = 24
    }
}

