package com.emenuapp_pk.data.local.model

import android.os.Parcelable
import io.objectbox.annotation.Entity
import io.objectbox.annotation.Id
import io.objectbox.annotation.Unique
import kotlinx.parcelize.Parcelize

@Parcelize
@Entity
data class SavedPrinter(
    @Id var id: Long = 0,
    @Unique var tag: String,
    var type: Int,
    var manufacturer: Int,
    var model: String,
    var index: Int = -1,
    @Unique var portName: String = "",
    var portSettings: String = "",
    @Unique var macAddress: String,
    var cashDrawerOpenStatus: Boolean = false,
    var paperSize: Int = PaperSize.TWO_INCH,
    var instructionType: Int = InstructionType.RASTER,
    var charsetEncoding: Int
) : Parcelable