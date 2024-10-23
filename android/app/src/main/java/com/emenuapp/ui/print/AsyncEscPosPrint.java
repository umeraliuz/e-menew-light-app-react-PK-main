package com.emenuapp_pk.ui.print;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.emenew.genericprnt.EscPosCharsetEncoding;
import com.emenew.genericprnt.EscPosPrinter;
import com.emenew.genericprnt.connection.DeviceConnection;
import com.emenew.genericprnt.exceptions.EscPosBarcodeException;
import com.emenew.genericprnt.exceptions.EscPosConnectionException;
import com.emenew.genericprnt.exceptions.EscPosEncodingException;
import com.emenew.genericprnt.exceptions.EscPosParserException;
import com.emenuapp_pk.utils.AppConstants;

import java.lang.ref.WeakReference;

public abstract class AsyncEscPosPrint extends AsyncTask<AsyncEscPosPrinter, Integer, Integer> {
    protected final static int FINISH_SUCCESS = 1;
    protected final static int FINISH_NO_PRINTER = 2;
    protected final static int FINISH_PRINTER_DISCONNECTED = 3;
    protected final static int FINISH_PARSER_ERROR = 4;
    protected final static int FINISH_ENCODING_ERROR = 5;
    protected final static int FINISH_BARCODE_ERROR = 6;

    protected final static int PROGRESS_CONNECTING = 1;
    protected final static int PROGRESS_CONNECTED = 2;
    protected final static int PROGRESS_PRINTING = 3;
    protected final static int PROGRESS_PRINTED = 4;

    protected LocalBroadcastManager localBroadcastManager;
    protected WeakReference<Context> weakContext;

    public AsyncEscPosPrint(Context context) {
        this.weakContext = new WeakReference<>(context);
    }

    protected Integer doInBackground(AsyncEscPosPrinter... printersData) {
        if (printersData.length == 0) {
            return AsyncEscPosPrint.FINISH_NO_PRINTER;
        }

        this.publishProgress(AsyncEscPosPrint.PROGRESS_CONNECTING);

        AsyncEscPosPrinter printerData = printersData[0];

        try {
            DeviceConnection deviceConnection = printerData.getPrinterConnection();

            if (deviceConnection == null) {
                return AsyncEscPosPrint.FINISH_NO_PRINTER;
            }

            EscPosPrinter printer = new EscPosPrinter(
                    deviceConnection,
                    printerData.getPrinterDpi(),
                    printerData.getPrinterWidthMM(),
                    printerData.getPrinterNbrCharactersPerLine(),
                    new EscPosCharsetEncoding("windows-1252", 16));

            this.publishProgress(AsyncEscPosPrint.PROGRESS_PRINTING);

            printer.printFormattedTextAndCut(printerData.getTextToPrint());

            this.publishProgress(AsyncEscPosPrint.PROGRESS_PRINTED);

        } catch (EscPosConnectionException e) {
            e.printStackTrace();
            return AsyncEscPosPrint.FINISH_PRINTER_DISCONNECTED;
        } catch (EscPosParserException e) {
            e.printStackTrace();
            return AsyncEscPosPrint.FINISH_PARSER_ERROR;
        } catch (EscPosEncodingException e) {
            e.printStackTrace();
            return AsyncEscPosPrint.FINISH_ENCODING_ERROR;
        } catch (EscPosBarcodeException e) {
            e.printStackTrace();
            return AsyncEscPosPrint.FINISH_BARCODE_ERROR;
        }

        return AsyncEscPosPrint.FINISH_SUCCESS;
    }

    protected void onPreExecute() {
        if (this.localBroadcastManager == null) {
            Context context = weakContext.get();

            if (context == null) {
                return;
            }

            this.localBroadcastManager = LocalBroadcastManager.getInstance(context);
            this.localBroadcastManager.sendBroadcast(getProgressIntent(0, "Printing in Progress..."));
        }
    }

    protected void onProgressUpdate(Integer... progress) {
        String message = "Printing in progress...";
        switch (progress[0]) {
            case AsyncEscPosPrint.PROGRESS_CONNECTING:
                message = "Connecting printer...";
                break;
            case AsyncEscPosPrint.PROGRESS_CONNECTED:
                message = "Printer is connected...";
                break;
            case AsyncEscPosPrint.PROGRESS_PRINTING:
                message = "Printer is printing...";
                break;
            case AsyncEscPosPrint.PROGRESS_PRINTED:
                message = "Printer has finished printing";
                break;
        }
        this.localBroadcastManager.sendBroadcast(getProgressIntent(progress[0], message));
    }

    protected void onPostExecute(Integer result) {
        Context context = weakContext.get();

        if (context == null) {
            return;
        }

        String message = "";
        switch (result) {
            case AsyncEscPosPrint.FINISH_SUCCESS:
                message = "Congratulation ! The text is printed!";
                break;
            case AsyncEscPosPrint.FINISH_NO_PRINTER:
                message = "The application can't find any printer connected.";
                break;
            case AsyncEscPosPrint.FINISH_PRINTER_DISCONNECTED:
                message = "Unable to connect the printer.";
                break;
            case AsyncEscPosPrint.FINISH_PARSER_ERROR:
                message = "It seems to be an invalid syntax problem.";
                break;
            case AsyncEscPosPrint.FINISH_ENCODING_ERROR:
                message = "The selected encoding character returning an error.";
                break;
            case AsyncEscPosPrint.FINISH_BARCODE_ERROR:
                message = "Data send to be converted to barcode or QR code seems to be invalid.";
                break;
        }

        this.localBroadcastManager.sendBroadcast(getStatusIntent(result, message));
    }

    private Intent getProgressIntent(int status, String message) {
        Intent intent = new Intent(AppConstants.ACTION_PRINT_PROGRESS);
        intent.putExtra("status", status);
        intent.putExtra("message", message);
        return intent;
    }

    private Intent getStatusIntent(int status, String message) {
        Intent intent = new Intent(AppConstants.ACTION_PRINT_STATUS);
        intent.putExtra("status", status);
        intent.putExtra("message", message);
        return intent;
    }
}
