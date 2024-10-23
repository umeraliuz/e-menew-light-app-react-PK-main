package com.emenuapp_pk.ui.print

import android.annotation.SuppressLint
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbManager
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import com.emenew.genericprnt.EscPosPrinter
import com.emenew.genericprnt.connection.usb.UsbConnection
import com.emenew.genericprnt.connection.usb.UsbPrintersConnections
import com.emenew.genericprnt.exceptions.EscPosBarcodeException
import com.emenew.genericprnt.exceptions.EscPosConnectionException
import com.emenew.genericprnt.exceptions.EscPosEncodingException
import com.emenew.genericprnt.exceptions.EscPosParserException
import com.emenuapp_pk.BuildConfig
import com.emenuapp_pk.R
import com.emenuapp_pk.databinding.ActivityPrinterInfoBinding
import com.emenuapp_pk.ext.alert
import com.emenuapp_pk.ui.base.BaseActivity
import com.emenuapp_pk.utils.AppConstants

class PrinterInfoActivity : BaseActivity<ActivityPrinterInfoBinding>() {

    private var isConnectAndPrint = false
    private var mUsbConnection: UsbConnection? = null

    private val usbReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val action = intent.action
            if (AppConstants.ACTION_USB_PERMISSION == action) {
                synchronized(this) {
                    val usbManager = getSystemService(Context.USB_SERVICE) as UsbManager
                    val usbDevice = intent.getParcelableExtra<UsbDevice>(UsbManager.EXTRA_DEVICE)
                    if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
                        if (usbDevice != null) {
                            mUsbConnection = UsbConnection(usbManager, usbDevice)
                            updateInfo()
                            if (isConnectAndPrint) {
                                printText()
                            }
                        }
                    }
                }
            }
        }
    }

    override fun provideBinding(): ActivityPrinterInfoBinding {
        return ActivityPrinterInfoBinding.inflate(layoutInflater)
    }

    @SuppressLint("SetTextI18n")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding.toolbar.setTitle(R.string.printer_info)
        setSupportActionBar(binding.toolbar)

        binding.content.printText.setText("Testing...")
        binding.content.printButton.setOnClickListener { printText() }
        connectPrinter()
    }

    @SuppressLint("MissingSuperCall")
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        connectPrinter()
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_add_printer, menu)
        return super.onCreateOptionsMenu(menu)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == R.id.action_detect) {
            connectPrinter()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    private fun connectPrinter() {
        val usbConnection = UsbPrintersConnections.selectFirstConnected(this)
        val usbManager = this.getSystemService(Context.USB_SERVICE) as UsbManager
        if (usbConnection == null) {
            alert("No USB printer found.")
            updateInfo()
            return
        }

        if (usbManager.hasPermission(usbConnection.device)) {
            mUsbConnection = UsbConnection(usbManager, usbConnection.device)
            updateInfo()
        } else {
            val permissionIntent =
                PendingIntent.getBroadcast(
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

    fun updateInfo() {
        if (mUsbConnection != null && mUsbConnection!!.device != null) {
            val device = mUsbConnection!!.device
            binding.content.productName.text = device.productName
            binding.content.productId.text = device.productId.toString()
            binding.content.deviceName.text = device.deviceName
            binding.content.deviceId.text = device.deviceId.toString()
            binding.content.vendorName.text = device.manufacturerName
            binding.content.vendorId.text = device.vendorId.toString()
            binding.content.printTestLayout.visibility = View.VISIBLE
        } else {
            binding.content.productName.text = "-"
            binding.content.productId.text = "-"
            binding.content.deviceName.text = "-"
            binding.content.deviceId.text = "-"
            binding.content.vendorName.text = "-"
            binding.content.vendorId.text = "-"
            binding.content.printTestLayout.visibility = View.GONE
        }
    }

    private fun printText() {
        if (mUsbConnection == null) {
            isConnectAndPrint = true
            connectPrinter()
        }

        if (isConnectAndPrint) {
            isConnectAndPrint = false
        }
        val printText = binding.content.printText.text.toString().trim { it <= ' ' }
        if (printText.isEmpty()) {
            alert(R.string.error_print_text)
            return
        }
        try {
            val printer = EscPosPrinter(
                mUsbConnection,
                203,
                48f,
                32
            )
            printer.printFormattedTextAndCut(printText, 10f)
            printer.disconnectPrinter()
        } catch (e: EscPosConnectionException) {
            e.printStackTrace()
            if (BuildConfig.DEBUG) {
                alert(e.message.toString())
            } else {
                alert(R.string.unknown_error_message)
            }
        } catch (e: EscPosBarcodeException) {
            e.printStackTrace()
            if (BuildConfig.DEBUG) {
                alert(e.message.toString())
            } else {
                alert(R.string.unknown_error_message)
            }
        } catch (e: EscPosEncodingException) {
            e.printStackTrace()
            if (BuildConfig.DEBUG) {
                alert(e.message.toString())
            } else {
                alert(R.string.unknown_error_message)
            }
        } catch (e: EscPosParserException) {
            e.printStackTrace()
            if (BuildConfig.DEBUG) {
                alert(e.message.toString())
            } else {
                alert(R.string.unknown_error_message)
            }
        }
    }
}