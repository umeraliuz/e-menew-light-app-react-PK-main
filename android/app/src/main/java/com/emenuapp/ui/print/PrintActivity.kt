package com.emenuapp_pk.ui.print

import android.app.Activity
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.view.View
import androidx.activity.result.contract.ActivityResultContracts
import androidx.lifecycle.lifecycleScope
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.db.DbHelper
import com.emenuapp_pk.data.local.model.Manufacturer
import com.emenuapp_pk.data.local.model.PrinterReceipt
import com.emenuapp_pk.data.local.model.SavedPrinter
import com.emenuapp_pk.databinding.ActivityPrintBinding
import com.emenuapp_pk.ext.toast
import com.emenuapp_pk.parser.RasterPrintParser
import com.emenuapp_pk.ui.base.BaseActivity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class PrintActivity : BaseActivity<ActivityPrintBinding>() {

    private lateinit var printParser: RasterPrintParser



    private val printResult = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val message = result.data?.getStringExtra("message")
            ?: getString(R.string.printer_connection_error)

        if (result.resultCode == Activity.RESULT_OK) {
            parseReceipts()

        } else {
            toast(message)

            parseReceipts()
        }
    }

    override fun provideBinding(): ActivityPrintBinding {
        return ActivityPrintBinding.inflate(layoutInflater)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        getSavedPrinter()
        if (intent.data == null) {
            toast("Invalid command.")
            finish()
            return
        }

        try {
            printParser = RasterPrintParser(intent.data!!)
            if (printParser.command == RasterPrintParser.PrintCommand.PRINT) {
                printParser.parseReceipts()
            } else {
                printParser.addReceipt(
                    PrinterReceipt(
                        "",
                        "default",
                        true,
                        RasterPrintParser.PrintCommand.CASH_DRAWER
                    )
                )
            }

            for (receipt in printParser.receipts) {
                val isRasterPrinter = receipt.isRasterPrinter(receipt.tag)
                val isBuiltinPrinter = receipt.isBuiltInPrinter(receipt.tag)
                if (isRasterPrinter) {
                    val elements = printParser.parse(receipt.data, isBuiltinPrinter)
                    receipt.addElements(elements)
                }
                printParser.addReceipt(receipt)
            }

            printParser.groupReceipts()
            downloadImages()
        } catch (e: Exception) {
            binding.errorMessage.text = e.message
            binding.errorMessage.visibility = View.VISIBLE
            binding.progress.visibility = View.GONE

        }
    }

    private fun downloadImages() {
        lifecycleScope.launch(Dispatchers.IO) {
            try {
                for ((key, url) in printParser.imagesMap) {
                    val bitmap = BitmapFactory.decodeStream(
                        url.openConnection().getInputStream()
                    )
                    if (bitmap != null) {
                        bitmapsMap[key] = bitmap
                    }
                }

                parseReceipts()
            } catch (e: Exception) {
                e.printStackTrace()
                parseReceipts()
            }
        }
    }

    private fun parseReceipts() {
        lifecycleScope.launch(Dispatchers.Main) {
            val receipt = printParser.getReceipt()
            receipt?.let {
                parseReceipt(it)
            } ?: run {
                finish()
            }
        }
    }

    private fun parseReceipt(receipt: PrinterReceipt) {
        val printer = getPrinter(receipt.tag)
        printer?.let {
            when (Manufacturer.getById(it.manufacturer)) {
//                is Manufacturer.Star -> openStarPrint(receipt, it)
                is Manufacturer.Sunmi -> openSunmiPrint(receipt, it)
                else -> openGenericPrint(receipt, it)
            }
        } ?: run {
            parseReceipts()
        }
    }

    private fun getPrinter(tag: String): SavedPrinter? {
        return DbHelper.instance.getPrinterByTag(tag) ?: DbHelper.instance.defaultPrinter
    }

    private fun openGenericPrint(receipt: PrinterReceipt, savedPrinter: SavedPrinter) {
        val intent = GenericPrintActivity.getIntent(this, receipt, savedPrinter)
        printResult.launch(intent)
    }

    private fun openSunmiPrint(receipt: PrinterReceipt, savedPrinter: SavedPrinter) {
        val intent = SunmiPrintActivity.getIntent(this, receipt, savedPrinter)
        printResult.launch(intent)
    }

//    private fun openStarPrint(receipt: PrinterReceipt, savedPrinter: SavedPrinter) {
//        val intent = StarPrintActivity.getIntent(this, receipt, savedPrinter)
//        printResult.launch(intent)
//    }
private fun getSavedPrinter() {
    val list = DbHelper.instance.savedPrinters
    if (list.isEmpty()) {
        binding.progress.visibility = View.GONE

       toast( getString(R.string.no_printer_device_connected))
    }
}

    companion object {
        private val bitmapsMap: MutableMap<String, Bitmap> = LinkedHashMap()
        val bitmaps: Map<String, Bitmap> = bitmapsMap
    }
}