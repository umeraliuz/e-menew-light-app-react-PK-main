package com.emenuapp_pk.ui.base

import android.os.Bundle
import android.view.View
import androidx.annotation.LayoutRes
import androidx.annotation.StringRes
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.viewbinding.ViewBinding
import com.emenuapp_pk.utils.UiUtils

abstract class BaseFragment<B : ViewBinding>(@LayoutRes layout: Int) : Fragment(layout) {

    protected lateinit var binding: B

    private var progressDialog: AlertDialog? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = provideBinding(view)
        setup()
    }

    abstract fun provideBinding(view: View): B

    abstract fun setup()

    fun showProgress(@StringRes resource: Int) {
        showProgress(getString(resource))
    }

    fun showProgress(message: String) {
        if (progressDialog == null) {
            progressDialog = UiUtils.getProgressDialog(requireContext(), message)
        } else {
            progressDialog?.setMessage(message)
        }

        progressDialog?.show()
    }

    fun hideProgress() {
        progressDialog?.dismiss()
    }
}