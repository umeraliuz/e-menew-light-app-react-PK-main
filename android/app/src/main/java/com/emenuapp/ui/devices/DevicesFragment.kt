package com.emenuapp_pk.ui.devices

import android.content.Intent
import android.net.Uri
import android.util.Base64
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import androidx.core.content.ContextCompat
import androidx.core.view.MenuProvider
import androidx.lifecycle.Lifecycle
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.db.DbHelper
import com.emenuapp_pk.data.local.model.Manufacturer
import com.emenuapp_pk.data.local.model.PrinterType
import com.emenuapp_pk.data.local.model.SavedPrinter
import com.emenuapp_pk.databinding.FragmentDevicesBinding
import com.emenuapp_pk.ui.base.BaseFragment
import com.emenuapp_pk.ui.devices.adapter.SavedPrintersAdapter
import com.emenuapp_pk.utils.DialogUtils
import timber.log.Timber

class DevicesFragment : BaseFragment<FragmentDevicesBinding>(R.layout.fragment_devices) {

    private val savedPrintersAdapter = SavedPrintersAdapter()

    private val homeMenuProvider = object : MenuProvider {
        override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
            menuInflater.inflate(R.menu.menu_home, menu)
        }

        override fun onMenuItemSelected(menuItem: MenuItem): Boolean {
            return when (menuItem.itemId) {
                R.id.action_history -> {
                    findNavController().navigate(
                        DevicesFragmentDirections.toHistoryFragment()
                    )
                    true
                }
                else -> false
            }
        }
    }

    override fun provideBinding(view: View): FragmentDevicesBinding {
        return FragmentDevicesBinding.bind(view)
    }

    override fun setup() {
        requireActivity().addMenuProvider(
            homeMenuProvider,
            viewLifecycleOwner,
            Lifecycle.State.RESUMED
        )

        savedPrintersAdapter.setOnTestActionListener { printer, type ->
            when (type) {
                1 -> testPrint(printer)
                5 -> testPrint(printer, 2)
                2 -> testMultiPrint()
                3 -> testCashDrawer()
                4 -> editPrinter(printer)
            }
        }

        binding.list.apply {
            layoutManager = LinearLayoutManager(
                requireContext(),
                LinearLayoutManager.VERTICAL,
                false
            )

            ContextCompat.getDrawable(
                requireContext(),
                R.drawable.ic_divider
            )?.let { dividerDrawable ->
                DividerItemDecoration(
                    requireContext(),
                    DividerItemDecoration.VERTICAL
                ).apply {
                    setDrawable(dividerDrawable)

                    addItemDecoration(this)
                }
            }

            adapter = savedPrintersAdapter
        }

        binding.addPrinterButton.setOnClickListener {
            showSelectManufacturerDialog()
        }
    }

    override fun onResume() {
        super.onResume()
        getSavedPrinter()
    }

    private fun showSelectPrinterTypeDialog(
        manufacturer: Manufacturer,
        printerTypes: Array<PrinterType>
    ) {
        DialogUtils.printerTypeSelectionDialog(
            requireContext(),
            printerTypes
        ) { data ->
            val isPressedYes: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)
            if (isPressedYes) {
                val id = data.getInt(DialogUtils.EXTRA_PRINTER_TYPE)
                val printerType = PrinterType.getById(id)
                findNavController().navigate(
                    DevicesFragmentDirections.toAddSunmiPrinterFragment(
                        manufacturer,
                        printerType
                    )
                )
            }
        }
    }

    private fun showSelectManufacturerDialog() {
        DialogUtils.manufacturerSelectionDialog(
            requireContext()
        ) { data ->
            val isPressedYes: Boolean = data.getBoolean(DialogUtils.EXTRA_ACTION, false)

            if (isPressedYes) {
                val id = data.getInt(DialogUtils.EXTRA_MANUFACTURER_ID)
                when (val manufacturer = Manufacturer.getById(id)) {
                    is Manufacturer.Star -> {
                        findNavController().navigate(
                            DevicesFragmentDirections.toAddStarPrinterFragment(
                                manufacturer,
                                PrinterType.NetworkPrinter()
                            )
                        )
                    }
                    is Manufacturer.Sunmi -> {
                        showSelectPrinterTypeDialog(
                            manufacturer,
                            arrayOf(
                                PrinterType.UsbPrinter(),
                                PrinterType.BluetoothPrinter(),
                                PrinterType.InternalPrinter()
                            )
                        )
                    }
                    else -> {
                        findNavController().navigate(
                            DevicesFragmentDirections.toAddGenericPrinterFragment(
                                manufacturer,
                                PrinterType.UsbPrinter()
                            )
                        )
                    }
                }
            }
        }
    }

    private fun getSavedPrinter() {
        val list = DbHelper.instance.savedPrinters
        if (list.isNotEmpty()) {
            binding.emptyView.visibility = View.GONE
            savedPrintersAdapter.clear()
            savedPrintersAdapter.addItems(*list.toTypedArray())
        } else {
            savedPrintersAdapter.clear()
            binding.emptyView.visibility = View.VISIBLE
        }
    }

    private fun testMultiPrint() {
        val builder = StringBuilder()
        builder.append("<receipt>kitchen\n")
        builder.append("[C]<img>LOGO|120|120</img>\n\n")
        builder.append("<T>1;;1;;1\n")
        builder.append("[L]méthode: emporter;;[C]Cde: 0;;[R]09-06-2022 17:04\n")
        builder.append("</T>\n")
        builder.append("\n")
        builder.append("<T>1;;3;;2\n")
        builder.append("[L]<b>Qt</b>;;[L]<b>Produits</b>;;[R]<b>CHF</b>\n")
        builder.append("[L]1;;[L]CAESAR;;[R]46\n")
        builder.append("[L]1;;[L]+ Thon 150g;;[R]\n")
        builder.append("[L]1;;[L]+ Saumon fumé 100g;;[R]\n")
        builder.append("[L]1;;[L]+ Gruyère 100g;;[R]\n")
        builder.append("</T>\n")
        builder.append("<dashed-line>\n")
        builder.append("<T>4;;2\n")
        builder.append("[L]Sous-total;;[R]46\n")
        builder.append("[L]Réduction;;[R]-\n")
        builder.append("[L]A Payer;;[R]46\n")
        builder.append("[L]TVA 7.70 % (46);;[R]3.29\n")
        builder.append("</T>\n")
        builder.append("[C]<font size='tall'>Merci pour votre visite.</font>\n")
        builder.append("\n")
        builder.append("[L]Boulevard Carl-Vogt 101\n")
        builder.append("[L]1205 Genève\n")
        builder.append("[L]Tel +41 22 320 44 22\n")
        builder.append("[L]RC CHE-113.302.913\n")
        builder.append("</receipt>\n")
        builder.append("<receipt>\n")
        builder.append("[C]<img>LOGO|120|120</img>\n\n")
        builder.append("<T>1;;1;;1\n")
        builder.append("[L]méthode: emporter;;[C]Cde: 0;;[R]09-06-2022 17:04\n")
        builder.append("</T>\n")
        builder.append("\n")
        builder.append("<T>1;;3;;2\n")
        builder.append("[L]<b>Qt</b>;;[L]<b>Produits</b>;;[R]<b>CHF</b>\n")
        builder.append("[L]1;;[L]CAESAR;;[R]46\n")
        builder.append("[L]1;;[L]+ Thon 150g;;[R]\n")
        builder.append("[L]1;;[L]+ Saumon fumé 100g;;[R]\n")
        builder.append("[L]1;;[L]+ Gruyère 100g;;[R]\n")
        builder.append("</T>\n")
        builder.append("<dashed-line>\n")
        builder.append("<T>4;;2\n")
        builder.append("[L]Sous-total;;[R]46\n")
        builder.append("[L]Réduction;;[R]-\n")
        builder.append("[L]A Payer;;[R]46\n")
        builder.append("[L]TVA 7.70 % (46);;[R]3.29\n")
        builder.append("</T>\n")
        builder.append("[C]<font size='tall'>Merci pour votre visite.</font>\n")
        builder.append("\n")
        builder.append("[L]Boulevard Carl-Vogt 101\n")
        builder.append("[L]1205 Genève\n")
        builder.append("[L]Tel +41 22 320 44 22\n")
        builder.append("[L]RC CHE-113.302.913\n")
        builder.append("</receipt>\n")

        val encodedContent: String = Base64.encodeToString(
            builder.toString().toByteArray(),
            Base64.URL_SAFE
        )

        val urlBuilder = StringBuilder()
        urlBuilder.append("empplight://print?econtent=")
        urlBuilder.append(encodedContent)
        urlBuilder.append("&image_tags=<LOGO>")
        urlBuilder.append("&cash_drawer=1")
        urlBuilder.append("&image_urls=<https://static.vecteezy.com/system/resources/previews/002/412/377/original/coffee-cup-logo-coffee-shop-icon-design-free-vector.jpg>")

        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(urlBuilder.toString()))
        startActivity(intent)
    }

    private fun testPrint(printer: SavedPrinter, copies: Int = 1) {
        val builder = StringBuilder()
        repeat(copies) {
            builder.append("<receipt>${printer.tag}\n")
            builder.append("[C]<img>LOGO|96|96</img>\n\n")
            builder.append("[C]<font size='big-3' color='bg-black'>TWINS</font>\n")
            builder.append("<T>1;;1;;1\n")
            builder.append("[L]méthode: emporter;;[C]Cde: 0;;[R]09-06-2022 17:04\n")
            builder.append("</T>\n")
            builder.append("<line>\n")
            builder.append("<T>1;;3;;2\n")
            builder.append("[L]<b>Qt</b>;;[L]<b>Produits</b>;;[R]<b>CHF</b>\n")
            builder.append("[L]1;;[L]CAESAR;;[R]46\n")
            builder.append("[L]1;;[L]+ Thon 150g;;[R]\n")
            builder.append("[L]1;;[L]+ Saumon fumé 100g;;[R]\n")
            builder.append("[L]1;;[L]+ Gruyère 100g;;[R]\n")
            builder.append("[L]<line>;;[L]<line>;;[R]<line>\n")
            builder.append("[L];;[L]Sous-total;;[R]46\n")
            builder.append("[L];;[L]Réduction;;[R]-\n")
            builder.append("[L]<double-line>;;[L]<double-line>;;[R]<double-line>\n")
            builder.append("[L];;[L]A Payer;;[R]46\n")
            builder.append("[L];;[L]TVA 7.70 % (46);;[R]3.29\n")
            builder.append("</T>\n")
            builder.append("<double-line>\n")
            builder.append("[C]<font size='tall'>Merci pour votre visite.</font>\n")
            builder.append("\n")
            builder.append("[L]Boulevard Carl-Vogt 101\n")
            builder.append("[L]1205 Genève\n")
            builder.append("[L]Tel +41 22 320 44 22\n")
            builder.append("[L]RC CHE-113.302.913\n")
            builder.append("</receipt>\n")
        }

        builder.clear()
        builder.append(
            """
            [C]<font color='bg-black' size='big-2'>Ticket X</font>
            [C]<font size='big'>QA Trading name</font>
            [C]Street 1
            [C]Rawalpindi
            [C]Tel +92 333 5977477
            [C]RC 03335977477

            <T>1;;1
            [L]DATE OUVERTURE:;;[R]10-02-2023 18:23:28
            [L]DATE IMPRESSION:;;[R]10-02-2023 18:53:24
            </T>

            <T>1;;1
            [L]NOMBRE COMMANDE ;;[R] 1.00
            [L]TICKET MOYEN ;;[R] 442 EUR
            </T>
            <line>
            [L]<font color='bg-black'>Mohsin</font>
            <line>
            <T>1;;5;;2
            [L]1;;[L]Apple 20 ml;;[R]80.00 EUR
            [L]1;;[L]Quantity Product 10 ml;;[R]10.00 EUR
            </T>
            <line>
            <T>1;;1;;1
            [L];;[L];;[R]90.00 EUR
            </T>
            <line>
            [L]<font color='bg-black'>Slushes</font>
            <line>
            <T>1;;5;;2
            [L]1;;[L]Blue barries Juice;;[R]150.00 EUR
            [L]1;;[L]Flamming hot water melon juice;;[R]10.00 EUR
            [L]1;;[L]red mango juice;;[R]180.00 EUR
            [L]1;;[L]rotten banana juice;;[R]12.00 EUR
            </T>
            <line>
            <T>1;;1;;1
            [L];;[L];;[R]352.00 EUR
            </T>
            <line>
            <T>1;;1;;1
            [L]TVA (10.00%);;[L]442.00;;[R]40.18 EUR
            [L]TOTAL HT;;[L];;[R]401.82 EUR
            [L]<b> TOTAL TTC</b>;;[L];;[R]<b>442.00 EUR</b>
            </T>
            <line>
            <T>3;;2
            [L]Total REMISES;;[R]0.00 EUR
            [L]TOTAL OFFERT CLIENT;;[R]0.00 EUR
            [L]TOTAL OFFERT PERSONNEL;;[R]0.00 EUR
            [L]TOTAL ANNULATIONS;;[R]0.00 EUR
            [L]TOTAL TIPS;;[R]0.00 EUR
            </T>
            <T>3;;2
            </T>
        """.trimIndent()
        )

        val encodedContent: String = Base64.encodeToString(
            builder.toString().toByteArray(),
            Base64.URL_SAFE
        )

        val urlBuilder = StringBuilder()
        urlBuilder.append("empplight://print?econtent=")
        urlBuilder.append(encodedContent)
        urlBuilder.append("&image_tags=<LOGO>")
        //urlBuilder.append("&cash_drawer=1")
        urlBuilder.append("&image_urls=<https://www.shareicon.net/data/128x128/2016/04/11/748060_coffee_512x512.png>")

        Timber.tag("TAG").d("testGenericPrint: builder => $builder")
        Timber.tag("TAG").d("testGenericPrint: urlBuilder => $urlBuilder")

        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(urlBuilder.toString()))
        startActivity(intent)
    }

    private fun testCashDrawer() {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("empplight://cash_drawer?open=1"))
        startActivity(intent)
    }

    private fun editPrinter(printer: SavedPrinter) {
        when (Manufacturer.getById(printer.manufacturer)) {
            is Manufacturer.Star -> {
                findNavController().navigate(
                    DevicesFragmentDirections.toEditStarPrinterFragment(printer)
                )
            }
            is Manufacturer.Sunmi -> {
                findNavController().navigate(
                    DevicesFragmentDirections.toEditSunmiPrinterFragment(printer)
                )
            }
            else -> {
                findNavController().navigate(
                    DevicesFragmentDirections.toEditGenericPrinterFragment(printer)
                )
            }
        }
    }
}
