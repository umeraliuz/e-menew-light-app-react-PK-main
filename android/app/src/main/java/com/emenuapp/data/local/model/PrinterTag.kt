package com.emenuapp_pk.data.local.model

import com.google.gson.annotations.SerializedName
import io.objectbox.annotation.Entity
import io.objectbox.annotation.Id
import io.objectbox.annotation.Unique


@Entity
data class PrinterTag(
    @Id(assignable = true)
    var id: Long = 0,
    @Unique
    @SerializedName("tag_name")
    var name: String = "default"
)