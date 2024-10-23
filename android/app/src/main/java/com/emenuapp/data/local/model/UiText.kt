package com.emenuapp_pk.data.local.model

import android.content.Context
import androidx.annotation.StringRes

sealed class UiText {
    data class DynamicString(val value: String) : UiText()

    class StringResource(
        @StringRes val resId: Int,
        vararg val args: Any
    ) : UiText()

    fun asString(ctx: Context): String {
        return when (this) {
            is DynamicString -> value
            is StringResource -> ctx.getString(resId, args)
        }
    }

    companion object {
        fun empty() = DynamicString("")
    }
}