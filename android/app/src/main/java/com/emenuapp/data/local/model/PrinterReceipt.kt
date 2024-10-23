package com.emenuapp_pk.data.local.model

import android.os.Parcelable
import com.emenuapp_pk.data.local.db.DbHelper
import com.emenuapp_pk.parser.RasterPrintParser
import com.emenuapp_pk.parser.UiElement
import kotlinx.parcelize.Parcelize
import java.util.*

@Parcelize
class PrinterReceipt(
    val data: String,
    val tag: String,
    val isOpenDrawer: Boolean = false,
    val command: RasterPrintParser.PrintCommand = RasterPrintParser.PrintCommand.PRINT,
    private val list: MutableList<UiElement> = LinkedList()
) : Parcelable {

    fun isRasterPrinter(tag: String): Boolean {
        DbHelper.instance.getPrinterByTag(tag)?.let { printer ->
            return Manufacturer.getById(printer.manufacturer) is Manufacturer.Star || printer.instructionType == InstructionType.RASTER
        }
        return false
    }

    fun isBuiltInPrinter(tag: String): Boolean {
        DbHelper.instance.getPrinterByTag(tag)?.let { printer ->
            return Manufacturer.getById(printer.manufacturer) is Manufacturer.Sunmi || PrinterType.getById(
                printer.type
            ) is PrinterType.InternalPrinter
        }
        return false
    }

    fun getElements(): List<UiElement> {
        return list
    }

    fun addElement(element: UiElement) {
        list.add(element)
    }

    fun addElements(elements: List<UiElement>) {
        list.addAll(elements)
    }
}