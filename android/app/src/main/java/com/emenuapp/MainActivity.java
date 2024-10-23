package com.emenuapp_pk;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen; // here
import org.json.JSONException;

import com.reactnativecommunity.asyncstorage.AsyncLocalStorageUtil;
import com.reactnativecommunity.asyncstorage.ReactDatabaseSupplier;

import java.util.Locale;

public class MainActivity extends ReactActivity {

  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, true);
    super.onCreate(savedInstanceState);
    String value = "en";
    SQLiteDatabase readableDatabase = ReactDatabaseSupplier.getInstance(this).getReadableDatabase();
    try {
      value = AsyncLocalStorageUtil.getItemImpl(readableDatabase, "USER_LANG");
      System.out.println("Oops! No Printer Device Connected" + value);
    } catch (NullPointerException ignored) {
    }

    readableDatabase.close();
    value = value == null ? "en" : value;

    PrinterModule.setLocaler(this, value);

  }

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "emenuapp";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util
   * class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and
   * Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e.
        // React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
    );
  }
}
