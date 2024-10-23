package com.emenuapp_pk.parser

import android.graphics.Color
import android.net.Uri
import android.util.Base64
import com.emenuapp_pk.data.local.db.DbHelper
import com.emenuapp_pk.data.local.model.PrinterReceipt
import com.emenuapp_pk.data.local.prefs.PreferencesHelper
import java.net.URL
import java.util.*

class RasterPrintParser(url: Uri) {

    private var _imagesMap: MutableMap<String, URL> = LinkedHashMap()
    private var isOpenCashDrawer: Boolean = false
    private var printDataString: String? = null

    private val _receipts: MutableList<PrinterReceipt> = LinkedList()
    private val _queue: Queue<PrinterReceipt> = LinkedList()

    lateinit var command: PrintCommand
    val imagesMap: Map<String, URL> = _imagesMap
    val receipts: List<PrinterReceipt> = _receipts

    enum class PrintCommand {
        CASH_DRAWER, PRINT,
    }

    init {
        when (url.host) {
            "cash_drawer" -> initCashDrawerCommand(url)
            "print" -> initPrintCommand(url)
            else -> throw IllegalArgumentException("Invalid printer command.")
        }
    }

    @Throws(IllegalArgumentException::class)
    private fun initPrintCommand(data: Uri) {
        command = PrintCommand.PRINT

        val paramsNames = data.queryParameterNames
        printDataString = if (paramsNames.contains(PARAM_CONTENT)) {
            data.getQueryParameter(PARAM_CONTENT)
        } else if (paramsNames.contains(PARAM_ENCODED_CONTENT)) {
            val base64String = data.getQueryParameter(PARAM_ENCODED_CONTENT)
            String(Base64.decode(base64String, Base64.URL_SAFE))
        } else {
            throw IllegalArgumentException("Invalid print content.")
        }

        if (paramsNames.contains(PARAM_CASH_DRAWER)) {
            val cashDrawer = data.getQueryParameter(PARAM_CASH_DRAWER)
            isOpenCashDrawer = cashDrawer == "1"
        }

        if (paramsNames.contains(PARAM_IMAGE_TAGS) && paramsNames.contains(PARAM_IMAGE_URLS)) {
            parseImages(data)
        }
    }

    private fun initCashDrawerCommand(data: Uri) {
        command = PrintCommand.CASH_DRAWER
    }

    @Throws(IllegalArgumentException::class)
    private fun parseImages(data: Uri) {
        val tags = data.getQueryParameter(PARAM_IMAGE_TAGS)
        val urls = data.getQueryParameter(PARAM_IMAGE_URLS)

        if (tags != null && urls != null) {
            val imagesTagList = tags.substring(1, tags.length - 1).split(",").toTypedArray()
            val imagesUrlList = urls.substring(1, urls.length - 1).split(",").toTypedArray()

            if (imagesTagList.size > imagesUrlList.size) {
                throw IllegalArgumentException("Missing corresponding url for image tag.")
            }

            if (imagesTagList.size < imagesUrlList.size) {
                throw IllegalArgumentException("Missing corresponding tag for image url.")
            }

            for (i in imagesTagList.indices) {
                _imagesMap[imagesTagList[i]] = URL(imagesUrlList[i])
            }
        }
    }

    @Throws(IllegalArgumentException::class)
    fun parseReceipts() {
        try {
            printDataString?.let { data ->
                val pages = data.split(RECEIPT_END_TAG).toTypedArray()
                for (page in pages) {
                    val index = page.indexOf("\n")
                    val receiptTag = if (index >= 0) page.substring(0, index) else ""
                    if (receiptTag.startsWith(RECEIPT_START_TAG)) {
                        val tag = getReceiptTag(receiptTag)
                        val printData = page.removePrefix("${receiptTag}\n").removeSuffix(
                            "</receipt>"
                        )
                        _receipts.add(
                            PrinterReceipt(
                                printData, tag, isOpenCashDrawer, command
                            )
                        )
                    }
                }
                if (pages.size == 1 && _receipts.isEmpty()) {
                    val tag = getReceiptTag("")
                    val printData = pages[0]
                    _receipts.add(
                        PrinterReceipt(
                            printData, tag, isOpenCashDrawer, command
                        )
                    )
                }
            } ?: throw IllegalArgumentException("Invalid print format.")
        } catch (e: Exception) {
            val message = if (!e.message.isNullOrEmpty()) {
                e.message
            } else {
                "Invalid print format."
            }
            throw IllegalArgumentException(message)
        }
    }

    @Throws(IllegalArgumentException::class)
    fun parse(data: String, isBuiltinPrinter: Boolean = false): List<UiElement> {
        var lineNo = 0
        try {
            val elements: MutableList<UiElement> = LinkedList()
            val lines: Array<String> = data.split("\n|\r\n".toRegex()).toTypedArray()
            var uiTable: UiElement.UiTable? = null

            for (i in lines.indices) {
                lineNo = i
                val line = lines[i]
                if (line.startsWith(TABLE_START_TAG)) {
                    uiTable = createTable(line)
                } else if (line.startsWith(TABLE_END_TAG)) {
                    uiTable?.let { table -> elements.add(table) }
                    uiTable = null
                } else if (line.contains(IMAGE_START_TAG)) {
                    parseImage(line).let { image ->
                        elements.add(image)
                    }
                } else if (line.startsWith(LINE_TAG) || line.startsWith(DOUBLE_LINE_TAG) || line.startsWith(
                        DASHED_LINE_TAG
                    )
                ) {
                    parseDivider(line).let { divider ->
                        elements.add(divider)
                    }
                } else {
                    uiTable?.let {
                        val row = parseTableRow(line, it, isBuiltinPrinter)
                        it.addRow(row)
                    } ?: run {
                        parseText(line, isBuiltinPrinter).let { text ->
                            elements.add(text)
                        }
                    }
                }
            }
            return elements
        } catch (e: Exception) {
            val message = if (!e.message.isNullOrEmpty()) {
                "Line No: $lineNo, ${e.message}"
            } else {
                "Line No: $lineNo, Invalid print format."
            }
            throw IllegalArgumentException(message)
        }
    }

    private fun getReceiptTag(line: String): String {
        val newLine = clipProperty(line, RECEIPT_START_TAG)
        return DbHelper.instance.getPrinterTag(newLine).name
    }

    private fun parseDivider(line: String): UiElement.UiDivider {
        return UiElement.UiDivider().apply {
            isDouble = line.contains(DOUBLE_LINE_TAG)
        }
    }

    private fun createTable(line: String): UiElement.UiTable {
        val uiTable = UiElement.UiTable()
        val newLine = clipProperty(line, TABLE_START_TAG)
        uiTable.setColumnWeights(newLine)
        return uiTable
    }

    @Throws(IllegalArgumentException::class)
    private fun parseTableRow(
        line: String,
        table: UiElement.UiTable,
        isBuiltinPrinter: Boolean
    ): UiElement.UiRow {
        val uiRow = table.createRow()
        val columns = line.split(";;")

        if (columns.size != table.maxColumnCount) {
            throw IllegalArgumentException("Row columns must be equal to table columns.")
        }

        for (i in columns.indices) {
            parseText(columns[i], isBuiltinPrinter).apply {
                weight = table.getColumnWeight(i)
                uiRow.addColumn(this)
            }
        }

        return uiRow
    }

    @Throws(IllegalArgumentException::class)
    private fun parseText(line: String, isBuiltinPrinter: Boolean): UiElement.UiText {
        try {
            val uiText = UiElement.UiText()
            uiText.align = getAlignment(line)

            val newLine = clipAlignment(line)

            val defaultFontSize = if (isBuiltinPrinter) {
                PreferencesHelper.instance.builtInNormalFontSize
            } else {
                PreferencesHelper.instance.normalFontSize
            }

            val fontSize = getProperty(newLine, FONT_SIZE_PROPERTY, FONT_START_TAG)
            val sizes = if (isBuiltinPrinter) {
                builtinFontSizes
            } else {
                fontSizes
            }

            uiText.size = sizes[fontSize] ?: defaultFontSize

            val fontColor = getProperty(newLine, FONT_COLOR_PROPERTY, FONT_START_TAG)
            fontColor?.let { color ->
                when (color) {
                    FONT_COLOR -> {
                        uiText.color = Color.BLACK
                        uiText.color = Color.WHITE
                    }
                    FONT_BACKGROUND_COLOR -> {
                        uiText.color = Color.WHITE
                        uiText.backgroundColor = Color.BLACK
                    }
                }
            }

            val content = clipProperty(newLine, FONT_START_TAG, FONT_END_TAG)
            uiText.value = content
            uiText.isHtml = isHtml(content)
            return uiText
        } catch (e: Exception) {
            throw IllegalArgumentException("Invalid text tag format.")
        }
    }

    @Throws(IllegalArgumentException::class)
    private fun parseImage(line: String): UiElement.UiImage {
        try {
            val uiImage = UiElement.UiImage()
            uiImage.align = getAlignment(line, uiImage.align)

            val newLine = clipAlignment(line)
            val content = clipProperty(newLine, IMAGE_START_TAG, IMAGE_END_TAG)
            val contents = content.split("\\|".toRegex())

            if (content.isNotEmpty()) {
                uiImage.tag = contents[0]
                when (contents.size) {
                    2 -> {
                        uiImage.width = contents[1].toInt()
                        uiImage.height = uiImage.width
                    }
                    3 -> {
                        uiImage.width = contents[1].toInt()
                        uiImage.height = contents[2].toInt()
                    }
                }

                return uiImage
            } else {
                throw IllegalArgumentException("Invalid image tag format.")
            }
        } catch (e: Exception) {
            throw IllegalArgumentException("Invalid image tag format.")
        }
    }

    private fun isHtml(content: String): Boolean {
        val htmlTags = "<b>[^.]*</b>|<i>[^.]*</i>|<u>[^.]*</u>".toRegex()
        return content.contains(htmlTags)
    }

    private fun getProperty(line: String, property: String, tag: String): String? {
        if (line.contains(tag.toRegex())) {
            if (line.contains(property)) {
                val indexOfSize = line.indexOf(property)
                val startIndex = line.indexOf("'", indexOfSize) + 1
                val endIndex = line.indexOf("'", startIndex + 1)

                return line.substring(startIndex, endIndex)
            }
        }

        return null
    }

    private fun clipProperty(line: String, startTag: String, endTag: String = ""): String {
        var newLine = line.replace(startTag.toRegex(), "")
        if (endTag.isNotEmpty()) {
            newLine = newLine.replace(endTag.toRegex(), "")
        }

        return newLine
    }

    private fun clipAlignment(line: String): String {
        for (alignment in alignments) {
            if (line.trim().startsWith(alignment)) {
                return line.trim().removePrefix(alignment)
            }
        }

        return line
    }

    private fun getAlignment(line: String, defaultAlignment: Int = 0): Int {
        for (i in alignments.indices) {
            if (line.trim().startsWith(alignments[i])) {
                return i
            }
        }

        return defaultAlignment
    }

    companion object {
        private const val PARAM_CONTENT = "content"
        private const val PARAM_ENCODED_CONTENT = "econtent"
        private const val PARAM_CASH_DRAWER = "cash_drawer"
        private const val PARAM_IMAGE_TAGS = "image_tags"
        private const val PARAM_IMAGE_URLS = "image_urls"

        private const val RECEIPT_START_TAG = "<receipt>"
        private const val RECEIPT_END_TAG = "</receipt>\n"
        const val LINE_TAG = "<line>"
        const val DOUBLE_LINE_TAG = "<double-line>"
        const val DASHED_LINE_TAG = "<dashed-line>"
        private const val TABLE_START_TAG = "<T>"
        private const val TABLE_END_TAG = "</T>"
        private const val IMAGE_START_TAG = "<img>"
        private const val IMAGE_END_TAG = "</img>"
        private const val FONT_START_TAG = "<font[^>]*>"
        private const val FONT_END_TAG = "</font>"

        private const val FONT_SIZE_PROPERTY = "size"
        private const val FONT_COLOR_PROPERTY = "color"

        private const val FONT_COLOR = "black"
        private const val FONT_BACKGROUND_COLOR = "bg-black"

        private val alignments = arrayOf(
            "[L]", "[C]", "[R]"
        )

        private val fontSizes = hashMapOf(
            "normal" to PreferencesHelper.instance.normalFontSize,
            "big" to PreferencesHelper.instance.normalFontSize + 4,
            "big-2" to PreferencesHelper.instance.normalFontSize + 6,
            "big-2" to PreferencesHelper.instance.normalFontSize + 9,
            "big-3" to PreferencesHelper.instance.normalFontSize + 12,
            "big-4" to PreferencesHelper.instance.normalFontSize + 20,
            "big-5" to PreferencesHelper.instance.normalFontSize + 28,
            "big-6" to PreferencesHelper.instance.normalFontSize + 36,
        )

        private val builtinFontSizes = hashMapOf(
            "normal" to PreferencesHelper.instance.builtInNormalFontSize,
            "big" to PreferencesHelper.instance.builtInNormalFontSize + 4,
            "big-2" to PreferencesHelper.instance.builtInNormalFontSize + 6,
            "big-2" to PreferencesHelper.instance.builtInNormalFontSize + 9,
            "big-3" to PreferencesHelper.instance.builtInNormalFontSize + 12,
            "big-4" to PreferencesHelper.instance.builtInNormalFontSize + 20,
            "big-5" to PreferencesHelper.instance.builtInNormalFontSize + 28,
            "big-6" to PreferencesHelper.instance.builtInNormalFontSize + 36,
        )
    }

    fun addReceipt(receipt: PrinterReceipt) {
        _queue.add(receipt)
    }

    fun getReceipt(): PrinterReceipt? {
        return _queue.poll()
    }

    fun groupReceipts() {
        val map: MutableMap<String, PrinterReceipt> = HashMap()
        while (_queue.peek() != null) {
            _queue.poll()?.let { receipt ->
                if (map.contains(receipt.tag)) {
                    val r = map[receipt.tag]!!
                    val data = "${r.data}<cut>${receipt.data}"
                    val newReceipt = PrinterReceipt(
                        data, r.tag, r.isOpenDrawer, r.command
                    )

                    if (r.getElements().isNotEmpty() && receipt.getElements().isNotEmpty()) {
                        newReceipt.addElements(r.getElements())
                        newReceipt.addElement(UiElement.UiCut)
                        newReceipt.addElements(receipt.getElements())
                    }

                    map[newReceipt.tag] = newReceipt
                } else {
                    map[receipt.tag] = receipt
                }
            }
        }

        for (value in map.values) {
            _queue.add(value)
        }
    }

}