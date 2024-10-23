package com.emenuapp_pk.ui.printer

import android.annotation.SuppressLint
import android.app.PendingIntent
import android.bluetooth.BluetoothDevice
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbManager
import android.text.InputType
import android.view.View
import androidx.navigation.fragment.findNavController
import com.emenew.genericprnt.EscPosCharsetEncoding
import com.emenew.genericprnt.EscPosPrinter
import com.emenew.genericprnt.connection.bluetooth.BluetoothConnection
import com.emenew.genericprnt.connection.bluetooth.BluetoothConnections
import com.emenew.genericprnt.connection.usb.UsbConnection
import com.emenew.genericprnt.connection.usb.UsbPrintersConnections
import com.emenuapp_pk.BuildConfig
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.db.DbHelper
import com.emenuapp_pk.data.local.model.*
import com.emenuapp_pk.data.local.prefs.PreferencesHelper
import com.emenuapp_pk.databinding.FragmentEditSunmiPrinterBinding
import com.emenuapp_pk.ext.alert
import com.emenuapp_pk.ext.toast
import com.emenuapp_pk.ui.base.BaseFragment
import com.emenuapp_pk.utils.AppConstants
import com.emenuapp_pk.utils.DialogUtils
import com.emenuapp_pk.utils.InnerPrinterUtils
import com.google.android.material.chip.Chip
import com.google.android.material.dialog.MaterialAlertDialogBuilder


class EditSunmiPrinterFragment :
    BaseFragment<FragmentEditSunmiPrinterBinding>(R.layout.fragment_edit_sunmi_printer) {

    private lateinit var printer: SavedPrinter

    private var selectedPrinterTag: String = ""

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
                        showUsbPrinterInfo(usbConnection)
                    }
                }
            }
        }
    }

    override fun provideBinding(view: View): FragmentEditSunmiPrinterBinding {
        return FragmentEditSunmiPrinterBinding.bind(view)
    }

    override fun setup() {
        val args = EditGenericPrinterFragmentArgs.fromBundle(requireArguments())
        printer = args.printer

        searchPrinter()
    }

    private fun searchPrinter() {
        when (PrinterType.getById(printer.type)) {
            is PrinterType.BluetoothPrinter -> searchBluetoothPrinter()
            is PrinterType.UsbPrinter -> connectUsbPrinter()
            is PrinterType.NetworkPrinter -> searchNetworkPrinter()
            is PrinterType.InternalPrinter -> searchBuiltInPrinter()
        }
    }

    private fun searchBluetoothPrinter() {
        val bluetoothConnection = BluetoothConnections.selectSpecificPrinter(
            BluetoothConnections(),
            printer.macAddress
        )

        if (bluetoothConnection == null) {
            toast(R.string.no_printer)
            findNavController().navigateUp()
            return
        }

        showBluetoothPrinterInfo(bluetoothConnection)
    }

    private fun connectUsbPrinter() {
        val usbConnection = UsbPrintersConnections.selectSpecificPrinter(
            requireContext(),
            printer.macAddress
        )
        val usbManager = requireContext().getSystemService(Context.USB_SERVICE) as UsbManager
        if (usbConnection == null) {
            toast(R.string.no_printer)
            findNavController().navigateUp()
            return
        }

        if (usbManager.hasPermission(usbConnection.device)) {
            showUsbPrinterInfo(usbConnection)
        } else {
            val permissionIntent = PendingIntent.getBroadcast(
                requireContext(),
                0,
                Intent(AppConstants.ACTION_USB_PERMISSION),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val filter = IntentFilter(AppConstants.ACTION_USB_PERMISSION)
            requireContext().registerReceiver(usbReceiver, filter)
            usbManager.requestPermission(usbConnection.device, permissionIntent)
        }
    }

    private fun searchNetworkPrinter() {
        alert(R.string.no_printer_error) { d, _ ->
            d.dismiss()
            findNavController().navigateUp()
        }
    }


    private fun searchBuiltInPrinter() {
        binding.detailsLayout.visibility = View.VISIBLE

        val name = InnerPrinterUtils.getInstance().getDeviceName()
        val address = InnerPrinterUtils.getInstance().getIdentifier()

        val printerType = PrinterType.getById(printer.type)
        binding.printerTypeValue.setText(printerType.res)
        binding.printerModelValue.text = name
        binding.printerIdentifierValue.text = address

        val printerTags = DbHelper.instance.getPrinterTags()
        for (printerTag in printerTags) {
            val chip = layoutInflater.inflate(
                R.layout.view_choice_chip,
                binding.printerTags,
                false
            ) as Chip
            chip.text = printerTag.name
            chip.isChecked = printerTag.name == printer.tag
            chip.isEnabled = printerTag.name == printer.tag

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
        binding.paperSize.setText(PaperSize.getPaperSizeName(printer.paperSize))
        binding.paperSize.setOnClickListener {
            DialogUtils.paperSizeSelectionDialog(requireContext()) { data ->
                val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

                if (!isCanceled) {
                    findNavController().navigateUp()
                    return@paperSizeSelectionDialog
                }

                printer.paperSize = data.getInt(DialogUtils.EXTRA_PAPER_SIZE, PaperSize.THREE_INCH)
                binding.paperSize.setText(PaperSize.getPaperSizeName(printer.paperSize))
            }
        }

        binding.instructionType.inputType = InputType.TYPE_NULL
        binding.instructionType.isFocusable = false
        binding.instructionType.setText(InstructionType.getInstructionTypeName(printer.instructionType))
        binding.instructionType.setOnClickListener {
            DialogUtils.instructionTypeSelectionDialog(requireContext()) { data ->
                val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

                if (!isCanceled) {
                    findNavController().navigateUp()
                    return@instructionTypeSelectionDialog
                }

                printer.instructionType =
                    data.getInt(DialogUtils.EXTRA_INSTRUCTIONS_TYPE, InstructionType.POS)
                binding.instructionType.setText(PaperSize.getPaperSizeName(printer.instructionType))
            }
        }

        binding.characterSet.inputType = InputType.TYPE_NULL
        binding.characterSet.isFocusable = false
        binding.characterSet.setText(
            EscPosCharsetEncoding(
                printer.charsetEncoding
            ).name)
        binding.characterSet.setOnClickListener {
            DialogUtils.characterSetSelectionDialog(requireContext()) { data ->
                val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

                if (!isCanceled) {
                    findNavController().navigateUp()
                    return@characterSetSelectionDialog
                }

                printer.charsetEncoding =
                    data.getInt(DialogUtils.EXTRA_CHARACTER_SET, EscPosCharsetEncoding().record)
                binding.characterSet.setText(
                    EscPosCharsetEncoding(
                        printer.charsetEncoding
                    ).name)
            }
        }

        binding.savePrinterButton.setOnClickListener {
            if (printer.tag.isEmpty()) {
                toast(getString(R.string.error_printer_tag))
                return@setOnClickListener
            }

            savePrinter()
        }

        binding.deleteButton.setOnClickListener {
            showDeletePrinterConfirmationDialog()
        }
    }

    @SuppressLint("MissingPermission")
    private fun showBluetoothPrinterInfo(bluetoothConnection: BluetoothConnection) {
        binding.detailsLayout.visibility = View.VISIBLE

        val printerType = PrinterType.getById(printer.type)
        binding.printerTypeValue.setText(printerType.res)
        binding.printerModelValue.text = bluetoothConnection.device.name
        binding.printerIdentifierValue.text = getConfigString(bluetoothConnection.device)

        val printerTags = DbHelper.instance.getPrinterTags()
        for (printerTag in printerTags) {
            val chip = layoutInflater.inflate(
                R.layout.view_choice_chip,
                binding.printerTags,
                false
            ) as Chip
            chip.text = printerTag.name
            chip.isChecked = printerTag.name == printer.tag
            chip.isEnabled = printerTag.name == printer.tag

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
        binding.paperSize.setText(PaperSize.getPaperSizeName(printer.paperSize))
        binding.paperSize.setOnClickListener {
            DialogUtils.paperSizeSelectionDialog(requireContext()) { data ->
                val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

                if (!isCanceled) {
                    findNavController().navigateUp()
                    return@paperSizeSelectionDialog
                }

                printer.paperSize = data.getInt(DialogUtils.EXTRA_PAPER_SIZE, PaperSize.THREE_INCH)
                binding.paperSize.setText(PaperSize.getPaperSizeName(printer.paperSize))
            }
        }

        binding.instructionType.inputType = InputType.TYPE_NULL
        binding.instructionType.isFocusable = false
        binding.instructionType.setText(InstructionType.getInstructionTypeName(printer.instructionType))
        binding.instructionType.setOnClickListener {
            DialogUtils.instructionTypeSelectionDialog(requireContext()) { data ->
                val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

                if (!isCanceled) {
                    findNavController().navigateUp()
                    return@instructionTypeSelectionDialog
                }

                printer.instructionType =
                    data.getInt(DialogUtils.EXTRA_INSTRUCTIONS_TYPE, InstructionType.POS)
                binding.instructionType.setText(PaperSize.getPaperSizeName(printer.instructionType))
            }
        }

        binding.characterSet.inputType = InputType.TYPE_NULL
        binding.characterSet.isFocusable = false
        binding.characterSet.setText(
            EscPosCharsetEncoding(
                printer.charsetEncoding
            ).name)
        binding.characterSet.setOnClickListener {
            DialogUtils.characterSetSelectionDialog(requireContext()) { data ->
                val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

                if (!isCanceled) {
                    findNavController().navigateUp()
                    return@characterSetSelectionDialog
                }

                printer.charsetEncoding =
                    data.getInt(DialogUtils.EXTRA_CHARACTER_SET, EscPosCharsetEncoding().record)
                binding.characterSet.setText(
                    EscPosCharsetEncoding(
                        printer.charsetEncoding
                    ).name)
            }
        }

        binding.savePrinterButton.setOnClickListener {
            if (printer.tag.isEmpty()) {
                toast(getString(R.string.error_printer_tag))
                return@setOnClickListener
            }

            savePrinter(bluetoothConnection)
        }

        binding.deleteButton.setOnClickListener {
            showDeletePrinterConfirmationDialog()
        }
    }

    private fun showUsbPrinterInfo(usbConnection: UsbConnection) {
        binding.detailsLayout.visibility = View.VISIBLE

        val printerType = PrinterType.getById(printer.type)
        binding.printerTypeValue.setText(printerType.res)
        binding.printerModelValue.text = usbConnection.device.productName
        binding.printerIdentifierValue.text = getConfigString(usbConnection.device)


        //val printerTags = DbHelper.instance.getPrinterTags()
        val printerTags = listOf(PrinterTag())
        for (printerTag in printerTags) {
            val chip = layoutInflater.inflate(
                R.layout.view_choice_chip,
                binding.printerTags,
                false
            ) as Chip
            chip.text = printerTag.name
            chip.isChecked = printerTag.name == printer.tag
            chip.isEnabled = printerTag.name == printer.tag

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
        binding.paperSize.setText(PaperSize.getPaperSizeName(printer.paperSize))
        binding.paperSize.setOnClickListener {
            DialogUtils.paperSizeSelectionDialog(requireContext()) { data ->
                val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

                if (!isCanceled) {
                    findNavController().navigateUp()
                    return@paperSizeSelectionDialog
                }

                printer.paperSize = data.getInt(DialogUtils.EXTRA_PAPER_SIZE, PaperSize.THREE_INCH)
                binding.paperSize.setText(PaperSize.getPaperSizeName(printer.paperSize))
            }
        }

        binding.instructionType.inputType = InputType.TYPE_NULL
        binding.instructionType.isFocusable = false
        binding.instructionType.setText(InstructionType.getInstructionTypeName(printer.instructionType))
        binding.instructionType.setOnClickListener {
            DialogUtils.instructionTypeSelectionDialog(requireContext()) { data ->
                val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

                if (!isCanceled) {
                    findNavController().navigateUp()
                    return@instructionTypeSelectionDialog
                }

                printer.instructionType =
                    data.getInt(DialogUtils.EXTRA_INSTRUCTIONS_TYPE, InstructionType.POS)
                binding.instructionType.setText(PaperSize.getPaperSizeName(printer.instructionType))
            }
        }

        binding.characterSet.inputType = InputType.TYPE_NULL
        binding.characterSet.isFocusable = false
        binding.characterSet.setText(
            EscPosCharsetEncoding(
                printer.charsetEncoding
            ).name)
        binding.characterSet.setOnClickListener {
            DialogUtils.characterSetSelectionDialog(requireContext()) { data ->
                val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

                if (!isCanceled) {
                    findNavController().navigateUp()
                    return@characterSetSelectionDialog
                }

                printer.charsetEncoding =
                    data.getInt(DialogUtils.EXTRA_CHARACTER_SET, EscPosCharsetEncoding().record)
                binding.characterSet.setText(
                    EscPosCharsetEncoding(
                        printer.charsetEncoding
                    ).name)
            }
        }

        binding.savePrinterButton.setOnClickListener {
            if (printer.tag.isEmpty()) {
                toast(getString(R.string.error_printer_tag))
                return@setOnClickListener
            }

            checkPrinterPermissions(usbConnection)
        }

        binding.deleteButton.setOnClickListener {
            showDeletePrinterConfirmationDialog()
        }
    }

    private fun showDeletePrinterConfirmationDialog() {
        MaterialAlertDialogBuilder(requireContext())
            .setCancelable(false)
            .setTitle(R.string.confirm)
            .setMessage(getString(R.string.remove_printer_confirm_message, printer.model))
            .setPositiveButton(R.string.yes) { d, _ ->
                d.dismiss()
                if (PreferencesHelper.instance.defaultPrinter == printer.id) {
                    PreferencesHelper.instance.defaultPrinter = 0
                }
                DbHelper.instance.deletePrinter(printer.id)
                findNavController().navigateUp()
            }.setNegativeButton(R.string.no) { d, _ ->
                d.dismiss()
            }.show()
    }

    private fun checkPrinterPermissions(usbConnection: UsbConnection) {
        val usbManager = requireContext().getSystemService(Context.USB_SERVICE) as UsbManager

        if (usbManager.hasPermission(usbConnection.device)) {
            savePrinter(usbConnection)
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

    private fun savePrinter() {
        val savedPrinter = printer
        val id = DbHelper.instance.savePrinter(savedPrinter)
        if (id != 0L) {
            InnerPrinterUtils.getInstance().testPrint()
            findNavController().navigateUp()
        } else {
            toast(getString(R.string.add_printer_error_message))
        }
    }

    private fun savePrinter(bluetoothConnection: BluetoothConnection) {
        bluetoothConnection.device?.let { bluetoothDevice ->
            val savedPrinter = printer

            val id = DbHelper.instance.savePrinter(savedPrinter)
            if (id != 0L) {
                testBluetoothPrinter(bluetoothConnection)
                findNavController().navigateUp()
            } else {
                toast(getString(R.string.add_printer_error_message))
            }
        }
    }

    private fun savePrinter(usbConnection: UsbConnection) {
        usbConnection.device?.let { usbDevice ->
            val savedPrinter = printer

            val id = DbHelper.instance.savePrinter(savedPrinter)
            if (id != 0L) {
                testUsbPrinter(usbConnection)
                findNavController().navigateUp()
            } else {
                toast(getString(R.string.add_printer_error_message))
            }
        }
    }

    private fun testBluetoothPrinter(bluetoothConnection: BluetoothConnection) {
        try {
            val printer = EscPosPrinter(
                bluetoothConnection,
                203,
                48f,
                32
            )
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

        fun getConfigString(device: BluetoothDevice): String {
            return device.address
        }
    }
}