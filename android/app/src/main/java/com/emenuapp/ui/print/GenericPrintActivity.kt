package com.emenuapp_pk.ui.print

import android.app.Activity
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbManager
import android.os.Bundle
import android.os.Parcelable
import com.emenew.genericprnt.connection.usb.UsbConnection
import com.emenew.genericprnt.connection.usb.UsbPrintersConnections
import com.emenuapp_pk.data.local.model.PrinterReceipt
import com.emenuapp_pk.data.local.model.SavedPrinter
import com.emenuapp_pk.databinding.ActivityPrintPreviewBinding
import com.emenuapp_pk.parser.RasterPrintParser
import com.emenuapp_pk.ui.base.BaseActivity
import com.emenuapp_pk.utils.AppConstants

class GenericPrintActivity : BaseActivity<ActivityPrintPreviewBinding>() {

    private var receipt: PrinterReceipt? = null
    private var printer: SavedPrinter? = null

    private val usbReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val action = intent.action
            if (AppConstants.ACTION_USB_PERMISSION == action) {
                synchronized(this) {
                    val usbManager = getSystemService(Context.USB_SERVICE) as UsbManager
                    val usbDevice =
                        intent.getParcelableExtra<Parcelable>(UsbManager.EXTRA_DEVICE) as UsbDevice?
                    if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
                        if (usbDevice != null) {
                            val usbConnection = UsbConnection(usbManager, usbDevice)
                            printer?.let { p ->
                                receipt?.let { r ->
                                    executeCommand(usbConnection, r, p.paperSize, p.charsetEncoding)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    override fun provideBinding(): ActivityPrintPreviewBinding {
        return ActivityPrintPreviewBinding.inflate(layoutInflater)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        receipt = intent.getParcelableExtra(EXTRA_RECEIPT)
        printer = intent.getParcelableExtra(EXTRA_PRINTER)

        receipt?.let { r ->
            printer?.let { p ->
                when (r.command) {
                    RasterPrintParser.PrintCommand.PRINT -> {
                        connectPrinter(r, p)
                    }
                    RasterPrintParser.PrintCommand.CASH_DRAWER -> {
                        connectPrinter(r, p)
                    }
                }
            }
        }
    }

    private fun connectPrinter(receipt: PrinterReceipt, printer: SavedPrinter) {
        val usbConnection = UsbPrintersConnections.selectSpecificPrinter(
            this,
            printer.macAddress
        )
        val usbManager = this.getSystemService(Context.USB_SERVICE) as UsbManager
        if (usbConnection == null) {
            setResult(Activity.RESULT_CANCELED)
            finish()
            return
        }

        if (usbManager.hasPermission(usbConnection.device)) {
            executeCommand(usbConnection, receipt, printer.paperSize, printer.charsetEncoding)
        } else {
            val permissionIntent = PendingIntent.getBroadcast(
                this,
                0,
                Intent(AppConstants.ACTION_USB_PERMISSION),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val filter = IntentFilter(AppConstants.ACTION_USB_PERMISSION)
            registerReceiver(usbReceiver, filter)
            usbManager.requestPermission(usbConnection.device, permissionIntent)
        }
    }

    private fun executeCommand(
        usbConnection: UsbConnection,
        receipt: PrinterReceipt,
        paperSize: Int,
        characterSet: Int,
    ) {
        try {
            val genericPrinter = GenericPrinter(
                this,
                usbConnection,
                paperSize,
                characterSet
            )

            when (receipt.command) {
                RasterPrintParser.PrintCommand.PRINT -> {
                    genericPrinter.print(
                        receipt.data,
                        PrintActivity.bitmaps,
                        receipt.isOpenDrawer
                    ) { status, _ ->
                        if (status == AsyncEscPosPrint.FINISH_SUCCESS) {
                            setResult(Activity.RESULT_OK)
                            finish()
                        }
                    }
                }
                RasterPrintParser.PrintCommand.CASH_DRAWER -> {
                    genericPrinter.openDrawer { status, _ ->
                        if (status == AsyncEscPosPrint.FINISH_SUCCESS) {
                            setResult(Activity.RESULT_OK)
                            finish()
                        }
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            val data = Intent().apply {
                putExtra("message", e.message)
            }
            setResult(Activity.RESULT_CANCELED, data)
            finish()
        }
    }

    companion object {
        private const val EXTRA_RECEIPT = "receipt";
        private const val EXTRA_PRINTER = "printer"

        fun getIntent (
            ctx: Context,
            receipt: PrinterReceipt,
            savedPrinter: SavedPrinter
        ) = Intent (
            ctx,
            GenericPrintActivity::class.java
        ).apply {
            putExtra(EXTRA_RECEIPT, receipt)
            putExtra(EXTRA_PRINTER, savedPrinter)
        }
    }
}