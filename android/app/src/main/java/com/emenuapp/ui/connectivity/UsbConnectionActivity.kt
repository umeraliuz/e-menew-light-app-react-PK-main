package com.emenuapp_pk.ui.connectivity

import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import com.emenuapp_pk.R
import com.emenuapp_pk.databinding.ActivityUsbConnectionBinding
import com.emenuapp_pk.ext.alert
import com.emenuapp_pk.ext.toast
import com.emenew.genericprnt.connection.usb.UsbPrintersConnections
import com.emenuapp_pk.data.local.db.DbHelper
import com.emenuapp_pk.ui.base.BaseActivity
import com.emenuapp_pk.ui.printer.AddGenericPrinterFragment
import com.emenuapp_pk.utils.AppConstants

class UsbConnectionActivity : BaseActivity<ActivityUsbConnectionBinding>() {

    private val usbReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val action = intent.action
            if (AppConstants.ACTION_USB_PERMISSION == action) {
                synchronized(this) {
                    val usbManager = getSystemService(USB_SERVICE) as UsbManager
                    val usbDevice = intent.getParcelableExtra<UsbDevice>(UsbManager.EXTRA_DEVICE)
                    if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
                        if (usbDevice != null) {
                            postConnectionEvent(usbDevice)
                        }
                    }
                }
            }
        }
    }

    override fun provideBinding(): ActivityUsbConnectionBinding {
        return ActivityUsbConnectionBinding.inflate(layoutInflater)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Handler(Looper.getMainLooper()).postDelayed({
            connectPrinter()
        }, 100)
    }

    private fun connectPrinter() {
        val usbConnection = UsbPrintersConnections.selectFirstConnected(this)
        val usbManager = getSystemService(USB_SERVICE) as UsbManager

        if (usbConnection == null) {
            alert("No USB printer found.")
            return
        }

        if (usbManager.hasPermission(usbConnection.device)) {
            postConnectionEvent(usbConnection.device)
        } else {
            val permissionIntent = PendingIntent.getBroadcast(
                this,
                0,
                Intent(AppConstants.ACTION_USB_PERMISSION),
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            )
            val filter = IntentFilter(AppConstants.ACTION_USB_PERMISSION)
            registerReceiver(usbReceiver, filter)
            usbManager.requestPermission(usbConnection.device, permissionIntent)
        }
    }

    private fun postConnectionEvent(device: UsbDevice) {
        val identifier: String = AddGenericPrinterFragment.getConfigString(device)
        DbHelper.instance.getPrinterByIdentifier(identifier)?.let { printer ->
            toast(getString(R.string.connected_printer, "${printer.model} (${printer.tag})"))
        }
        finish()
    }
}