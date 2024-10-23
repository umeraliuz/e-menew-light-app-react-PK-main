package io.ezeelabs.starprnt.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CustomBitmapReceipt extends LinearLayout {

    private String data;
    private int paperSize;

    private LinearLayout linearLayout;
    private Map<String, Bitmap> imagesMap;

    private static final Map<String, Float> sizeMap = new HashMap<String, Float>() {{
        put("normal", 7.0f);
        put("wide", 7.0f);
        put("tall", 7.0f);
        put("big", 11.0f);
        put("big-2", 15.0f);
        put("big-3", 18.0f);
        put("big-4", 21.0f);
        put("big-5", 24.0f);
        put("big-6", 32.0f);
    }};

    private static final Map<String, Integer> colorMap = new HashMap<String, Integer>() {{
        put("black", Color.BLACK);
        put("bg-black", Color.RED);
    }};

    public CustomBitmapReceipt(@NonNull Context context) {
        this(context, null);
    }

    public CustomBitmapReceipt(@NonNull Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public CustomBitmapReceipt(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    public void init() {
        setOrientation(VERTICAL);
    }

    public void setData(String data, int paperSize, Map<String, Bitmap> imagesMap) {
        this.data = data;
        this.imagesMap = imagesMap;
        this.paperSize = paperSize;

        if (getLayoutParams() != null) {
            getLayoutParams().width = this.paperSize;
            getLayoutParams().height = LayoutParams.WRAP_CONTENT;
        }

        parseData();
    }

    public void parseData() {
        boolean tableOpen = false;
        boolean isImage = false;
        List<Integer> columnWidths = new ArrayList<>();
        int weightSum = 0;

        String[] lines = data.split("\n|\r\n");

        for (String line : lines) {
            if (line.startsWith("<T>")) {
                String l = line.substring(3);
                String[] weights = l.split(";;");
                columnWidths.clear();
                weightSum = 0;
                for (String weight : weights) {
                    int layoutWeight = Integer.parseInt(weight);
                    weightSum += layoutWeight;
                    columnWidths.add(layoutWeight);
                }
                tableOpen = true;
                continue;
            }

            if (line.startsWith("</T>")) {
                tableOpen = false;
                continue;
            }

            if (line.contains("<img>")) {
                isImage = true;
            }

            if (tableOpen) {
                parseColumn(line, columnWidths, weightSum);
            } else if (isImage) {
                parseImage(line);
//                if (img != null) {
//                    contentBuilder.append(img).append("\n");
//                }
                isImage = false;
            } else {
                //contentBuilder.append(line).append("\n");
                parseSingleLine(line);
            }
        }

    }

    private void parseColumn(String line, List<Integer> columnWidths, int weightSum) {

        String[] cols = line.split(";;");

        LinearLayout tbLinearLayout = new LinearLayout(getContext());
        tbLinearLayout.setOrientation(LinearLayout.HORIZONTAL);
        //tbLinearLayout.measure(width, ViewGroup.LayoutParams.WRAP_CONTENT);
        tbLinearLayout.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        tbLinearLayout.setWeightSum(weightSum);

        for (int i = 0; i < cols.length; i++) {
            //Queue<String> tags = parseTags(cols[i]);
            String tableData = cols[i];
            int layoutWeight = columnWidths.get(i);

            String text = tableData.contains("+") ? " " + tableData.substring(4) : tableData.substring(3);
            if (tableData.startsWith("[L]")) {
                if (text.contains("<b>")) {
                    String str2 = text.substring(3, text.length() - 4);
                    tbLinearLayout.addView(getTextViewWithLW(str2, Typeface.BOLD, View.TEXT_ALIGNMENT_TEXT_START, layoutWeight));
                } else {
                    tbLinearLayout.addView(getTextViewWithLW(text, Typeface.NORMAL, View.TEXT_ALIGNMENT_TEXT_START, layoutWeight));
                }
            }

            if (tableData.startsWith("[R]")) {
                if (text.contains("<b>")) {
                    String str2 = text.substring(3, text.length() - 4);
                    tbLinearLayout.addView(getTextViewWithLW(str2, Typeface.BOLD, View.TEXT_ALIGNMENT_TEXT_END, layoutWeight));
                } else {
                    tbLinearLayout.addView(getTextViewWithLW(text, Typeface.NORMAL, View.TEXT_ALIGNMENT_TEXT_END, layoutWeight));
                }
            }

            if (tableData.startsWith("[C]")) {
                if (text.contains("<b>")) {
                    String str2 = text.substring(3, text.length() - 4);
                    tbLinearLayout.addView(getTextViewWithLW(str2, Typeface.BOLD, View.TEXT_ALIGNMENT_CENTER, layoutWeight));
                } else {
                    tbLinearLayout.addView(getTextViewWithLW(text, Typeface.NORMAL, View.TEXT_ALIGNMENT_CENTER, layoutWeight));
                }
            }
        }

        addView(tbLinearLayout);
    }


    private void parseImage(String line) {
        String position = line.substring(0, 3);
        Log.d("TAG", "parseImage: position " + position);
        int openTagIndex = line.indexOf("<");
        int openTagCloseIndex = line.indexOf(">", openTagIndex + 1) + 1;
        int endTagIndex = line.indexOf("<", openTagCloseIndex + 1);
        String content = line.substring(openTagCloseIndex, endTagIndex);
        String[] contents = content.split("\\|");
        String tag = contents[0];
        int width;
        int height;

        switch (contents.length) {
            case 2:
                width = height = Integer.parseInt(contents[1]);
                break;
            case 3:
                width = Integer.parseInt(contents[1]);
                height = Integer.parseInt(contents[2]);
                break;
            default:
                width = height = 0;
                break;
        }


        int gravity = -1;
        switch (position) {
            case "[L]":
                gravity = Gravity.START;
                break;
            case "[R]":
                gravity = Gravity.END;
                break;
            case "[C]":
                gravity = Gravity.CENTER;
                break;
        }

        if (imagesMap.containsKey(tag)) {
            Bitmap bitmapImg = imagesMap.get(tag);
            ImageView imageView = new ImageView(getContext());
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(width, height);
            params.gravity = gravity;
            imageView.setLayoutParams(params);
            imageView.setBackgroundColor(Color.WHITE);
            imageView.setImageBitmap(bitmapImg);
            addView(imageView);
        } else {
            ImageView imageView = new ImageView(getContext());
            LayoutParams params = new LinearLayout.LayoutParams(width, height);
            params.gravity = gravity;
            imageView.setLayoutParams(params);
            imageView.setBackgroundColor(Color.BLACK);
            addView(imageView);
        }
    }

    //[C]<font size='big'>Twins</font>
    //[L]<b>Qt</b>[L]<b>Produits</b>[R]<b>CHF</b>
    //[L]--------------------------------
    //[C]<font size='tall' color='black'>Merci pour votre visite.</font>
    //[L]Boulevard Carl-Vogt 101
    private void parseSingleLine(String line) {
        if (line.length() > 0) {
            int startPoint = checkStarrWith(line);

            String str1 = line.substring(3);

            if (str1.contains("[L]") || str1.contains("[C]") || str1.contains("[R]")) {

                LinearLayout tbLinearLayout = new LinearLayout(getContext());
                tbLinearLayout.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

                String[] split = str1.split("\\[");
                tbLinearLayout.setWeightSum(split.length);
                for (int i = 0; i < split.length; i++) {
                    Log.d("TAG", "parseSingleLine: line " + split[i]);
                    if (i == 0) {
                        String sentence = split[i];
                        if (sentence.contains("<b>")) {
                            String str2 = sentence.substring(3, sentence.length() - 4);
                            tbLinearLayout.addView(getDisplayTextView(startPoint, str2, Typeface.BOLD));
                        } else {
                            tbLinearLayout.addView(getDisplayTextView(startPoint, sentence, Typeface.NORMAL));
                        }
                    } else {
                        String sentence = "[" + split[i];
                        int startPoint2 = checkStarrWith(sentence);
                        String str3 = sentence.substring(3);
                        if (str3.contains("<b>")) {
                            String str2 = str3.substring(3, str3.length() - 4);
                            tbLinearLayout.addView(getDisplayTextView(startPoint2, str2, Typeface.BOLD));
                        } else {
                            tbLinearLayout.addView(getDisplayTextView(startPoint2, str3, Typeface.NORMAL));
                        }
                    }

                    if (i == split.length - 1) {
                        addView(tbLinearLayout);
                    }

                }

            } else {
                parseFont(str1, startPoint);
            }

        } else {
            //empty line or \n
        }

    }

    public void parseFont(String str1, int startPoint) {

        if (str1.contains("<font")) {
            if (str1.contains("size") && str1.contains("color")) {
                int sizeStartPoint = str1.indexOf("'");
                int sizeEndPoint = str1.indexOf("'", sizeStartPoint + 1);
                String size = str1.substring(sizeStartPoint + 1, sizeEndPoint);

                int colorStartPoint = str1.indexOf("'", sizeEndPoint + 1);
                int colorEndPoint = str1.indexOf("'", colorStartPoint + 1);
                String color = str1.substring(colorStartPoint + 1, colorEndPoint);

                String subText = getSubText(str1);

                if (subText.contains("<b>")) {
                    String str2 = subText.substring(3, subText.length() - 4);
                    displayTextView(startPoint, str2, Typeface.BOLD, LayoutParams.MATCH_PARENT, getSize(size), getColor(color));
                } else {
                    displayTextView(startPoint, subText, Typeface.NORMAL, LayoutParams.MATCH_PARENT, getSize(size), getColor(color));
                }

            } else if (str1.contains("size") && !str1.contains("color")) {
                int sizeStartPoint = str1.indexOf("'");
                int sizeEndPoint = str1.indexOf("'", sizeStartPoint + 1);
                String size = str1.substring(sizeStartPoint + 1, sizeEndPoint);

                String subText = getSubText(str1);

                if (subText.contains("<b>")) {
                    String str2 = subText.substring(3, subText.length() - 4);
                    displayTextView(startPoint, str2, Typeface.BOLD, LayoutParams.MATCH_PARENT, getSize(size), getColor("black"));
                } else {
                    displayTextView(startPoint, subText, Typeface.NORMAL, LayoutParams.MATCH_PARENT, getSize(size), getColor("black"));
                }

            } else if (!str1.contains("size") && str1.contains("color")) {
                int colorStartPoint = str1.indexOf("'");
                int colorEndPoint = str1.indexOf("'", colorStartPoint + 1);
                String color = str1.substring(colorStartPoint + 1, colorEndPoint);

                String subText = getSubText(str1);

                if (subText.contains("<b>")) {
                    String str2 = subText.substring(3, subText.length() - 4);
                    displayTextView(startPoint, str2, Typeface.BOLD, LayoutParams.MATCH_PARENT, getSize("normal"), getColor(color));
                } else {
                    displayTextView(startPoint, subText, Typeface.NORMAL, LayoutParams.MATCH_PARENT, getSize("normal"), getColor(color));
                }

            }
        } else {
            if (str1.contains("<b>")) {
                String str2 = str1.substring(3, str1.length() - 4);
                displayTextView(startPoint, str2, Typeface.BOLD, LayoutParams.MATCH_PARENT, getSize("normal"), getColor("black"));
            } else {
                displayTextView(startPoint, str1, Typeface.NORMAL, LayoutParams.MATCH_PARENT, getSize("normal"), getColor("black"));
            }
        }


    }

    public int checkStarrWith(String line) {
        String first = line.substring(0, 3);

        switch (first) {
            case "[L]":
                return 1;
            case "[C]":
                return 2;
            case "[R]":
                return 3;
            default:
                return 0;
        }
    }

    private float getSize(String token) {
        return sizeMap.get(token);
    }

    private int getColor(String token) {
        return colorMap.get(token);
    }

    public String getSubText(String text) {
        int startPoint = text.indexOf(">");
        int endPoint = text.indexOf("</font>", startPoint + 1);
        return text.substring(startPoint + 1, endPoint);
    }

    public void displayTextView(int startPos, String text, int typeface, int widthWrap, float fontsize, int color) {
        switch (startPos) {
            case 1:
                addView(getTextView(text, typeface, View.TEXT_ALIGNMENT_TEXT_START, widthWrap, fontsize, color, Gravity.START));
                break;
            case 2:
                addView(getTextView(text, typeface, View.TEXT_ALIGNMENT_CENTER, widthWrap, fontsize, color, Gravity.CENTER));
                break;
            case 3:
                addView(getTextView(text, typeface, View.TEXT_ALIGNMENT_TEXT_END, widthWrap, fontsize, color, Gravity.END));
                break;
        }
    }

    public TextView getDisplayTextView(int startPos, String text, int typeface) {
        switch (startPos) {
            case 1:
                return getTextViewWithLW(text, typeface, View.TEXT_ALIGNMENT_TEXT_START, 1);
            case 2:
                return getTextViewWithLW(text, typeface, View.TEXT_ALIGNMENT_CENTER, 1);
            case 3:
                return getTextViewWithLW(text, typeface, View.TEXT_ALIGNMENT_TEXT_END, 1);
            default:
                return null;
        }
    }


    public TextView getTextView(String text, int typeface, int alignment, int widthWrap, float fontsize, int color, int gravity) {
        TextView tv = new TextView(getContext());
        tv.setText(text);
        tv.setTextColor(color);
        tv.setTextSize(fontsize);
        tv.setTypeface(null, typeface);
        tv.setTextAlignment(alignment);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(widthWrap, LinearLayout.LayoutParams.WRAP_CONTENT);
        params.gravity = gravity;
        tv.setLayoutParams(params);
        return tv;
    }

    public TextView getTextViewWithLW(String text, int typeface, int alignment, int layout_weight) {
        TextView tv = new TextView(getContext());
        tv.setText(text);
        tv.setTextColor(Color.BLACK);
        tv.setTextSize(7.0f);
        tv.setTypeface(Typeface.MONOSPACE, typeface);
        tv.setTextAlignment(alignment);
        tv.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, (float) layout_weight));
        return tv;
    }
}
