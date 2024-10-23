package com.emenuapp_pk.data.local.model

import android.os.Parcelable
import com.emenuapp_pk.R
import kotlinx.parcelize.Parcelize

@Parcelize
sealed class PrinterType(
    val id: Int,
    val name: String,
    val res: Int
) : Parcelable {
    class BluetoothPrinter : PrinterType(
        0,
        "Bluetooth",
        R.string.label_bluetooth_printer
    )

    class NetworkPrinter : PrinterType(
        1,
        "Network",
        R.string.label_network_printer
    )

    class UsbPrinter : PrinterType(
        2,
        "USB",
        R.string.label_usb_printer
    )

    class InternalPrinter : PrinterType(
        3,
        "Internal Printer",
        R.string.label_internal_printer
    )

    companion object {
        fun getById(id: Int): PrinterType {
            return when (id) {
                0 -> return BluetoothPrinter()
                1 -> return NetworkPrinter()
                3 -> return InternalPrinter()
                else -> UsbPrinter()
            }
        }
    }
}