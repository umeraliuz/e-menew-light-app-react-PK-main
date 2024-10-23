package com.emenuapp_pk.data.local.model

import android.os.Parcelable
import com.emenuapp_pk.R
import kotlinx.parcelize.Parcelize

@Parcelize
sealed class Manufacturer(
    val id: Int,
    val name: String,
    val res: Int
) : Parcelable {
    class Generic() : Manufacturer(0, "Generic", R.string.label_generic)

    class Sunmi() : Manufacturer(1, "Sunmi", R.string.label_sunmi)

    class Star() : Manufacturer(2, "Star", R.string.label_star)

    companion object {
        fun getById(id: Int): Manufacturer {
            return when (id) {
                1 -> Sunmi()
                2 -> Star()
                else -> Generic()
            }
        }
    }
}