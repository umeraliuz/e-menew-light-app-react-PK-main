package com.emenuapp_pk.ui.print

import android.content.Context
import android.graphics.Bitmap
import com.emenew.genericprnt.EscPosCharsetEncoding
import com.emenew.genericprnt.EscPosPrinter
import com.emenew.genericprnt.connection.DeviceConnection
import com.emenew.genericprnt.exceptions.EscPosBarcodeException
import com.emenew.genericprnt.exceptions.EscPosConnectionException
import com.emenew.genericprnt.exceptions.EscPosEncodingException
import com.emenew.genericprnt.exceptions.EscPosParserException
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.model.PaperSize
import com.emenuapp_pk.parser.TextPrintParser

class GenericPrinter(
    val ctx: Context,
    val connection: DeviceConnection,
    paperSize: Int,
    characterSet: Int
) {
    private val printerDpi: Int = 203
    private val maxCharacterPerLine: Int
    private val printerWidthMM: Float
    private val printerCharacterSetEncoding: EscPosCharsetEncoding

    init {
        maxCharacterPerLine = PaperSize.getMaxCharacters(paperSize)
        printerWidthMM = PaperSize.getPrinterWidth(paperSize)
        printerCharacterSetEncoding =
            EscPosCharsetEncoding(characterSet)
    }

    fun print(
        printerData: String?,
        imagesMap: Map<String, Bitmap> = emptyMap(),
        openDrawer: Boolean = false,
        callback: (status: Int, message: String) -> Unit
    ) {
        printerData?.let {
            callback.invoke(
                STATUS_CONNECTING,
                ctx.getString(R.string.connecting_printer)
            )


            try {
                val printer = EscPosPrinter(
                    connection,
                    printerDpi,
                    printerWidthMM,
                    maxCharacterPerLine,
                    printerCharacterSetEncoding
                )

                val dataList = printerData.split("<cut>")
                for (data in dataList) {
                    val textParser = TextPrintParser(
                        printer,
                        data,
                        imagesMap,
                        maxCharacterPerLine
                    )
                    val parsedData = textParser.parse()

                    /*val parser = PrintParser(
                        printer,
                        printerData,
                        imagesMap,
                        maxCharacterPerLine
                        )
                     val parsedData = parser.parse()*/

                    callback.invoke(
                        STATUS_PRINTING,
                        ctx.getString(R.string.printing_in_progress)
                    )

                    if (openDrawer) {
                        printer.printFormattedTextAndOpenCashBox(parsedData)
                    } else {
                        printer.printFormattedTextAndCut(parsedData)
                    }

                    callback.invoke(
                        STATUS_PRINTED,
                        ctx.getString(R.string.finish_success)
                    )
                }
                printer.disconnectPrinter()
            } catch (e: EscPosConnectionException) {
                e.printStackTrace()
                callback.invoke(
                    STATUS_PRINTER_DISCONNECTED,
                    ctx.getString(R.string.printer_connection_error)
                )
            } catch (e: EscPosBarcodeException) {
                e.printStackTrace()
                callback.invoke(
                    STATUS_BARCODE_ERROR,
                    ctx.getString(R.string.barcode_error)
                )
            } catch (e: EscPosEncodingException) {
                e.printStackTrace()
                callback.invoke(
                    STATUS_ENCODING_ERROR,
                    ctx.getString(R.string.encoding_error)
                )
            } catch (e: EscPosParserException) {
                e.printStackTrace()
                callback.invoke(
                    STATUS_PARSER_ERROR,
                    ctx.getString(R.string.parser_error)
                )
            }
        } ?: run {
            callback.invoke(
                STATUS_NO_PRINTER,
                ctx.getString(R.string.no_printer_error)
            )
        }
    }

    fun openDrawer(callback: (status: Int, message: String) -> Unit) {
        callback.invoke(
            STATUS_CONNECTING,
            ctx.getString(R.string.connecting_printer)
        )
        try {
            val printer = EscPosPrinter(
                connection,
                printerDpi,
                printerWidthMM,
                maxCharacterPerLine
            )

            callback.invoke(
                STATUS_PRINTING,
                ctx.getString(R.string.printing_in_progress)
            )

            printer.openCashDrawer()

            callback.invoke(
                STATUS_PRINTED,
                ctx.getString(R.string.finish_success)
            )
        } catch (e: EscPosConnectionException) {
            e.printStackTrace()
            callback.invoke(
                STATUS_PRINTER_DISCONNECTED,
                ctx.getString(R.string.printer_connection_error)
            )
        }
    }

    companion object {
        private const val STATUS_CONNECTING = 1
        private const val STATUS_PRINTING = 2
        private const val STATUS_PRINTED = 3
        private const val STATUS_NO_PRINTER = -1
        private const val STATUS_PRINTER_DISCONNECTED = -2
        private const val STATUS_PARSER_ERROR = -3
        private const val STATUS_ENCODING_ERROR = -4
        private const val STATUS_BARCODE_ERROR = -5
    }
}