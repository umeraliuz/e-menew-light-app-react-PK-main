package com.emenuapp_pk.ext

import android.content.DialogInterface
import android.widget.Toast
import androidx.annotation.StringRes
import androidx.fragment.app.Fragment
import com.google.android.material.dialog.MaterialAlertDialogBuilder

fun Fragment.toast(@StringRes resource: Int, duration: Int = Toast.LENGTH_SHORT) {
    toast(getString(resource), duration)
}

fun Fragment.toast(message: String, duration: Int = Toast.LENGTH_SHORT) {
    Toast.makeText(requireContext(), message, duration).show()
}

fun Fragment.alert(@StringRes resource: Int, listener: DialogInterface.OnClickListener? = null) {
    alert(getString(resource), listener)
}

fun Fragment.alert(message: String, listener: DialogInterface.OnClickListener? = null) {
    MaterialAlertDialogBuilder(requireContext())
        .setMessage(message)
        .setPositiveButton(android.R.string.ok, listener)
        .show()
}