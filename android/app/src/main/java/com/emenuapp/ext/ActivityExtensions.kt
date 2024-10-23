package com.emenuapp_pk.ext

import android.app.Activity
import android.content.DialogInterface
import android.widget.Toast
import androidx.annotation.StringRes
import com.google.android.material.dialog.MaterialAlertDialogBuilder

fun Activity.toast(@StringRes resource: Int, duration: Int = Toast.LENGTH_SHORT) {
    toast(getString(resource), duration)
}

fun Activity.toast(message: String, duration: Int = Toast.LENGTH_SHORT) {
    Toast.makeText(this, message, duration).show()
}

fun Activity.alert(@StringRes resource: Int, listener: DialogInterface.OnClickListener? = null) {
    alert(getString(resource), listener)
}

fun Activity.alert(message: String, listener: DialogInterface.OnClickListener? = null) {
    MaterialAlertDialogBuilder(this)
        .setMessage(message)
        .setPositiveButton(android.R.string.ok, listener)
        .show()
}