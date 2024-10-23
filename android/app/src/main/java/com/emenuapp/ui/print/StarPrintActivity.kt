package com.emenuapp_pk.ui.print

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.os.Bundle
import androidx.lifecycle.lifecycleScope
import com.emenuapp_pk.data.local.model.PrinterReceipt
import com.emenuapp_pk.data.local.model.SavedPrinter
import com.emenuapp_pk.databinding.ActivityPrintPreviewBinding
import com.emenuapp_pk.parser.UiElement
import com.emenuapp_pk.ui.base.BaseActivity
import com.emenuapp_pk.utils.UiUtils
import com.starmicronics.stario.StarIOPort
import com.starmicronics.stario.StarIOPortException
import com.starmicronics.stario.StarPrinterStatus
import com.starmicronics.starioextension.ICommandBuilder
import com.starmicronics.starioextension.StarIoExt
import io.ezeelabs.starprnt.utils.ModelCapability
import kotlinx.coroutines.CoroutineExceptionHandler
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.*

class StarPrintActivity : BaseActivity<ActivityPrintPreviewBinding>() {

    private lateinit var printer: SavedPrinter

    private val queue: Queue<List<UiElement>> = LinkedList()
    private val bitmaps: MutableList<Bitmap> = ArrayList()

    private val handler = CoroutineExceptionHandler { _, exception ->
        val data = Intent().apply {
            putExtra("message", exception.message)
        }
        setResult(Activity.RESULT_CANCELED, data)
        finish()
    }

    override fun provideBinding(): ActivityPrintPreviewBinding {
        return ActivityPrintPreviewBinding.inflate(layoutInflater)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val receipt = intent.getParcelableExtra<PrinterReceipt>(EXTRA_RECEIPT)
        val sp = intent.getParcelableExtra<SavedPrinter>(EXTRA_PRINTER)

        if (sp != null) {
            printer = sp
        }

        receipt?.let {
            generateSubList(it.getElements())

            processQueue()
        }
    }

    private fun processQueue() {
        queue.poll()?.let { elements ->
            binding.printPreview.setPrintData(
                elements,
                PrintActivity.bitmaps,
                printer.paperSize
            ) {
                val bitmap = UiUtils.getBitmapFromView(binding.printPreview)
                bitmaps.add(bitmap)
                processQueue()
            }
        } ?: run {
            printReceipt(printer, bitmaps)
        }
    }

    private fun generateSubList(elements: List<UiElement>) {
        val cutIndices: MutableList<Int> = ArrayList()
        elements.forEachIndexed { i, element ->
            if (element is UiElement.UiCut) {
                cutIndices.add(i)
            }
        }
        var lastIndex = 0;

        for (index in cutIndices) {
            queue.add(elements.subList(lastIndex, index))
            lastIndex = index + 1
        }
        queue.add(elements.subList(lastIndex, elements.size))
    }

    private fun printReceipt(printer: SavedPrinter, bitmaps: List<Bitmap>) {
        lifecycleScope.launch(Dispatchers.IO + handler) {
            val emulation = ModelCapability.getEmulation(printer.index)

            /*val commands = StarIoExt.createCommandBuilder(emulation).apply {
                beginDocument()
                appendBitmap(bitmap, false)
                endDocument()
            }.commands*/

            val builder = StarIoExt.createCommandBuilder(emulation)
            builder.beginDocument()
            for (bitmap in bitmaps) {
                builder.appendBitmap(bitmap, false)
                builder.appendCutPaper(ICommandBuilder.CutPaperAction.FullCutWithFeed)
            }
            builder.endDocument()

            val commands = builder.commands

            val starIOPort = StarIOPort.getPort(
                printer.portName,
                printer.portSettings,
                10 * 1000,
                this@StarPrintActivity
            )

            var status: StarPrinterStatus

            starIOPort?.let { port ->
                status = port.beginCheckedBlock()

                if (status.offline) {
                    throw StarIOPortException("Printer is offline.")
                }

                port.writePort(commands, 0, commands.size)
                port.setEndCheckedBlockTimeoutMillis(300000)

                status = port.endCheckedBlock()

                if (status.coverOpen) {
                    throw StarIOPortException("Printer cover is open")
                } else if (status.receiptPaperEmpty) {
                    throw StarIOPortException("Receipt paper is empty")
                } else if (status.offline) {
                    throw StarIOPortException("Printer is offline")
                }

                StarIOPort.releasePort(port)

                withContext(Dispatchers.Main) {
                    setResult(Activity.RESULT_OK)
                    finish()
                }
            }
        }
    }

    companion object {
        private const val EXTRA_RECEIPT = "receipt";
        private const val EXTRA_PRINTER = "printer"

        fun getIntent(
            ctx: Context,
            receipt: PrinterReceipt,
            savedPrinter: SavedPrinter
        ) = Intent(
            ctx,
            StarPrintActivity::class.java
        ).apply {
            putExtra(EXTRA_RECEIPT, receipt)
            putExtra(EXTRA_PRINTER, savedPrinter)
        }
    }
}