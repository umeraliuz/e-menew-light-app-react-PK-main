package com.emenuapp_pk.ui.printer

import android.annotation.SuppressLint
import android.text.InputType
import android.view.View
import android.widget.ArrayAdapter
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.emenew.genericprnt.EscPosCharsetEncoding

import com.emenuapp_pk.data.local.model.*

import com.emenuapp_pk.ext.toast

import com.emenuapp_pk.utils.DialogUtils
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.db.DbHelper
import com.emenuapp_pk.databinding.FragmentAddStartPrinterBinding
import com.emenuapp_pk.ui.base.BaseFragment
import com.google.android.material.chip.Chip
import com.starmicronics.stario.PortInfo
import com.starmicronics.stario.StarIOPort
import io.ezeelabs.starprnt.data.model.InterfaceType
import io.ezeelabs.starprnt.utils.ModelCapability
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AddStarPrinterFragment :
    BaseFragment<FragmentAddStartPrinterBinding>(R.layout.fragment_add_start_printer) {

    private lateinit var manufacturer: Manufacturer
    private lateinit var printerType: PrinterType

    private var encoding: EscPosCharsetEncoding = EscPosCharsetEncoding()

    private var selectedPrinterTag: String = ""
    private var modelIndex: Int = ModelCapability.NONE
    private var portName: String = ""
    private var portSettings: String = ""
    private var macAddress: String = ""
    private var modelName: String = ""
    private var paperSize: Int = PaperSize.THREE_INCH
    private var drawerOpenStatus: Boolean = true

    private var currentAction: Int = 0

    override fun provideBinding(view: View): FragmentAddStartPrinterBinding {
        return FragmentAddStartPrinterBinding.bind(view)
    }

    override fun setup() {
        val args = AddStarPrinterFragmentArgs.fromBundle(requireArguments())
        manufacturer = args.manufacturer
        printerType = args.printerType

        val interfaceType = getInterfaceType()

        performSearch(interfaceType)
    }

    private fun performSearch(interfaceType: String) {
        showProgress(R.string.loading)
        lifecycleScope.launch(Dispatchers.IO) {
            val list = searchPrinter(interfaceType)
            withContext(Dispatchers.Main) {
                hideProgress()
                showDevices(list, interfaceType)
            }
        }
    }

    private fun searchPrinter(interfaceType: String): List<PortInfo> {
        val list = try {
            StarIOPort.searchPrinter(interfaceType)
        } catch (e: Exception) {
            emptyList()
        }

        return list
    }

    private fun getInterfaceType(): String {
        return when (printerType.id) {
            0 -> InterfaceType.TYPE_BLUETOOTH
            1 -> InterfaceType.TYPE_ETHERNET
            2 -> InterfaceType.TYPE_USB
            else -> InterfaceType.TYPE_MANUAL
        }
    }

    private fun showDevices(list: List<PortInfo>, interfaceType: String) {
        if (list.isEmpty()) {
            toast(R.string.no_printer)
            findNavController().navigateUp()
            return
        }

        val names = Array(list.size) { "" }
        list.forEachIndexed { index, portInfo ->
            names[index] = if (interfaceType == InterfaceType.TYPE_BLUETOOTH) {
                portInfo.portName.substring(InterfaceType.TYPE_BLUETOOTH.length)
            } else {
                portInfo.modelName
            }
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
                parsePrinterInfo(list[i])
            }.setPositiveButton(R.string.cancel) { d, _ ->
                d.dismiss()
                findNavController().navigateUp()
            }.show()
    }

    @SuppressLint("SetTextI18n")
    private fun parsePrinterInfo(info: PortInfo) {
        if (info.portName.startsWith(InterfaceType.TYPE_BLUETOOTH)) {
            modelName = info.portName.substring(InterfaceType.TYPE_BLUETOOTH.length)
            portName = InterfaceType.TYPE_BLUETOOTH + info.macAddress
            macAddress = info.macAddress
        } else {
            modelName = info.modelName
            portName = info.portName
            macAddress = info.macAddress
        }

        val model = ModelCapability.getModel(modelName)
        if (model == ModelCapability.NONE) {
            showModelSelectionDialog()
        } else {
            showModelConfirmationDialog(model)
        }
    }

    private fun showPrinterInfo() {
        binding.detailsLayout.visibility = View.VISIBLE

        binding.printerTypeValue.setText(printerType.res)
        binding.printerModelValue.text = modelName
        binding.printerIdentifierValue.text = "$portName ($macAddress)"

        val printerTags = DbHelper.instance.getPrinterTags()
        for (printerTag in printerTags) {
            val chip = layoutInflater.inflate(R.layout.view_choice_chip, binding.printerTags, false) as Chip
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

        binding.addPrinterButton.setOnClickListener { registerPrinter() }
    }

    private fun showModelConfirmationDialog(model: Int) {
        DialogUtils.modelConfirmationDialog(
            requireContext(),
            model,
        ) { data ->
            val isPressedYes: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

            if (isPressedYes) {
                modelIndex = data.getInt(DialogUtils.EXTRA_MODEL_INDEX, ModelCapability.NONE)
                portSettings = ModelCapability.getPortSettings(modelIndex)
                showPaperSizeSelectionDialog()
            } else {
                showModelSelectionDialog()
            }
        }
    }

    private fun showModelSelectionDialog() {
        DialogUtils.modelSelectionDialog(
            requireContext()
        ) { data ->
            val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

            if (!isCanceled) {
                findNavController().navigateUp()
                return@modelSelectionDialog
            }

            modelIndex = data.getInt(DialogUtils.EXTRA_MODEL_INDEX, ModelCapability.NONE)
            portSettings = ModelCapability.getPortSettings(modelIndex)

            showPaperSizeSelectionDialog()
        }
    }

    private fun showPaperSizeSelectionDialog() {
        DialogUtils.paperSizeSelectionDialog(
            requireContext(),
        ) { data ->
            val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

            if (!isCanceled) {
                findNavController().navigateUp()
                return@paperSizeSelectionDialog
            }

            paperSize = data.getInt(DialogUtils.EXTRA_PAPER_SIZE, PaperSize.THREE_INCH)

            if (ModelCapability.canSetDrawerOpenStatus(modelIndex)) {
                showDrawerOpenStatusSelectionDialog()
            } else {
                drawerOpenStatus = true
                showPrinterInfo()
            }
        }
    }

    private fun showDrawerOpenStatusSelectionDialog() {
        DialogUtils.drawerOpenStatusDialog(
            requireContext()
        ) { data ->
            val isCanceled: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

            if (!isCanceled) {
                findNavController().navigateUp()
                return@drawerOpenStatusDialog
            }

            drawerOpenStatus = data.getBoolean(DialogUtils.EXTRA_DRAWER_OPEN_STATUS, false)
            showPrinterInfo()
        }
    }

    private fun registerPrinter() {
        if (selectedPrinterTag.isEmpty()) {
            toast(getString(R.string.error_printer_tag))
            return
        }

        val savedPrinter = SavedPrinter(
            tag = selectedPrinterTag,
            type = printerType.id,
            manufacturer = manufacturer.id,
            model = modelName,
            index = modelIndex,
            portName = portName,
            portSettings = portSettings,
            macAddress = macAddress,
            cashDrawerOpenStatus = drawerOpenStatus,
            paperSize = paperSize,
            instructionType = InstructionType.RASTER,
            charsetEncoding = encoding.record
        )

        val id = DbHelper.instance.savePrinter(savedPrinter)
        if (id != 0L) {
            findNavController().navigateUp()
        } else {
            toast(getString(R.string.add_printer_error_message))
        }
    }
}