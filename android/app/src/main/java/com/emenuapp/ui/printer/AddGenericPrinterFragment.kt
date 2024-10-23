package com.emenuapp_pk.ui.printer

import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbManager
import android.text.InputType
import android.view.View
import android.widget.ArrayAdapter
import androidx.appcompat.app.AlertDialog
import androidx.navigation.fragment.findNavController
import com.emenew.genericprnt.EscPosCharsetEncoding
import com.emenew.genericprnt.EscPosPrinter
import com.emenew.genericprnt.connection.usb.UsbConnection
import com.emenew.genericprnt.connection.usb.UsbPrintersConnections
import com.emenuapp_pk.BuildConfig
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.db.DbHelper
import com.emenuapp_pk.data.local.model.*
import com.emenuapp_pk.databinding.FragmentAddGenericPrinterBinding
import com.emenuapp_pk.ext.alert
import com.emenuapp_pk.ext.toast
import com.emenuapp_pk.ui.base.BaseFragment
import com.emenuapp_pk.utils.AppConstants
import com.emenuapp_pk.utils.DialogUtils
import com.google.android.material.chip.Chip


class AddGenericPrinterFragment :
    BaseFragment<FragmentAddGenericPrinterBinding>(R.layout.fragment_add_generic_printer) {

    private lateinit var manufacturer: Manufacturer
    private lateinit var printerType: PrinterType

    private var selectedPrinterTag: String = ""
    private var encoding: EscPosCharsetEncoding =
        EscPosCharsetEncoding()
    private var paperSize: Int = PaperSize.TWO_INCH

    private val usbReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val action = intent.action
            if (AppConstants.ACTION_USB_PERMISSION == action) {
                synchronized(this) {
                    val usbDevice = intent.getParcelableExtra<UsbDevice>(UsbManager.EXTRA_DEVICE)
                    if (intent.getBooleanExtra(
                            UsbManager.EXTRA_PERMISSION_GRANTED,
                            false
                        ) && usbDevice != null
                    ) {
                        val usbManager =
                            requireContext().getSystemService(Context.USB_SERVICE) as UsbManager
                        val usbConnection = UsbConnection(usbManager, usbDevice)
                        addPrinter(usbConnection)
                    }
                }
            }
        }
    }

    override fun provideBinding(view: View): FragmentAddGenericPrinterBinding {
        return FragmentAddGenericPrinterBinding.bind(view)
    }

    override fun setup() {
        val args = AddGenericPrinterFragmentArgs.fromBundle(requireArguments())
        manufacturer = args.manufacturer
        printerType = args.printerType

        searchPrinter()
    }

    private fun searchPrinter() {
        when (printerType) {
            is PrinterType.BluetoothPrinter -> searchBluetoothPrinter()
            is PrinterType.UsbPrinter -> searchUsbPrinter()
            is PrinterType.NetworkPrinter -> searchNetworkPrinter()
            is PrinterType.InternalPrinter -> searchBuiltInPrinter()
        }
    }

    private fun searchBluetoothPrinter() {
        alert(R.string.no_printer_error) { d, _ ->
            d.dismiss()
            findNavController().navigateUp()
        }
    }

    private fun searchUsbPrinter() {
        val upc = UsbPrintersConnections(requireContext())
        val list = upc.list ?: emptyArray()
        val names = Array(list.size) { "" }
        list.forEachIndexed { index, usbConnection ->
            val device = usbConnection.device
            names[index] = "${device.vendorId} - ${device.deviceName}"
        }

        val adapter = ArrayAdapter(
            requireContext(),
            android.R.layout.simple_list_item_1,
            names
        )

        AlertDialog.Builder(requireContext())
            .setCancelable(false)
            .setTitle(getString(R.string.label_select_printer))
            .setSingleChoiceItems(adapter, -1) { d, i ->
                d.dismiss()
                showUsbPrinterInfo(list[i])
            }.setPositiveButton(R.string.cancel) { d, _ ->
                d.dismiss()
                findNavController().navigateUp()
            }.show()
    }

    private fun searchNetworkPrinter() {
        alert(R.string.no_printer_error) { d, _ ->
            d.dismiss()
            findNavController().navigateUp()
        }
    }

    private fun searchBuiltInPrinter() {
        alert(R.string.no_printer_error) { d, _ ->
            d.dismiss()
            findNavController().navigateUp()
        }
    }

    private fun showUsbPrinterInfo(usbConnection: UsbConnection) {
        binding.detailsLayout.visibility = View.VISIBLE

        binding.printerTypeValue.setText(printerType.res)
        binding.printerModelValue.text = usbConnection.device.productName
        binding.printerIdentifierValue.text = getConfigString(usbConnection.device)

       // val printerTags = DbHelper.instance.getPrinterTags()
        val printerTags = listOf(PrinterTag())
        for (printerTag in printerTags) {
            val chip = layoutInflater.inflate(
                R.layout.view_choice_chip,
                binding.printerTags,
                false
            ) as Chip
            chip.text = printerTag.name

            binding.printerTags.addView(chip)
        }


        binding.printerTags.setOnCheckedStateChangeListener { group, checkedIds ->
            group.findViewById<Chip>(group.checkedChipId)?.let { chip ->
                selectedPrinterTag = chip.text.toString().trim()
            } ?: run {
                selectedPrinterTag = ""
            }
        }

        binding.paperSize.inputType = InputType.TYPE_NULL
        binding.paperSize.isFocusable = false
        binding.paperSize.setText(PaperSize.getPaperSizeName(paperSize))
        binding.paperSize.setOnClickListener {
            DialogUtils.paperSizeSelectionDialog(requireContext()) { data ->
                val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

                if (!isCanceled) {
                    findNavController().navigateUp()
                    return@paperSizeSelectionDialog
                }

                paperSize = data.getInt(DialogUtils.EXTRA_PAPER_SIZE, PaperSize.THREE_INCH)
                binding.paperSize.setText(PaperSize.getPaperSizeName(paperSize))
            }
        }

        binding.characterSet.inputType = InputType.TYPE_NULL
        binding.characterSet.isFocusable = false
        binding.characterSet.setText(encoding.name)
        binding.characterSet.setOnClickListener {
            DialogUtils.characterSetSelectionDialog(requireContext()) { data ->
                val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

                if (!isCanceled) {
                    findNavController().navigateUp()
                    return@characterSetSelectionDialog
                }

                val record =
                    data.getInt(DialogUtils.EXTRA_CHARACTER_SET, EscPosCharsetEncoding().record)
                encoding = EscPosCharsetEncoding(record)
                binding.characterSet.setText(encoding.name)
            }
        }

        binding.addPrinterButton.setOnClickListener {
            if (selectedPrinterTag.isEmpty()) {
                toast(getString(R.string.error_printer_tag))
                return@setOnClickListener
            }

            checkPrinterPermissions(usbConnection)
        }
    }

    private fun checkPrinterPermissions(usbConnection: UsbConnection) {
        val usbManager = requireContext().getSystemService(Context.USB_SERVICE) as UsbManager

        if (usbManager.hasPermission(usbConnection.device)) {
            addPrinter(usbConnection)
        } else {
            val permissionIntent = PendingIntent.getBroadcast(
                requireContext(),
                0,
                Intent(AppConstants.ACTION_USB_PERMISSION),
                PendingIntent.FLAG_IMMUTABLE
            )

            val filter = IntentFilter(AppConstants.ACTION_USB_PERMISSION)
            requireContext().registerReceiver(this.usbReceiver, filter)
            usbManager.requestPermission(usbConnection.device, permissionIntent)
        }
    }

    private fun addPrinter(usbConnection: UsbConnection) {
        usbConnection.device?.let { usbDevice ->
            val savedPrinter = SavedPrinter(
                tag = selectedPrinterTag,
                type = printerType.id,
                model = usbDevice.productName ?: "N/A",
                portName = usbDevice.deviceName,
                macAddress = getConfigString(usbDevice),
                charsetEncoding = encoding.record,
                manufacturer = manufacturer.id,
                paperSize = paperSize
            )

            val id = DbHelper.instance.savePrinter(savedPrinter)
            if (id != 0L) {
                testUsbPrinter(usbConnection)
                findNavController().navigateUp()
            } else {
                toast(getString(R.string.add_printer_error_message))
            }
        }
    }

    private fun testUsbPrinter(usbConnection: UsbConnection) {
        try {
            val printer =
                EscPosPrinter(usbConnection, 203, 48f, 32)
            printer.printFormattedTextAndCut("Testing...", 10f)
            printer.disconnectPrinter()
        } catch (e: Exception) {
            e.printStackTrace()
            if (BuildConfig.DEBUG) {
                alert(e.message.toString())
            } else {
                alert(R.string.unknown_error_message)
            }
        }
    }

    companion object {
        fun getConfigString(device: UsbDevice): String {
            return if (device.serialNumber != null) {
                "SN:${device.serialNumber}"
            } else if (device.productName != null) {
                "PN:${device.productName}"
            } else {
                "VI:${device.vendorId}"
            }
        }
    }
}