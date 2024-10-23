package com.emenuapp_pk.ui.base

import android.content.Context
import android.os.Bundle
import android.view.inputmethod.InputMethodManager
import androidx.annotation.StringRes
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.viewbinding.ViewBinding
import com.emenuapp_pk.BuildConfig
import com.emenuapp_pk.exception.ExceptionHandler
import com.emenuapp_pk.utils.UiUtils

abstract class BaseActivity<B : ViewBinding> : AppCompatActivity() {

    protected lateinit var binding: B

    private var progressDialog: AlertDialog? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = provideBinding()
        setContentView(binding.root)

        if (BuildConfig.DEBUG) {
            Thread.setDefaultUncaughtExceptionHandler(ExceptionHandler(this))
        }
    }

    abstract fun provideBinding(): B

    fun showProgress(@StringRes resource: Int) {
        showProgress(getString(resource))
    }

    fun showProgress(message: String) {
        if (progressDialog == null) {
            progressDialog = UiUtils.getProgressDialog(this, message)
        } else {
            progressDialog?.setMessage(message)
        }

        progressDialog?.show()
    }

    fun hideProgress() {
        progressDialog?.dismiss()
    }


    // Input Method Manager
    fun hideKeyboard() {
        currentFocus?.let { v ->
            val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            imm.hideSoftInputFromWindow(v.windowToken, 0)
        }
    }
}