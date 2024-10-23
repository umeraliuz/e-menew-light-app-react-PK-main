package com.emenuapp_pk.utils

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.util.DisplayMetrics
import android.util.TypedValue
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AlertDialog
import com.emenuapp_pk.data.local.model.PaperSize
import com.emenuapp_pk.databinding.DialogProgressBinding

object UiUtils {
    fun dpToPx(ctx: Context, dp: Float): Float {
        return TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            dp,
            ctx.resources.displayMetrics
        )
    }

    fun spToPx(ctx: Context, sp: Float): Float {
        return TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_SP,
            sp,
            ctx.resources.displayMetrics
        )
    }


    fun getBitmap(view: View): Bitmap {
        val displayMetrics: DisplayMetrics = view.context.resources.displayMetrics
        view.layoutParams = ViewGroup.LayoutParams(
            PaperSize.THREE_INCH,
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
        view.measure(displayMetrics.widthPixels, displayMetrics.heightPixels)
        view.layout(0, 0, displayMetrics.widthPixels, displayMetrics.heightPixels)
        val bitmap = Bitmap.createBitmap(
            view.measuredWidth,
            view.measuredHeight,
            Bitmap.Config.ARGB_8888
        )
        val canvas = Canvas(bitmap)
        view.draw(canvas)
        return bitmap
    }

    fun getBitmapFromView(view: View): Bitmap {
        val bitmap = Bitmap.createBitmap(
            view.measuredWidth,
            view.measuredHeight,
            Bitmap.Config.ARGB_8888
        )
        val canvas = Canvas(bitmap)
        view.draw(canvas)
        return bitmap
    }

    @SuppressLint("InflateParams")
    fun getProgressDialog(context: Context, m: String): AlertDialog {
        val builder = AlertDialog.Builder(context)
        builder.setCancelable(false)
        val binding = DialogProgressBinding.inflate(LayoutInflater.from(context))
        binding.message.text = m
        builder.setView(binding.root)
        val alertDialog = builder.create()
        alertDialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        return alertDialog
    }
}