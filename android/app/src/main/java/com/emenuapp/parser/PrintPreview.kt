package com.emenuapp_pk.parser

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Color
import android.util.AttributeSet
import android.widget.LinearLayout
import androidx.appcompat.widget.LinearLayoutCompat
import com.emenuapp_pk.data.local.model.PaperSize

class PrintPreview @JvmOverloads constructor(
    ctx: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : LinearLayoutCompat(ctx, attrs, defStyleAttr) {

    private lateinit var data: List<UiElement>
    private lateinit var images: Map<String, Bitmap>

    private var paperSize: Int

    init {
        orientation = VERTICAL
        setBackgroundColor(Color.WHITE)
        paperSize = PaperSize.TWO_INCH
    }

    fun setPrintData(
        data: List<UiElement>,
        images: Map<String, Bitmap>,
        paperSize: Int,
        callback: (() -> Unit)? = null
    ) {
        this.data = data
        this.images = images
        this.paperSize = paperSize

        layoutParams?.let {
            layoutParams.width = paperSize
        }

        removeAllViews()
        generateLayout()

        postDelayed({
            callback?.invoke()
        }, 300)
    }

    private fun generateLayout() {
        for (element in data) {
            when (element) {
                is UiElement.UiImage -> appendImage(element)
                is UiElement.UiTable -> appendTable(element)
                is UiElement.UiDivider -> appendDivider(element)
                is UiElement.UiText -> appendText(element)
                else -> {}
            }
        }
    }

    private fun appendDivider(element: UiElement.UiDivider) {
        val divider = element.getView(context)
        addView(divider)
    }

    private fun appendTable(element: UiElement.UiTable) {
        for (row in element.getRows()) {
            val linearLayout = LinearLayout(context)
            linearLayout.layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                weightSum = row.weightSum.toFloat()
            }

            for (column in row.getColumns()) {
                val view = if (isLine(column.value)) {
                    column.getDividerView(context, true)
                } else {
                    column.getView(context, true)
                }
                linearLayout.addView(view)
            }

            addView(linearLayout)
        }
    }

    private fun appendText(element: UiElement.UiText) {
        val textView = element.getView(context)
        addView(textView)
    }

    private fun appendImage(element: UiElement.UiImage) {
        if (images.containsKey(element.tag)) {
            images[element.tag]?.let { bitmap ->
                val imageView = element.getView(context, bitmap)
                addView(imageView)
            }
        }
    }

    private fun isLine(value: String): Boolean {
        return value == "<line>" || value == "<dashed-line>" || value == "<double-line>"
    }
}