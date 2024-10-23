package com.emenuapp_pk.parser

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Color
import android.os.Parcelable
import android.text.Spanned
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.text.HtmlCompat
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.prefs.PreferencesHelper
import com.emenuapp_pk.utils.UiUtils
import kotlinx.parcelize.Parcelize
import org.jsoup.Jsoup
import java.util.*

@Parcelize
sealed class UiElement : Parcelable {
    @Parcelize
    object UiCut : UiElement(), Parcelable

    @Parcelize
    class UiImage(
        var tag: String = "",
        var width: Int = 24,
        var height: Int = 24,
        var align: Int = 1
    ) : UiElement(), Parcelable {
        fun getView(context: Context, bitmap: Bitmap): LinearLayout {
            val linearLayout = LinearLayout(context).apply {
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                )
                orientation = LinearLayout.VERTICAL
                gravity = getGravity(align)
            }

            val imageView = ImageView(context)
            imageView.layoutParams = ViewGroup.LayoutParams(width, height)
            imageView.setBackgroundColor(Color.WHITE)
            imageView.setImageBitmap(bitmap)

            linearLayout.addView(imageView)
            return linearLayout
        }
    }


    @Parcelize
    class UiText(
        var value: String = "",
        var align: Int = 0,
        var size: Float = 12.0f,
        var weight: Int = 1,
        var color: Int = Color.BLACK,
        var backgroundColor: Int = Color.WHITE,
        var isHtml: Boolean = false,
    ) : UiElement(), Parcelable {
        private fun getHtml(): Spanned {
            return HtmlCompat.fromHtml(value, HtmlCompat.FROM_HTML_MODE_LEGACY)
        }

        private fun getTextSize(ctx: Context): Float {
            return if (PreferencesHelper.instance.scalePrintText) {
                UiUtils.spToPx(ctx, size)
            } else {
                size
            }
        }

        fun getDividerView(ctx: Context, isColumn: Boolean): View {
            val isDouble = value == "<double-line>"

            val view = View(ctx)
            if (isDouble) {
                view.setBackgroundResource(R.drawable.ic_print_double_divider)
            } else {
                view.setBackgroundResource(R.drawable.ic_print_divider)
            }

            if (isColumn) {
                view.layoutParams = LinearLayout.LayoutParams(
                    0,
                    8,
                    weight.toFloat()
                ).apply {
                    gravity = Gravity.CENTER_VERTICAL
                }
            }

            return view
        }

        fun getView(ctx: Context, isColumn: Boolean = false): TextView {
            val textView = TextView(ctx)
            textView.text = if (isHtml) getHtml() else value
            textView.textSize = getTextSize(ctx) //
            textView.gravity = getGravity(align)
            textView.setTextColor(color)
            textView.setBackgroundColor(backgroundColor)

            if (isColumn) {
                textView.layoutParams = LinearLayout.LayoutParams(
                    0,
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    weight.toFloat()
                )
            }
            return textView
        }

        fun getPlainValue(): String {
            return Jsoup.parse(value).text()
        }

        fun getDividerValue(count: Int, isDouble: Boolean = false): String {
            return StringBuilder().apply {
                repeat(count) {
                    if (isDouble) append("=") else append("-")
                }
            }.toString()
        }

        fun isDivider(): Boolean {
            return value.startsWith(RasterPrintParser.LINE_TAG) || value.startsWith(
                RasterPrintParser.DOUBLE_LINE_TAG
            ) || value.startsWith(RasterPrintParser.DASHED_LINE_TAG)
        }

        fun isDoubleDivider(): Boolean {
            return value.startsWith("<double-line>")
        }

        fun isBold(): Boolean {
            return value.contains("<b>[^.]*</b>".toRegex())
        }

        fun isUnderline(): Boolean {
            return value.contains("<u>[^.]*</u>".toRegex())
        }

        fun hasBlackBackground(): Boolean {
            return backgroundColor != Color.WHITE
        }
    }


    @Parcelize
    class UiTable(
        private val columnWeights: MutableList<Int> = LinkedList(),
        private val rows: MutableList<UiRow> = LinkedList()
    ) : UiElement(), Parcelable {
        val columnWeightsSum: Int
            get() = columnWeights.sum()

        val maxColumnCount: Int
            get() = columnWeights.size

        var importantColumnIndex: Int = -1
            private set

        fun getColumnWeights(): List<Int> {
            return columnWeights
        }


        fun setColumnWeights(weightsString: String) {
            val weights = weightsString.split(";;")

            weights.forEachIndexed { i, w ->
                val weight = if (w.startsWith("[I]")) {
                    importantColumnIndex = i
                    w.removePrefix("[I]")
                } else {
                    w
                }

                columnWeights.add(weight.toInt())
            }

            /*val weights = weightsString.split(";;")
            for (weight in weights) {
                columnWeights.add(weight.toInt())
            }*/
        }

        fun getColumnWeight(index: Int): Int {
            return if (index < columnWeights.size) columnWeights[index] else 1
        }

        fun createRow(): UiRow {
            return UiRow(columnWeightsSum)
        }

        fun addRow(row: UiRow) {
            rows.add(row)
        }

        fun getRows() = rows
    }

    @Parcelize
    class UiRow(
        val weightSum: Int,
        private val columns: MutableList<UiText> = LinkedList()
    ) : UiElement(), Parcelable {
        fun addColumn(column: UiText) {
            columns.add(column)
        }

        fun getColumns() = columns
    }

    @Parcelize
    class UiDivider(
        var isDouble: Boolean = false
    ) : UiElement(), Parcelable {
        fun getView(ctx: Context?): View {
            val view = View(ctx)
            view.layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 8)
            if (isDouble) {
                view.setBackgroundResource(R.drawable.ic_print_double_divider)
            } else {
                view.setBackgroundResource(R.drawable.ic_print_divider)
            }
            return view
        }
    }


    fun getGravity(alignment: Int): Int {
        return when (alignment) {
            1 -> Gravity.CENTER
            2 -> Gravity.END
            else -> Gravity.START
        }
    }
}