package com.emenuapp_pk.data.local.prefs

import android.app.Application
import androidx.core.content.edit
import androidx.preference.PreferenceManager

class PreferencesHelper(application: Application) {

    enum class Key {
        DEFAULT_PRINTER,
        SCALE_PRINT_TEXT,
        NORMAL_FONT_SIZE,
        BUILTIN_NORMAL_FONT_SIZE
    }

    companion object {
        lateinit var instance: PreferencesHelper
        @JvmStatic
        fun initialize(application: Application) {
            instance = PreferencesHelper(application)
        }
    }

    private val sharedPrefs = PreferenceManager.getDefaultSharedPreferences(
        application.applicationContext
    )

    var printerTagsList: String
        get() = sharedPrefs.getString("PrinterTag", "")!!
        set(value) = sharedPrefs.edit { putString("PrinterTag", value) }

    var defaultPrinter: Long
        get() = sharedPrefs.getLong(Key.DEFAULT_PRINTER.name, 0)
        set(value) = sharedPrefs.edit { putLong(Key.DEFAULT_PRINTER.name, value) }

    var scalePrintText: Boolean
        get() = sharedPrefs.getBoolean(Key.SCALE_PRINT_TEXT.name, true)
        set(value) = sharedPrefs.edit { putBoolean(Key.SCALE_PRINT_TEXT.name, value) }

    var normalFontSize: Float
        get() = sharedPrefs.getFloat(Key.NORMAL_FONT_SIZE.name, 12.0f)
        set(value) = sharedPrefs.edit { putFloat(Key.NORMAL_FONT_SIZE.name, value) }

    var builtInNormalFontSize: Float
        get() = sharedPrefs.getFloat(Key.BUILTIN_NORMAL_FONT_SIZE.name, 24.0f)
        set(value) = sharedPrefs.edit { putFloat(Key.BUILTIN_NORMAL_FONT_SIZE.name, value) }
}