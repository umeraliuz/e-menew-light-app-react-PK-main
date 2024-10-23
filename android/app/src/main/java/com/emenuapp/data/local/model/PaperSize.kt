package com.emenuapp_pk.data.local.model

object PaperSize {
    const val TWO_INCH = 384
    const val THREE_INCH = 576

    fun getMaxCharacters(paperSize: Int): Int {
        return when (paperSize) {
            THREE_INCH -> 48
            else -> 32
        }
    }

    fun getPrinterWidth(paperSize: Int): Float {
        return when (paperSize) {
            THREE_INCH -> 72f
            else -> 48f
        }
    }

    fun getPaperSizeName(paperSize: Int): String {
        return when (paperSize) {
            THREE_INCH -> "3\" (576dots)"
            else -> "2\" (384dots)"
        }
    }
}