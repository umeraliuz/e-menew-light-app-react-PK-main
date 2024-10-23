package com.emenuapp_pk.parser

import android.graphics.Bitmap
import com.emenew.genericprnt.EscPosPrinter
import com.emenew.genericprnt.exceptions.EscPosParserException
import com.emenew.genericprnt.textparser.PrinterTextParserImg
import org.apache.commons.text.WordUtils
import java.util.*

class TextPrintParser(
    private val printer: EscPosPrinter,
    private val data: String,
    private val imagesMap: Map<String, Bitmap>,
    private val maxLineCharacters: Int
) {
    private val contentBuilder: StringBuilder = StringBuilder()

    @Throws(EscPosParserException::class)
    fun parse(): String {
        var lineNo = 0
        var isTableOpen = false
        var isImage = false
        var isLine = false
        var isDoubleLine = false
        val columnWidths: MutableList<Int> = ArrayList()

        try {
            val lines = data.split("\n|\r\n".toRegex())
            for (i in lines.indices) {
                lineNo = i
                val line = lines[i]

                if (line.startsWith(TABLE_START_TAG)) {
                    val l: String = line.substring(3)
                    val weights = l.split(";;").toTypedArray()
                    columnWidths.clear()
                    columnWidths.addAll(getWeights(weights))
                    isTableOpen = true
                    continue
                }

                if (line.startsWith(TABLE_END_TAG)) {
                    isTableOpen = false
                    continue
                }

                if (line.contains("<img>")) {
                    isImage = true
                }

                if (line.contains(DASHED_LINE_TAG) && !isTableOpen) {
                    isLine = true
                }

                if (line.contains(LINE_TAG) && !isTableOpen) {
                    isLine = true
                }

                if (line.contains(DOUBLE_LINE_TAG) && !isTableOpen) {
                    isDoubleLine = true
                }

                if (isTableOpen) {
                    parseColumn(line, columnWidths)
                } else if (isImage) {
                    parseImage(line)?.let { image ->
                        contentBuilder.append(image)
                        contentBuilder.append("\n")
                    }
                    isImage = false
                } else if (isLine) {
                    contentBuilder.append(parseLine(false))
                    contentBuilder.append("\n")
                    isLine = false
                } else if (isDoubleLine) {
                    contentBuilder.append(parseLine(true))
                    contentBuilder.append("\n")
                    isDoubleLine = false
                } else {
                    contentBuilder.append(line).append("\n")
                }
            }

            return contentBuilder.toString()
        } catch (e: Exception) {
            val message = if (!e.message.isNullOrEmpty()) {
                "Line No: $lineNo, ${e.message}"
            } else {
                "Line No: $lineNo, Invalid print format."
            }
            throw IllegalArgumentException(message)
        }
    }

    @Throws(EscPosParserException::class)
    private fun getWeights(list: Array<String>): List<Int> {
        return try {
            val weights: MutableList<Int> = ArrayList()
            val columnWidths: MutableList<Int> = ArrayList()
            var importantIndex: Int = -1

            list.forEachIndexed { i, w ->
                val weight = if (w.startsWith("[I]")) {
                    importantIndex = i
                    w.removePrefix("[I]")
                } else {
                    w
                }

                weights.add(weight.toInt())
            }

            val weightSum = weights.sum()
            val constant = maxLineCharacters / weightSum.toDouble()
            weights.forEach { weight ->
                val width = constant * weight
                columnWidths.add(width.toInt())
            }

            val widthSum = columnWidths.sum()

            if (widthSum < maxLineCharacters) {
                if (importantIndex > -1) {
                    columnWidths[importantIndex] += maxLineCharacters - widthSum
                } else {
                    columnWidths[columnWidths.size - 1] += maxLineCharacters - widthSum
                }
            }

            columnWidths
        } catch (e: java.lang.Exception) {
            throw EscPosParserException("Invalid table column syntax.")
        }
    }

    @Throws(EscPosParserException::class)
    private fun parseImage(line: String): String? {
        try {
            val alignment = getAlignment(line)

            val newLine = clipAlignment(line, alignment)
            val content = clipTags(
                newLine,
                IMAGE_START_TAG,
                IMAGE_END_TAG
            )
            val contents = content.split("\\|".toRegex())

            if (content.isNotEmpty()) {
                val tag = contents[0]
                val width: Int
                val height: Int

                when (contents.size) {
                    2 -> {
                        width = contents[1].toInt()
                        height = width
                    }
                    3 -> {
                        width = contents[1].toInt()
                        height = contents[2].toInt()
                    }
                    else -> {
                        width = 0
                        height = 0
                    }
                }

                return if (imagesMap.containsKey(tag)) {
                    val parsedImage = if (width != 0 && height != 0) {
                        PrinterTextParserImg.bitmapToHexadecimalString(
                            printer,
                            imagesMap[tag],
                            width,
                            height
                        )
                    } else {
                        PrinterTextParserImg.bitmapToHexadecimalString(
                            printer,
                            imagesMap[tag]
                        )
                    }

                    StringBuilder().apply {
                        append(alignment)
                        append(IMAGE_START_TAG)
                        append(parsedImage)
                        append(IMAGE_END_TAG)
                        append("\n")
                    }.toString()
                } else {
                    null
                }
            } else {
                throw IllegalArgumentException("Invalid image tag format.")
            }
        } catch (e: Exception) {
            throw EscPosParserException("There is an error in print command syntax.")
        }
    }

    private fun parseLine(isDouble: Boolean, width: Int = maxLineCharacters): String {
        val builder = StringBuilder()
        repeat(width) {
            if (isDouble) builder.append("=") else builder.append("-")
        }
        return builder.toString()
    }

    @Throws(EscPosParserException::class)
    private fun parseColumn(line: String, widths: List<Int>) {
        try {
            val columns = line.split(";;")
            parseTable(columns, widths)
        } catch (e: java.lang.Exception) {
            throw EscPosParserException("There is an error in print command syntax.")
        }
    }

    @Throws(EscPosParserException::class)
    private fun parseTable(columns: List<String>, widths: List<Int>) {
        try {
            var max = 0
            val table: MutableList<MutableList<String>> = ArrayList()
            val alignments: MutableList<String> = ArrayList()
            val placeHolders: MutableList<String> = ArrayList()
            for (i in columns.indices) {
                val column = columns[i]
                val alignment = getAlignment(column)
                alignments.add(alignment)

                val clippedColumn = clipAlignment(column, alignment)

                val tags = parseTags(clippedColumn)
                placeHolders.add(getPlaceHolder(tags))

                val value = when (val content = tags.removeFirst().removePrefix("C:")) {
                    DASHED_LINE_TAG, LINE_TAG -> {
                        parseLine(false, widths[i])
                    }
                    DOUBLE_LINE_TAG -> {
                        parseLine(true, widths[i])
                    }
                    else -> {
                        WordUtils.wrap(content, widths[i], null, true)
                    }
                }

                //val value = WordUtils.wrap(content, widths[i], null, true)
                val newLines = value.split("\n|\r\n".toRegex())
                table.add(newLines.toMutableList())
                if (newLines.size > max) {
                    max = newLines.size
                }
            }

            for (i in table.indices) {
                val size = table[i].size
                if (size < max) {
                    for (j in 0 until max - size) {
                        table[i].add("")
                    }
                }
            }

            var lastAlignment = ""
            for (i in 0 until max) {
                for (j in table.indices) {
                    val alignment = alignments[j]
                    if (lastAlignment != alignment) {
                        lastAlignment = alignment
                        //contentBuilder.append(lastAlignment);
                    }
                    val placeHolder = placeHolders[j]
                    val value = table[j][i]
                    val padding: String = padString(value, lastAlignment, widths[j])
                    val content = placeHolder.replace("[]", value)
                    when (lastAlignment) {
                        "[L]" -> {
                            contentBuilder.append(content)
                            contentBuilder.append(padding)
                        }
                        "[C]" -> {
                            contentBuilder.append(padding)
                            contentBuilder.append(content)
                            contentBuilder.append(padding)
                        }
                        "[R]" -> {
                            contentBuilder.append(padding)
                            contentBuilder.append(content)
                        }
                    }
                }
                contentBuilder.append("\n")
            }
        } catch (e: java.lang.Exception) {
            throw EscPosParserException("There is an error in print command syntax.")
        }
    }

    @Throws(EscPosParserException::class)
    private fun padString(value: String, alignment: String, width: Int): String {
        return try {
            val builder = java.lang.StringBuilder()
            var maxWidth = width - value.length
            if (value.length < width) {
                if (alignment == "[C]") {
                    maxWidth /= 2
                }
                for (p in 0 until maxWidth) {
                    builder.append(" ")
                }
            }
            builder.toString()
        } catch (e: java.lang.Exception) {
            throw EscPosParserException("There is an error in print command syntax.")
        }
    }

    private fun getPlaceHolder(tags: LinkedList<String>): String {
        if (tags.first.startsWith("C:")) {
            return "[]"
        }
        var placeHolder = tags.removeFirst().removePrefix("T:")
        while (tags.first.startsWith("T:")) {
            val tag = tags.removeFirst().removePrefix("T:")
            placeHolder = tag.replace("[]", placeHolder!!)
        }
        return placeHolder
    }

    private fun parseTags(line: String): LinkedList<String> {
        val list = LinkedList<String>()
        var newLine = line
        if (FONT_TAG_REGEX.matches(newLine)) {
            val fontTag = parseFontTag(newLine)
            newLine = clipTags(newLine, FONT_START_TAG, FONT_END_TAG)
            list.offerLast(fontTag)
        }

        if (BOLD_TAG_REGEX.matches(newLine)) {
            newLine = clipTags(newLine, BOLD_START_TAG, BOLD_END_TAG)
            list.offerLast("T:<b>[]</b>")
        }

        if (UNDERLINE_TAG_REGEX.matches(newLine)) {
            val underlineTag = parseUnderlineTag(newLine)
            newLine = clipTags(newLine, UNDERLINE_START_TAG, UNDERLINE_END_TAG)
            list.offerLast(underlineTag)
        }

        list.offerLast("C:$newLine")

        return list
    }

    private fun parseFontTag(line: String): String {
        val builder = StringBuilder()
        builder.append("T:<font")

        val fontSize = getTagProperty(
            line,
            FONT_SIZE_PROPERTY,
            FONT_START_TAG
        )

        if (!fontSize.isNullOrEmpty()) {
            builder.append(" size='${fontSize}'")
        }

        val fontColor = getTagProperty(
            line,
            FONT_COLOR_PROPERTY,
            FONT_START_TAG
        )

        if (!fontColor.isNullOrEmpty()) {
            builder.append(" color='${fontColor}'")
        }

        builder.append(">[]</font>")

        return builder.toString()
    }

    private fun parseUnderlineTag(line: String): String {
        val underlineType = getTagProperty(
            line,
            UNDERLINE_TYPE_PROPERTY,
            UNDERLINE_START_TAG
        )

        return if (underlineType == "double") {
            "T:<u type='double'>[]</u>"
        } else {
            "T:<u>[]</u>"
        }
    }

    private fun clipTags(line: String, startTag: String, endTag: String = ""): String {
        var newLine = line.replace(startTag.toRegex(), "")
        if (endTag.isNotEmpty()) {
            newLine = newLine.replace(endTag.toRegex(), "")
        }

        return newLine
    }

    private fun getTagProperty(line: String, property: String, tag: String): String? {
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

    private fun clipAlignment(line: String, alignment: String): String {
        return line.removePrefix(alignment);
    }

    private fun getAlignment(line: String): String {
        return if (line.startsWith(ALIGN_CENTER)) {
            ALIGN_CENTER
        } else if (line.startsWith(ALIGN_RIGHT)) {
            ALIGN_RIGHT
        } else {
            ALIGN_LEFT
        }
    }

    companion object {
        private const val DASHED_LINE_TAG = "<dashed-line>"
        private const val LINE_TAG = "<line>"
        private const val DOUBLE_LINE_TAG = "<double-line>"
        private const val TABLE_START_TAG = "<T>"
        private const val TABLE_END_TAG = "</T>"
        private const val IMAGE_START_TAG = "<img>"
        private const val IMAGE_END_TAG = "</img>"
        private const val BOLD_START_TAG = "<b>"
        private const val BOLD_END_TAG = "</b>"
        private const val UNDERLINE_START_TAG = "<u[^>]*>"
        private const val UNDERLINE_END_TAG = "</u>"
        private const val FONT_START_TAG = "<font[^>]*>"
        private const val FONT_END_TAG = "</font>"

        private val FONT_TAG_REGEX = "<font[^>]*>.*</font>".toRegex()
        private val BOLD_TAG_REGEX = "<b>.*</b>".toRegex()
        private val ITALIC_TAG_REGEX = "<i>.*</i>".toRegex()
        private val UNDERLINE_TAG_REGEX = "<u[^>]*>.*</u>".toRegex()


        private const val FONT_SIZE_PROPERTY = "size"
        private const val FONT_COLOR_PROPERTY = "color"
        private const val UNDERLINE_TYPE_PROPERTY = "type"

        private const val ALIGN_LEFT = "[L]"
        private const val ALIGN_CENTER = "[C]"
        private const val ALIGN_RIGHT = "[R]"
    }
}