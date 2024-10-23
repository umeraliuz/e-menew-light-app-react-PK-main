package com.emenuapp_pk.exception

import android.content.Context
import android.os.Build
import android.os.Process
import com.emenuapp_pk.ui.log.ExceptionLogActivity
import java.io.PrintWriter
import java.io.StringWriter
import kotlin.system.exitProcess

class ExceptionHandler(
    private val mActivity: Context
) : Thread.UncaughtExceptionHandler {

    override fun uncaughtException(t: Thread, exception: Throwable) {
        exception.printStackTrace()
        val stackTrace = StringWriter()
        exception.printStackTrace(PrintWriter(stackTrace))
        "\n"
        val errorReport = """
            ************ CAUSE OF ERROR ************

            $stackTrace
            ************ DEVICE INFORMATION ***********

            Brand: ${Build.BRAND}
            Device: ${Build.DEVICE}
            Model: ${Build.MODEL}
            Id: ${Build.ID}
            Product: ${Build.PRODUCT}

            ************ FIRMWARE ************

            SDK: ${Build.VERSION.SDK}
            Release: ${Build.VERSION.RELEASE}
            Incremental: ${Build.VERSION.INCREMENTAL}

            """.trimIndent()

        val intent = ExceptionLogActivity.newIntent(mActivity, errorReport)
        mActivity.startActivity(intent)
        Process.killProcess(Process.myPid())
        exitProcess(10)
    }
}