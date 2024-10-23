
package com.emenuapp_pk; // replace your-apps-package-name with your app’s package name

import android.app.ActivityManager;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import androidx.annotation.NonNull;

import com.emenuapp_pk.data.local.db.DbHelper;
import com.emenuapp_pk.data.local.model.PrinterTag;
import com.emenuapp_pk.data.local.prefs.PreferencesHelper;
import com.emenuapp_pk.ui.main.MainActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;
import com.jakewharton.processphoenix.ProcessPhoenix;

import android.util.Log;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import timber.log.Timber;

public class PrinterModule extends ReactContextBaseJavaModule {
    // list = DbHelper.instance.savedPrinters;

    ReactApplicationContext context = getReactApplicationContext();

    PrinterModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "PrinterModule";
    }

    @ReactMethod
    public void PrintingService(String url) {

        try {

            Intent myIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            myIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(myIntent);
        } catch (Exception e) {
            System.out.println("Oops! No Printer Device Connected" + e);
            CharSequence text = context.getString(R.string.no_printer_device_connected);
            int duration = Toast.LENGTH_SHORT;

            Toast toast = Toast.makeText(context, text, duration);

            toast.show();
        }

    }

    public static ArrayList<PrinterTag> jsonArrayToArrayList(String jsonString) throws JSONException {
        JSONArray jsonArray = new JSONArray(jsonString);
        ArrayList<PrinterTag> arrayList = new ArrayList<>();

        for (int i = 0; i < jsonArray.length(); i++) {
            PrinterTag item = new Gson().fromJson(jsonArray.getString(i), PrinterTag.class);
            System.out.println("arrayList...." + item);
            arrayList.add(item);
        }

        return arrayList;
    }

    @ReactMethod
    public void PrintingDevice(String arrayList) throws JSONException {

        List<PrinterTag> tags = new ArrayList<>(jsonArrayToArrayList(arrayList));
        System.out.println("arrayList...." + tags);
        // tags.add(new PrinterTag(1, "Kitchen"));
        // tags.add(new PrinterTag(2, "Bar"));
        // tags=arrayList.asList();

        DbHelper.instance.clearPrinterTags();
        DbHelper.instance.savePrinterTags(tags);

        try {
            Intent myIntent = new Intent(context, MainActivity.class);
            myIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(myIntent);
        } catch (Exception e) {
            System.out.println("Oops! No Printer Device Connected" + e);

        }

    }

    @ReactMethod

    public void setLocale(String language) {
        Locale newLocale = new Locale(language);
        Locale.setDefault(newLocale);
        Configuration config = context.getResources().getConfiguration();
        config.locale = newLocale;
        context.getResources().updateConfiguration(config, context.getResources().getDisplayMetrics());

        Intent mStartActivity = new Intent(context, com.emenuapp_pk.MainActivity.class);
        ProcessPhoenix.triggerRebirth(context, mStartActivity);
    }

    public static void setLocaler(Context context, String language) {
        Locale newLocale = new Locale(language);
        Locale.setDefault(newLocale);
        Configuration config = context.getResources().getConfiguration();
        config.locale = newLocale;
        context.getResources().updateConfiguration(config, context.getResources().getDisplayMetrics());
    }

}