package com.emenuapp_pk.data

import com.emenuapp_pk.data.local.model.UiText

class Resource<T> private constructor(
    val status: Status,
    val body: T?,
    val message: UiText
) {

    val isSuccess: Boolean
        get() = status == Status.SUCCESS && body != null
    val isLoading: Boolean
        get() = status == Status.LOADING
    val isError: Boolean
        get() = status == Status.ERROR

    companion object {
        fun <T> success(data: T, message: UiText = UiText.empty()): Resource<T> {
            return Resource(Status.SUCCESS, data, message)
        }

        fun <T> error(message: UiText, data: T? = null): Resource<T> {
            return Resource(Status.ERROR, data, message)
        }

        fun <T> loading(message: UiText, data: T? = null): Resource<T> {
            return Resource(Status.LOADING, data, message)
        }
    }
}