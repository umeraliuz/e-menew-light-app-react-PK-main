package com.emenuapp_pk.ui.print

import android.app.Activity
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Bitmap
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.Parcelable
import com.emenew.genericprnt.connection.DeviceConnection
import com.emenew.genericprnt.connection.bluetooth.BluetoothConnections
import com.emenew.genericprnt.connection.usb.UsbConnection
import com.emenew.genericprnt.connection.usb.UsbPrintersConnections
import com.emenuapp_pk.data.local.model.PrinterReceipt
import com.emenuapp_pk.data.local.model.PrinterType
import com.emenuapp_pk.data.local.model.SavedPrinter
import com.emenuapp_pk.databinding.ActivityPrintPreviewBinding
import com.emenuapp_pk.ext.toast
import com.emenuapp_pk.parser.RasterPrintParser
import com.emenuapp_pk.ui.base.BaseActivity
import com.emenuapp_pk.utils.AppConstants
import com.emenuapp_pk.utils.InnerPrinterUtils

class SunmiPrintActivity : BaseActivity<ActivityPrintPreviewBinding>() {

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
                                    executeCommand(usbConnection, r, p)
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
        when (PrinterType.getById(printer.type)) {
            is PrinterType.UsbPrinter -> connectUsbPrinter(receipt, printer)
            is PrinterType.BluetoothPrinter -> connectBluetoothPrinter(receipt, printer)
            is PrinterType.InternalPrinter -> connectInnerPrinter(receipt, printer)
            else -> connectNetworkPrinter()
        }
    }

    private fun connectNetworkPrinter() {
        setResult(Activity.RESULT_CANCELED)
        finish()
        return
    }

    private fun connectBluetoothPrinter(receipt: PrinterReceipt, printer: SavedPrinter) {
        val bluetoothConnection = BluetoothConnections.selectSpecificPrinter(
            BluetoothConnections(),
            printer.macAddress
        )

        if (bluetoothConnection == null) {
            setResult(Activity.RESULT_CANCELED)
            finish()
            return
        }

        executeCommand(bluetoothConnection, receipt, printer)
    }

    private fun connectInnerPrinter(receipt: PrinterReceipt, printer: SavedPrinter) {
        if (!InnerPrinterUtils.getInstance().isServiceConnected()) {
            setResult(Activity.RESULT_CANCELED)
            finish()
            return
        }

        executeCommand(receipt, printer, PrintActivity.bitmaps)
    }

    private fun connectUsbPrinter(receipt: PrinterReceipt, printer: SavedPrinter) {
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
            executeCommand(usbConnection, receipt, printer)
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
        receipt: PrinterReceipt,
        savedPrinter: SavedPrinter,
        bitmaps: Map<String, Bitmap>
    ) {
        try {
            when (receipt.command) {
                RasterPrintParser.PrintCommand.PRINT -> {
                    InnerPrinterUtils.getInstance().printReceipt(receipt, bitmaps) { status ->
                        if (status == AsyncEscPosPrint.FINISH_SUCCESS) {
                            setResult(Activity.RESULT_OK)
                            finish()
                        }
                    }
                }
                RasterPrintParser.PrintCommand.CASH_DRAWER -> {
                    InnerPrinterUtils.getInstance().openCashDrawer() { status ->
                        if (status == AsyncEscPosPrint.FINISH_SUCCESS) {
                            setResult(Activity.RESULT_OK)
                            goBack()
                        }
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            toast(e.message.toString())
            setResult(Activity.RESULT_CANCELED, Intent().apply {
                putExtra("message", e.message)
            })
            goBack()
        }
    }

    private fun executeCommand(
        deviceConnection: DeviceConnection,
        receipt: PrinterReceipt,
        savedPrinter: SavedPrinter
    ) {
        executeCommand(
            deviceConnection,
            receipt.command,
            receipt.data,
            PrintActivity.bitmaps,
            savedPrinter.paperSize,
            savedPrinter.charsetEncoding,
            receipt.isOpenDrawer
        )
    }

    private fun executeCommand(
        deviceConnection: DeviceConnection,
        command: RasterPrintParser.PrintCommand,
        data: String,
        bitmaps: Map<String, Bitmap>,
        paperSize: Int,
        charsetEncoding: Int,
        isOpenDrawer: Boolean
    ) {
        try {
            val genericPrinter = GenericPrinter(
                this,
                deviceConnection,
                paperSize,
                charsetEncoding
            )

            when (command) {
                RasterPrintParser.PrintCommand.PRINT -> {
                    genericPrinter.print(
                        data,
                        bitmaps,
                        isOpenDrawer
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
                            //finish()
                            goBack()
                        }
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            toast(e.message.toString())
            setResult(Activity.RESULT_CANCELED, Intent().apply {
                putExtra("message", e.message)
            })
            //finish()
            goBack()
        }
    }

    private fun goBack() {
        Handler(Looper.getMainLooper()).postDelayed({
            finish()
        }, 2000)
    }

    companion object {
        private const val EXTRA_RECEIPT = "receipt"
        private const val EXTRA_PRINTER = "printer"

        fun getIntent(
            ctx: Context,
            receipt: PrinterReceipt,
            savedPrinter: SavedPrinter
        ) = Intent(
            ctx,
            SunmiPrintActivity::class.java
        ).apply {
            putExtra(EXTRA_RECEIPT, receipt)
            putExtra(EXTRA_PRINTER, savedPrinter)
        }
    }
}