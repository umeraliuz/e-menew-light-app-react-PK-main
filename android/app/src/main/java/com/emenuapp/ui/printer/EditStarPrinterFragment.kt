package com.emenuapp_pk.ui.printer

import android.text.InputType
import android.view.View
import androidx.navigation.fragment.findNavController
import com.emenew.genericprnt.EscPosCharsetEncoding
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.db.DbHelper
import com.emenuapp_pk.data.local.model.PaperSize
import com.emenuapp_pk.data.local.model.PrinterType
import com.emenuapp_pk.data.local.model.SavedPrinter
import com.emenuapp_pk.data.local.prefs.PreferencesHelper
import com.emenuapp_pk.databinding.FragmentEditStartPrinterBinding
import com.emenuapp_pk.ext.toast
import com.emenuapp_pk.ui.base.BaseFragment
import com.emenuapp_pk.utils.DialogUtils
import com.google.android.material.chip.Chip
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class EditStarPrinterFragment :
    BaseFragment<FragmentEditStartPrinterBinding>(R.layout.fragment_edit_start_printer) {

    private lateinit var printer: SavedPrinter

    override fun provideBinding(view: View): FragmentEditStartPrinterBinding {
        return FragmentEditStartPrinterBinding.bind(view)
    }

    override fun setup() {
        val args = EditStarPrinterFragmentArgs.fromBundle(requireArguments())
        printer = args.printer

        showPrinterInfo()
    }


    private fun showPrinterInfo() {
        binding.detailsLayout.visibility = View.VISIBLE

        val printerType = PrinterType.getById(printer.type)
        binding.printerTypeValue.setText(printerType.res)
        binding.printerModelValue.text = printer.model
        binding.printerIdentifierValue.text = "${printer.portName} (${printer.macAddress})"

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

        /*binding.printerTags.setOnCheckedStateChangeListener { group, checkedIds ->
            group.findViewById<Chip>(group.checkedChipId)?.let { chip ->
                selectedPrinterTag = chip.text.toString().trim()
            } ?: run {
                selectedPrinterTag = ""
            }
        }*/

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

        binding.savePrinterButton.setOnClickListener { registerPrinter() }

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

    private fun registerPrinter() {
        if (printer.tag.isEmpty()) {
            toast(getString(R.string.error_printer_tag))
            return
        }

        val savedPrinter = printer

        val id = DbHelper.instance.savePrinter(savedPrinter)
        if (id != 0L) {
            findNavController().navigateUp()
        } else {
            toast(getString(R.string.add_printer_error_message))
        }
    }
}