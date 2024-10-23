package com.emenuapp_pk.utils

import android.net.InetAddresses
import android.os.Build
import android.util.Patterns

object NetworkingUtils {
    @Suppress("DEPRECATION")
    fun isValidIpAddress(ip: String): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            InetAddresses.isNumericAddress(ip)
        } else {
            Patterns.IP_ADDRESS.matcher(ip).matches()
        }
    }
}