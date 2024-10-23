package com.emenuapp_pk.ui.base.custom

import android.content.Context
import android.util.AttributeSet
import androidx.appcompat.widget.LinearLayoutCompat
import com.emenuapp_pk.data.local.model.PaperSize

class PrintView @JvmOverloads constructor(
    ctx: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : LinearLayoutCompat(
    ctx,
    attrs,
    defStyleAttr
) {
    val paperSize: Int = PaperSize.TWO_INCH

    init {
        orientation = VERTICAL
        layoutParams.width = paperSize
    }
}