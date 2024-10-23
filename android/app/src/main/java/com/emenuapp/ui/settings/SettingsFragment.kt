package com.emenuapp_pk.ui.settings

import android.view.View
import androidx.annotation.StringRes
import androidx.core.content.ContextCompat
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.db.DbHelper
import com.emenuapp_pk.data.local.prefs.PreferencesHelper
import com.emenuapp_pk.databinding.FragmentSettingsBinding
import com.emenuapp_pk.databinding.ViewPrinterFontSizeInputBinding
import com.emenuapp_pk.databinding.ViewPrinterTagInputBinding
import com.emenuapp_pk.ext.toast
import com.emenuapp_pk.ui.base.BaseFragment
import com.google.android.material.chip.Chip
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class SettingsFragment : BaseFragment<FragmentSettingsBinding>(R.layout.fragment_settings) {
    override fun provideBinding(view: View): FragmentSettingsBinding {
        return FragmentSettingsBinding.bind(view)
    }

    override fun setup() {
        updatePrinterTagUi()
    }

    private fun updatePrinterTagUi() {
        val printerTags = DbHelper.instance.getPrinterTags()
        binding.chipGroup.removeAllViews()
        for (printerTag in printerTags) {
            val chip = Chip(requireContext()).apply {
                text = printerTag.name
            }

            binding.chipGroup.addView(chip)
        }

        val addTagChip = Chip(requireContext()).apply {
            text = getString(R.string.add_tag_label)
            chipIcon = ContextCompat.getDrawable(
                requireContext(),
                R.drawable.ic_add
            )

            setOnClickListener {
                showAddTagDialog()
            }
        }

        binding.chipGroup.addView(addTagChip)

        binding.scaleTestSwitch.isChecked = PreferencesHelper.instance.scalePrintText
        binding.scaleTestSwitch.setOnCheckedChangeListener { _, isChecked ->
            PreferencesHelper.instance.scalePrintText = isChecked
        }

        binding.fontSize.text = PreferencesHelper.instance.normalFontSize.toString()
        binding.fontSizeLayout.setOnClickListener {
            showFontSizeSelectionDialog(R.string.normal_font_size_label, 2.0f, 48.0f, 1)
        }

        binding.builtinFontSize.text = PreferencesHelper.instance.builtInNormalFontSize.toString()
        binding.builtinFontSizeLayout.setOnClickListener {
            showFontSizeSelectionDialog(R.string.normal_font_size_label, 12.0f, 48.0f, 2)
        }
    }

    private fun showFontSizeSelectionDialog(
        @StringRes resource: Int,
        from: Float,
        to: Float,
        type: Int
    ) {
        val printerFontSizeBinding = ViewPrinterFontSizeInputBinding.inflate(layoutInflater)
        printerFontSizeBinding.slider.value = if (type == 1) {
            PreferencesHelper.instance.normalFontSize
        } else {
            PreferencesHelper.instance.builtInNormalFontSize
        }

        printerFontSizeBinding.slider.valueFrom = from
        printerFontSizeBinding.slider.valueTo = to

        val alert = MaterialAlertDialogBuilder(requireContext()).apply {
            setCancelable(false)
            setTitle(resource)
            setView(printerFontSizeBinding.root)
        }.create()

        printerFontSizeBinding.okButton.setOnClickListener {
            val fontSize = printerFontSizeBinding.slider.value
            if (type == 1) {
                PreferencesHelper.instance.normalFontSize = fontSize
                binding.fontSize.text = fontSize.toString()
            } else {
                PreferencesHelper.instance.builtInNormalFontSize = fontSize
                binding.builtinFontSize.text = fontSize.toString()
            }
            alert.dismiss()
        }

        printerFontSizeBinding.cancelButton.setOnClickListener {
            alert.dismiss()
        }

        alert.show()
    }

    private fun showAddTagDialog() {
        val printerTagBinding = ViewPrinterTagInputBinding.inflate(layoutInflater)

        val alert = MaterialAlertDialogBuilder(requireContext()).apply {
            setCancelable(false)
            setTitle(R.string.printer_tags_label)
            setView(printerTagBinding.root)
        }.create()

        printerTagBinding.addTagButton.setOnClickListener {
            val tag = printerTagBinding.printerTag.text.toString().trim()

            if (tag.isEmpty()) {
                toast(getString(R.string.invalid_printer_tag))
            } else {
                val isSaved = DbHelper.instance.savePrinterTag(tag)
                if (isSaved) {
                    alert.dismiss()
                    updatePrinterTagUi()
                } else {
                    toast(R.string.invalid_printer_tag)
                }
            }
        }

        printerTagBinding.cancelButton.setOnClickListener {
            alert.dismiss()
        }

        alert.show()
    }
}