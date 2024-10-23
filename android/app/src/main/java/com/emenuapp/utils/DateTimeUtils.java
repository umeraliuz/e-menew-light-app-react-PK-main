package com.emenuapp_pk.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.Objects;

public class DateTimeUtils {
    public static String getFormattedDate(String date, String inputFormat, String outputFormat) {
        SimpleDateFormat input = new SimpleDateFormat(inputFormat, Locale.US);
        SimpleDateFormat output = new SimpleDateFormat(outputFormat, Locale.US);
        try {
            return output.format(Objects.requireNonNull(input.parse(date)));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    public static String getCurrentDateTime(String date) {
        SimpleDateFormat input = new SimpleDateFormat("yyyyMMdd", Locale.US);
        SimpleDateFormat output = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss", Locale.US);
        try {
            Calendar currentDate = Calendar.getInstance();
            Calendar parsedDate = Calendar.getInstance();

            Date pDate = input.parse(date);
            if (pDate != null) {
                parsedDate.setTime(pDate);
                currentDate.set(Calendar.MONTH, parsedDate.get(Calendar.MONTH));
                currentDate.set(Calendar.DAY_OF_MONTH, parsedDate.get(Calendar.DAY_OF_MONTH));
                currentDate.set(Calendar.YEAR, parsedDate.get(Calendar.YEAR));
            }
            return output.format(currentDate.getTime());
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }
}
