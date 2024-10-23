package com.emenuapp_pk.logging;

import androidx.annotation.NonNull;

import timber.log.Timber;

public class ReleaseTree extends Timber.Tree {
    @Override
    protected void log(int priority, String tag, @NonNull String message, Throwable t) {

    }
}