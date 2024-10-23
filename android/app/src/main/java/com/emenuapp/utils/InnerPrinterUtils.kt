package com.emenuapp_pk.utils

import android.content.Context
import android.graphics.Bitmap
import android.os.RemoteException
import com.emenuapp_pk.data.local.model.PrinterReceipt
import com.emenuapp_pk.data.local.prefs.PreferencesHelper
import com.emenuapp_pk.parser.RasterPrintParser
import com.emenuapp_pk.parser.UiElement
import com.sunmi.peripheral.printer.*

class InnerPrinterUtils {
    /**
     * sunmiPrinter means checking the printer connection status
     */
    private var sunmiPrinter: Int = CheckSunmiPrinter

    /**
     * SunmiPrinterService for API
     */
    private var sunmiPrinterService: SunmiPrinterService? = null

    private val innerPrinterCallback = object : InnerPrinterCallback() {
        override fun onConnected(service: SunmiPrinterService) {
            sunmiPrinterService = service
            checkSunmiPrinterService(service)
        }

        override fun onDisconnected() {
            sunmiPrinterService = null
            sunmiPrinter = LostSunmiPrinter
        }
    }

    /**
     * init sunmi print service
     */
    fun initSunmiPrinterService(ctx: Context) {
        try {
            val ret = InnerPrinterManager.getInstance().bindService(
                ctx, innerPrinterCallback
            )
            if (!ret) {
                sunmiPrinter = NoSunmiPrinter
            }
        } catch (e: InnerPrinterException) {
            e.printStackTrace()
        }
    }

    /**
     * Check the printer connection,
     * like some devices do not have a printer but need to be connected to the cash drawer through a print service
     */
    private fun checkSunmiPrinterService(service: SunmiPrinterService) {
        var ret = false
        try {
            ret = InnerPrinterManager.getInstance().hasPrinter(service)
        } catch (e: InnerPrinterException) {
            e.printStackTrace()
        }
        sunmiPrinter = if (ret) FoundSunmiPrinter else NoSunmiPrinter
    }

    /**
     * Some conditions can cause interface calls to fail
     * For example: the version is too low、device does not support
     * You can see [ExceptionConst]
     * So you have to handle these exceptions
     */
    private fun handleRemoteException(e: RemoteException) {
        e.printStackTrace()
    }

    /**
     * Open cash box
     * This method can be used on Sunmi devices with a cash drawer interface
     * If there is no cash box (such as V1、P1) or the call fails, an exception will be thrown
     *
     * Reference to https://docs.sunmi.com/general-function-modules/external-device-debug/cash-box-driver/}
     */
    private fun openCashBox(service: SunmiPrinterService) {
        try {
            service.openDrawer(null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }


    /**
     * print text
     * setPrinterStyle:Api require V4.2.22 or later, So use esc cmd instead when not supported
     * More settings reference documentation {@link WoyouConsts}
     * printTextWithFont:
     * Custom fonts require V4.14.0 or later!
     * You can put the custom font in the 'assets' directory and Specify the font name parameters
     * in the Api.
     */
    private fun printText(
        service: SunmiPrinterService,
        content: String,
        size: Float,
        alignment: Int = 0,
        isBold: Boolean = false,
        isUnderlined: Boolean = false,
        hasBlackBackground: Boolean = false,
        typeface: String? = null
    ) {
        try {
            try {
                service.setPrinterStyle(
                    WoyouConsts.ENABLE_BOLD, if (isBold) WoyouConsts.ENABLE else WoyouConsts.DISABLE
                )
            } catch (e: RemoteException) {
                if (isBold) {
                    service.sendRAWData(ESCUtil.boldOn(), null)
                } else {
                    service.sendRAWData(ESCUtil.boldOff(), null)
                }
            }

            try {
                service.setPrinterStyle(
                    WoyouConsts.ENABLE_UNDERLINE,
                    if (isUnderlined) WoyouConsts.ENABLE else WoyouConsts.DISABLE
                )
            } catch (e: RemoteException) {
                if (isUnderlined) {
                    service.sendRAWData(ESCUtil.underlineWithOneDotWidthOn(), null)
                } else {
                    service.sendRAWData(ESCUtil.underlineOff(), null)
                }
            }

            try {
                service.setPrinterStyle(
                    WoyouConsts.ENABLE_ANTI_WHITE,
                    if (hasBlackBackground) WoyouConsts.ENABLE else WoyouConsts.DISABLE
                )
            } catch (e: RemoteException) {
                if (hasBlackBackground) {
                    service.sendRAWData(ESCUtil.invertedOn(), null)
                } else {
                    service.sendRAWData(ESCUtil.invertedOff(), null)
                }
            }

            service.setAlignment(alignment, null)
            service.printTextWithFont(content, typeface, size, null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    /**
     * Print pictures and text in the specified orde
     * After the picture is printed,
     * the line feed output needs to be called,
     * otherwise it will be saved in the cache
     * In this example, the image will be printed because the print text content is added
     */
    private fun printBitmap(
        service: SunmiPrinterService, bitmap: Bitmap, alignment: Int = 0
    ) {
        try {
            service.setAlignment(alignment, null)
            service.printBitmap(bitmap, null)
            service.printText("\n", null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    /**
     * Print a row of a table
     */
    private fun printTableRow(
        service: SunmiPrinterService,
        content: Array<String>,
        width: IntArray,
        align: IntArray,
        isBold: Boolean = false,
        isUnderlined: Boolean = false,
        hasBlackBackground: Boolean = false
    ) {
        try {
            try {
                service.setPrinterStyle(
                    WoyouConsts.ENABLE_BOLD, if (isBold) WoyouConsts.ENABLE else WoyouConsts.DISABLE
                )
            } catch (e: RemoteException) {
                if (isBold) {
                    service.sendRAWData(ESCUtil.boldOn(), null)
                } else {
                    service.sendRAWData(ESCUtil.boldOff(), null)
                }
            }

            try {
                service.setPrinterStyle(
                    WoyouConsts.ENABLE_UNDERLINE,
                    if (isUnderlined) WoyouConsts.ENABLE else WoyouConsts.DISABLE
                )
            } catch (e: RemoteException) {
                if (isUnderlined) {
                    service.sendRAWData(ESCUtil.underlineWithOneDotWidthOn(), null)
                } else {
                    service.sendRAWData(ESCUtil.underlineOff(), null)
                }
            }

            try {
                service.setPrinterStyle(
                    WoyouConsts.ENABLE_ANTI_WHITE,
                    if (hasBlackBackground) WoyouConsts.ENABLE else WoyouConsts.DISABLE
                )
            } catch (e: RemoteException) {
                if (hasBlackBackground) {
                    service.sendRAWData(ESCUtil.invertedOn(), null)
                } else {
                    service.sendRAWData(ESCUtil.invertedOff(), null)
                }
            }

            service.printColumnsString(content, width, align, null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    private fun printLine(
        service: SunmiPrinterService, isDoubleLine: Boolean = false
    ) {
        try {
            val count = if (service.printerPaper == 1) 32 else 48
            val line = StringBuilder().apply {
                repeat(count) {
                    if (isDoubleLine) append("=") else append("-")
                }
                append("\n")
            }.toString()
            printText(
                service = service,
                content = line,
                size = 24.0f,
                alignment = 1,
                isBold = false,
                isUnderlined = false,
                hasBlackBackground = false
            )
            service.setFontSize(PreferencesHelper.instance.builtInNormalFontSize, null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    private fun wrapLines(service: SunmiPrinterService, lines: Int = 1) {
        try {
            service.lineWrap(lines, null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    /**
     * Due to the distance between the paper hatch and the print head,
     * the paper needs to be fed out automatically
     * But if the Api does not support it, it will be replaced by printing three lines
     */
    private fun feedPaper(service: SunmiPrinterService) {
        try {
            service.autoOutPaper(null)
        } catch (e: RemoteException) {
            print3Lines(service)
        }
    }

    /**
     * paper feed three lines
     * Not disabled when line spacing is set to 0
     */
    private fun print3Lines(service: SunmiPrinterService) {
        try {
            service.lineWrap(3, null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }


    /**
     * Printer cuts paper and throws exception on machines without a cutter
     */
    private fun cutPaper(service: SunmiPrinterService) {
        try {
            service.cutPaper(null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    private fun feedAndCutPaper(service: SunmiPrinterService) {
        try {
            feedPaper(service)
            cutPaper(service)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    fun clearBuffer() {
        try {
            sunmiPrinterService?.clearBuffer()
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    fun isServiceConnected(): Boolean {
        return sunmiPrinterService != null && sunmiPrinter == FoundSunmiPrinter
    }

    fun getDeviceName(): String {
        val model = sunmiPrinterService?.printerModal ?: "Builtin Printer"
        return model.ifEmpty { "Builtin Printer" }
    }

    fun getIdentifier(): String {
        return sunmiPrinterService?.printerSerialNo ?: "inner_printer"
    }

    fun testPrint() {
        sunmiPrinterService?.let { service ->
            try {
                service.printText("Testing...\n\n\n", null)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun printText(
        service: SunmiPrinterService, element: UiElement.UiText, wrap: Boolean = true
    ) {
        printText(
            service,
            element.getPlainValue(),
            element.size,
            element.align,
            element.isBold(),
            element.isUnderline(),
            element.hasBlackBackground()
        )
        if (wrap) {
            wrapLines(service)
        }
    }

    private fun printImage(
        service: SunmiPrinterService, element: UiElement.UiImage, bitmaps: Map<String, Bitmap>
    ) {
        bitmaps[element.tag]?.let { bitmap ->
            printBitmap(
                service, bitmap, element.align
            )
        }
    }

    private fun printTable(
        service: SunmiPrinterService, element: UiElement.UiTable
    ) {
        val totalColumns = element.maxColumnCount
        val widths = IntArray(totalColumns)
        val alignments = IntArray(totalColumns)
        val content = Array(totalColumns) { "" }

        for (row in element.getRows()) {
            var isBold = false
            var isUnderlined = false
            var hasBlackBackground = false

            row.getColumns().forEachIndexed { i, column ->
                content[i] = if (column.isDivider()) {
                    if (column.isDoubleDivider()) {
                        RasterPrintParser.DOUBLE_LINE_TAG
                    } else {
                        RasterPrintParser.LINE_TAG
                    }
                } else {
                    column.getPlainValue()
                }

                alignments[i] = column.align
                widths[i] = column.weight

                if (!isBold) {
                    isBold = column.isBold()
                }

                if (!isUnderlined) {
                    isUnderlined = column.isUnderline()
                }

                if (!hasBlackBackground) {
                    hasBlackBackground = column.hasBlackBackground()
                }
            }

            if (content.contains(RasterPrintParser.DOUBLE_LINE_TAG)) {
                printLine(service, true)
            } else if (content.contains(RasterPrintParser.LINE_TAG)) {
                printLine(service, false)
            } else {
                printTableRow(
                    service,
                    content,
                    widths,
                    alignments,
                    isBold,
                    isUnderlined,
                    hasBlackBackground
                )
            }
        }
    }

    fun printReceipt(
        receipt: PrinterReceipt,
        bitmaps: Map<String, Bitmap>,
        callback: ((status: Int) -> Unit)? = null
    ) {
        sunmiPrinterService?.let { service ->
            try {
                service.setFontSize(PreferencesHelper.instance.builtInNormalFontSize, null)
                for (element in receipt.getElements()) {
                    when (element) {
                        is UiElement.UiImage -> printImage(service, element, bitmaps)
                        is UiElement.UiTable -> printTable(service, element)
                        is UiElement.UiDivider -> printLine(service, element.isDouble)
                        is UiElement.UiText -> printText(service, element)
                        is UiElement.UiCut -> feedAndCutPaper(service)
                        else -> {}
                    }
                }

                feedAndCutPaper(service)

                if (receipt.isOpenDrawer) {
                    openCashBox(service)
                }

                callback?.invoke(1)
            } catch (e: Exception) {
                e.printStackTrace()
                callback?.invoke(-3)
            }
        } ?: run {
            callback?.invoke(-2)
        }
    }

    fun openCashDrawer(callback: ((status: Int) -> Unit)? = null) {
        sunmiPrinterService?.let { service ->
            try {
                openCashBox(service)
                callback?.invoke(1)
            } catch (e: Exception) {
                e.printStackTrace()
                callback?.invoke(-3)
            }
        } ?: run {
            callback?.invoke(-2)
        }
    }

    companion object {
        var NoSunmiPrinter = 0x00000000
        var CheckSunmiPrinter = 0x00000001
        var FoundSunmiPrinter = 0x00000002
        var LostSunmiPrinter = 0x00000003

        private val helper = InnerPrinterUtils()

        fun getInstance(): InnerPrinterUtils {
            return helper
        }
    }
}