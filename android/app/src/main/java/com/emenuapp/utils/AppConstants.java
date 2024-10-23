package com.emenuapp_pk.utils;

public final class AppConstants {
    // Request Codes
    public static final int REQUEST_CODE_SETTINGS = 1000;

    // Notification ID
    public static final int PRINT_NOTIFICATION_ID = 1001;

    // Permissions
    public static final String ACTION_USB_PERMISSION = "com.emenuapp_pk.USB_PERMISSION";
    public static final String ACTION_PRINT_PROGRESS = "com.com.emenuapp_pk.PRINT_PROGRESS";
    public static final String ACTION_PRINT_STATUS = "com.com.emenuapp_pk.PRINT_STATUS";
    public static final String ACTION_KEY_MESSAGE = "print_status_message";

    // Urls
    public static final String URL_VENDOR_DASHBOARD = "vendor_dashboard";

    public static String getUrl(String part) {
        return "https://tryngo-services.com/restaurant/" + part;
    }
}
