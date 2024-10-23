package com.emenuapp_pk.data.local.model

object InstructionType {
    const val POS = 1
    const val RASTER = 2

    fun getInstructionType(instructionType: Int): Int {
        return when (instructionType) {
            1 -> POS
            else -> RASTER
        }
    }

    fun getInstructionTypeName(paperSize: Int): String {
        return when (paperSize) {
            POS -> "POS"
            else -> "Raster"
        }
    }
}