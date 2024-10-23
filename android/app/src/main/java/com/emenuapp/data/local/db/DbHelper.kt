package com.emenuapp_pk.data.local.db

import android.app.Application
import android.content.Context
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.model.*
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import io.objectbox.Box
import io.objectbox.BoxStore
import io.objectbox.kotlin.boxFor
import io.objectbox.kotlin.query
import io.objectbox.query.QueryBuilder
import java.io.InputStreamReader
import java.nio.charset.StandardCharsets

class DbHelper(application: Application) {

    companion object {
        lateinit var instance: DbHelper

        @JvmStatic
        fun initialize(application: Application) {
            instance = DbHelper(application)
        }
    }

    private val boxStore: BoxStore

    init {
        boxStore = MyObjectBox.builder()
            .androidContext(application.applicationContext)
            .build()

        seedDb(application.applicationContext)

        /*if (BuildConfig.DEBUG) {
            boolean isStarted = new AndroidObjectBrowser(boxStore)
                    .start(application.getApplicationContext());
            Timber.i("Object Browser | Started: %s", isStarted);
        }*/
    }

    private fun seedDb(ctx: Context) {
        val type = object : TypeToken<List<PrinterTag>>() {}.type
        val inputStream = ctx.resources.openRawResource(R.raw.printer_tags)
        val reader = InputStreamReader(inputStream, StandardCharsets.UTF_8)
        val printerTags: List<PrinterTag> = Gson().fromJson(reader, type)
        for (printerTag in printerTags) {
            savePrinterTag(printerTag.name)
        }
    }

    fun saveHistory(history: History) {
        val box = boxStore.boxFor(
            History::class.java
        )
        box.put(history)
    }

    val history: List<History>
        get() {
            val box = boxStore.boxFor(
                History::class.java
            )
            return box.all
        }

    fun getPrinterTag(tag: String): PrinterTag {
        val box: Box<PrinterTag> = boxStore.boxFor()
        return box.query {
            equal(PrinterTag_.name, tag, QueryBuilder.StringOrder.CASE_INSENSITIVE)
        }.findFirst() ?: PrinterTag()
    }

    fun savePrinterTag(tag: String): Boolean {
        return try {
            val box: Box<PrinterTag> = boxStore.boxFor()
            box.put(PrinterTag(name = tag)) > 0
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    fun savePrinterTags(tags: List<PrinterTag>) {
        val box: Box<PrinterTag> = boxStore.boxFor()
        box.put(tags)
    }

    fun clearPrinterTags() {
        val box: Box<PrinterTag> = boxStore.boxFor()
        box.removeAll()
        box.put(PrinterTag())
    }

    fun getPrinterTags(): List<PrinterTag> {
        val box: Box<PrinterTag> = boxStore.boxFor()
        return box.all ?: emptyList()
    }

    fun savePrinter(printer: SavedPrinter): Long {
        try {
            val box = boxStore.boxFor(SavedPrinter::class.java)
            return box.put(printer)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return 0
    }

    fun deletePrinter(id: Long) {
        val box: Box<SavedPrinter> = boxStore.boxFor()
        box.remove(id)
    }

    fun getPrinterByTag(tag: String): SavedPrinter? {
        val box: Box<SavedPrinter> = boxStore.boxFor()
        return box.query {
            equal(SavedPrinter_.tag, tag, QueryBuilder.StringOrder.CASE_INSENSITIVE)
        }.findFirst()
    }

    fun getPrinterByIdentifier(identifier: String): SavedPrinter? {
        val box: Box<SavedPrinter> = boxStore.boxFor()
        return box.query {
            equal(SavedPrinter_.macAddress, identifier, QueryBuilder.StringOrder.CASE_INSENSITIVE)
        }.findFirst()
    }

    val defaultPrinter: SavedPrinter?
        get() {
            val tag = PrinterTag().name
            return getPrinterByTag(tag)
        }

    val savedPrinters: List<SavedPrinter>
        get() {
            val box = boxStore.boxFor(SavedPrinter::class.java)
            return box.all ?: emptyList()
        }
}