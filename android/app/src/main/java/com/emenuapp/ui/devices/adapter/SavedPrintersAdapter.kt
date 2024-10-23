package com.emenuapp_pk.ui.devices.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.emenuapp_pk.data.local.model.PrinterType
import com.emenuapp_pk.data.local.model.SavedPrinter
import com.emenuapp_pk.data.local.prefs.PreferencesHelper
import com.emenuapp_pk.databinding.ItemSavedPrinterBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.reactnativecommunity.asyncstorage.AsyncLocalStorageUtil
import com.reactnativecommunity.asyncstorage.ReactDatabaseSupplier

class SavedPrintersAdapter : RecyclerView.Adapter<SavedPrintersAdapter.ViewHolder>() {

    private var testListener: ((printer: SavedPrinter, type: Int) -> Unit)? =
        null
    private val list: MutableList<SavedPrinter> = ArrayList()

    private var lastPosition: Int = -1


    fun addItems(vararg items: SavedPrinter) {
        for (item in items) {
            list.add(item)
            notifyItemInserted(itemCount)
        }

        for (i in list.indices) {
            if (list[i].id == PreferencesHelper.instance.defaultPrinter) {
                lastPosition = i
                break
            }
        }
    }

    fun clear() {
        list.clear()
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            ItemSavedPrinterBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        )
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.onBind(position)
    }

    override fun getItemCount(): Int {
        return list.size
    }

    fun setOnTestActionListener(listener: (printer: SavedPrinter, type: Int) -> Unit) {
        testListener = listener
    }

    private fun showPrinterActions(ctx: Context, position: Int) {
        var value: String? = "en"
        val readableDatabase = ReactDatabaseSupplier.getInstance(ctx).readableDatabase
        try {
            value = AsyncLocalStorageUtil.getItemImpl(readableDatabase, "USER_LANG")
            println("Oops! No Printer Device Connected$value")
        } catch (ignored: NullPointerException) {
        }
        readableDatabase.close()

        val printer = list[position]
        val actions = if (printer.tag == "default") {

            if(value=="fr"){
                arrayOf(
                    "Modifier la configuration de l'imprimante",
                    "Test d'impression avec ${printer.model}",
                    "Tester plusieurs reçus à l'aide de ${printer.model}",
                    "Tester l'impression multiple",
                    "Tester le tiroir-caisse"
                )
            }else {
                arrayOf(
                    "Edit Printer Configuration",
                    "Test Print Using ${printer.model}",
                    "Test Multi Receipt Using ${printer.model}",
                    "Test Multi Print",
                    "Test Cash Drawer"
                )
            }
        } else {
            if(value=="fr"){
                arrayOf(
                    "Modifier la configuration de l'imprimante",
                    "Test d'impression avec ${printer.model}",
                    "Tester plusieurs reçus à l'aide de ${printer.model}",
                    "Tester l'impression multiple"
                )
            }else {
                arrayOf(
                    "Edit Printer Configuration",
                    "Test Print Using ${printer.model}",
                    "Test Multi Receipt Using ${printer.model}",
                    "Test Multi Print"
                )
            }
        }

        MaterialAlertDialogBuilder(ctx)
            .setTitle(printer.model)
            .setItems(actions) { d, i ->
                d.dismiss()
                when (i) {
                    0 -> testListener?.invoke(printer, 4)
                    1 -> testListener?.invoke(printer, 1)
                    2 -> testListener?.invoke(printer, 5)
                    3 -> testListener?.invoke(printer, 2)
                    else -> testListener?.invoke(printer, if (actions[i].isNotEmpty()) 3 else 0)
                }
            }.show()
    }

    inner class ViewHolder(
        val binding: ItemSavedPrinterBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        @SuppressLint("SetTextI18n")
        fun onBind(position: Int) {
            val printer = list[position]
            binding.printerIdentifier.text = printer.macAddress
            binding.printerModel.text = printer.model
            binding.printerTag.text = printer.tag
            binding.printerType.setText(PrinterType.getById(printer.type).res)

            if (printer.tag == "default") {
                binding.defaultCheck.visibility = View.VISIBLE
            } else {
                binding.defaultCheck.visibility = View.GONE
            }

            itemView.setOnClickListener {
                showPrinterActions(it.context, position)
            }
        }
    }
}