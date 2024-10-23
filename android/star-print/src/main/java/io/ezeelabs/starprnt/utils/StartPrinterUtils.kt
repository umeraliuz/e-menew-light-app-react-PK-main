package io.ezeelabs.starprnt.utils

import android.graphics.*
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import io.ezeelabs.starprnt.data.model.StarPaperSize

object StartPrinterUtils {
    fun create2InchRasterReceiptImage(): Bitmap {
        val textToPaint = """
            Star Clothing Boutique
            123 Star Road
            City, State 12345
            
            Date:MM/DD/YYYY    Time:HH:MM PM
            --------------------------------
            SALE
            SKU       Description      Total
            300678566 PLAIN T-SHIRT    10.99
            300692003 BLACK DENIM      29.99
            300651148 BLUE DENIM       29.99
            300642980 STRIPED DRESS    49.99
            30063847  BLACK BOOTS      35.99
            `
            Subtotal                  156.95
            Tax                         0.00
            --------------------------------
            Total               ${'$'}156.95
            --------------------------------
            
            Charge
            156.95
            Visa XXXX-XXXX-XXXX-0123
            Refunds and Exchanges
            Within 30 days with receipt
            And tags attached
        """.trimIndent()

        val textSize = 22;
        val typeface = Typeface.create(
            Typeface.MONOSPACE,
            Typeface.NORMAL
        )

        return createBitmapFromText(
            textToPaint,
            textSize,
            StarPaperSize.TWO_INCH,
            typeface
        )
    }

    fun create3InchRasterReceiptImage(): Bitmap {
        val textToPrint = """        
            Star Clothing Boutique
            123 Star Road
            City, State 12345

            Date:MM/DD/YYYY          Time:HH:MM PM
            --------------------------------------
            SALE
            SKU            Description       Total
            300678566      PLAIN T-SHIRT     10.99
            300692003      BLACK DENIM       29.99
            300651148      BLUE DENIM        29.99
            300642980      STRIPED DRESS     49.99
            30063847       BLACK BOOTS       35.99

            Subtotal                        156.95
            Tax                               0.00
            --------------------------------------
            Total                          $156.95
            --------------------------------------

            Charge
            156.95
            Visa XXXX-XXXX-XXXX-0123
            Refunds and Exchanges
            Within 30 days with receipt
            And tags attached
        """.trimIndent()

        val textSize = 25
        val typeface = Typeface.create(Typeface.MONOSPACE, Typeface.NORMAL)

        return createBitmapFromText(
            textToPrint,
            textSize,
            StarPaperSize.THREE_INCH,
            typeface
        )
    }

    private fun createBitmapFromText(
        printText: String,
        textSize: Int,
        printWidth: Int,
        typeface: Typeface
    ): Bitmap {
        val paint = Paint()

        paint.textSize = textSize.toFloat()
        paint.typeface = typeface

        paint.getTextBounds(printText, 0, printText.length, Rect())

        val textPaint = TextPaint(paint)

        val staticLayout = StaticLayout(
            printText,
            textPaint,
            printWidth,
            Layout.Alignment.ALIGN_NORMAL,
            1.0f,
            0.0f,
            false
        )

        val bitmap =
            Bitmap.createBitmap(staticLayout.width, staticLayout.height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        canvas.drawColor(Color.WHITE)
        canvas.translate(0.0f, 0.0f)
        staticLayout.draw(canvas)

        return bitmap
    }



}