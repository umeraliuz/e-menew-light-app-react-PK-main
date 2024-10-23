package com.emenuapp_pk.parser;

import android.graphics.Bitmap;

import com.emenew.genericprnt.EscPosPrinter;
import com.emenew.genericprnt.exceptions.EscPosParserException;
import com.emenew.genericprnt.textparser.PrinterTextParserImg;

import org.apache.commons.text.WordUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

public class PrintParser {
    private static final Map<String, String> tokenMap = new HashMap<String, String>() {
        {
            put("L", "[L]");
            put("C", "[C]");
            put("R", "[R]");
            put("U", "<u>[]</u>");
            put("UD", "<u type='double'>[]</u>");
            put("B", "<b>[]</b>");
            put("F-N", "<font size='normal'>[]</font>");
            put("F-W", "<font size='wide'>[]</font>");
            put("F-T", "<font size='tall'>[]</font>");
            put("F-B", "<font size='big'>[]</font>");
            put("F-B2", "<font size='big-2'>[]</font>");
            put("F-B3", "<font size='big-3'>[]</font>");
            put("F-B4", "<font size='big-4'>[]</font>");
            put("F-B5", "<font size='big-5'>[]</font>");
            put("F-B6", "<font size='big-6'>[]</font>");
            put("F-FB", "<font color='black'>[]</font>");
            put("F-BB", "<font color='bg-black'>[]</font>");
            put("F-N-FB", "<font size='normal color='black'>[]</font>");
            put("F-W-FB", "<font size='wide color='black'>[]</font>");
            put("F-T-FB", "<font size='tall color='black'>[]</font>");
            put("F-B-FB", "<font size='big color='black'>[]</font>");
            put("F-B2-FB", "<font size='big-2 color='black'>[]</font>");
            put("F-B3-FB", "<font size='big-3 color='black'>[]</font>");
            put("F-B4-FB", "<font size='big-4 color='black'>[]</font>");
            put("F-B5-FB", "<font size='big-5 color='black'>[]</font>");
            put("F-B6-FB", "<font size='big-6 color='black'>[]</font>");
            put("F-N-BB", "<font size='normal color='bg-black'>[]</font>");
            put("F-W-BB", "<font size='wide color='bg-black'>[]</font>");
            put("F-T-BB", "<font size='tall color='bg-black'>[]</font>");
            put("F-B-BB", "<font size='big color='bg-black'>[]</font>");
            put("F-B2-BB", "<font size='big-2 color='bg-black'>[]</font>");
            put("F-B3-BB", "<font size='big-3 color='bg-black'>[]</font>");
            put("F-B4-BB", "<font size='big-4 color='bg-black'>[]</font>");
            put("F-B5-BB", "<font size='big-5 color='bg-black'>[]</font>");
            put("F-B6-BB", "<font size='big-6 color='bg-black'>[]</font>");
        }
    };

    private final String data;
    private final Map<String, Bitmap> imagesMap;
    private final int maxLineCharacters;

    private final StringBuilder contentBuilder;
    private final EscPosPrinter printer;

    public PrintParser(EscPosPrinter printer, String data, Map<String, Bitmap> imagesMap, int maxLineCharacters) {
        this.data = data;
        this.imagesMap = imagesMap;
        this.printer = printer;
        this.contentBuilder = new StringBuilder();
        this.maxLineCharacters = maxLineCharacters;
    }

    public String parse() throws EscPosParserException {
        try {
            boolean tableOpen = false;
            boolean isImage = false;
            List<Integer> columnWidths = new ArrayList<>();

            String[] lines = data.split("\n|\r\n");
            for (String line : lines) {
                if (line.startsWith("<T>")) {
                    String l = line.substring(3);
                    String[] weights = l.split(";;");
                    columnWidths.clear();
                    columnWidths.addAll(getWeights(weights));
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
                    parseColumn(line, columnWidths);
                } else if (isImage) {
                    String img = parseImage(line);
                    if (img != null) {
                        contentBuilder.append(img).append("\n");
                    }
                    isImage = false;
                } else {
                    contentBuilder.append(line).append("\n");
                }
            }
            return contentBuilder.toString();
        } catch (Exception e) {
            throw new EscPosParserException("There is an error in print command syntax.");
        }
    }

    private void parseColumn(String line, List<Integer> widths) throws EscPosParserException {
        try {
            String[] cols = line.split(";;");
            parseTable(cols, widths);
        } catch (Exception e) {
            throw new EscPosParserException("There is an error in print command syntax.");
        }
    }

    private List<Integer> getWeights(String[] list) throws EscPosParserException {
        try {
            List<Integer> weights = new ArrayList<>();
            int weightSum = 0;
            int widthSum = 0;
            for (String weight : list) {
                int w = Integer.parseInt(weight);
                weightSum += w;
                weights.add(w);
            }

            List<Integer> columnWidths = new ArrayList<>();
            for (int weight : weights) {
                int width = Math.round(maxLineCharacters / weightSum) * weight;
                widthSum += width;
                columnWidths.add(width);
            }
            if (widthSum < maxLineCharacters) {
                int lastWidth = columnWidths.get(columnWidths.size() - 1);
                lastWidth += maxLineCharacters - widthSum;
                columnWidths.remove(columnWidths.size() - 1);
                columnWidths.add(lastWidth);
            }
            return columnWidths;
        } catch (Exception e) {
            throw new EscPosParserException("Invalid table column syntax.");
        }
    }

    private void parseTable(String[] cols, List<Integer> widths) throws EscPosParserException {
        try {
            int max = 0;
            List<List<String>> table = new ArrayList<>();
            List<String> alignments = new ArrayList<>();
            List<String> placeHolders = new ArrayList<>();

            for (int i = 0; i < cols.length; i++) {
                Queue<String> tags = parseTags(cols[i]);
                String content = tags.remove();
                alignments.add(tags.remove());
                placeHolders.add(getPlaceHolder(tags));
                String value = WordUtils.wrap(content, widths.get(i));
                String[] nl = value.split("\n|\r\n");
                List<String> newLines = new ArrayList<>();
                Collections.addAll(newLines, nl);
                table.add(newLines);
                if (newLines.size() > max) {
                    max = newLines.size();
                }
            }

            for (int i = 0; i < table.size(); i++) {
                int size = table.get(i).size();
                if (size < max) {
                    for (int j = 0; j < max - size; j++) {
                        table.get(i).add("");
                    }
                }
            }

            String lastAlignment = "";

            for (int i = 0; i < max; i++) {
                for (int j = 0; j < table.size(); j++) {
                    String alignment = alignments.get(j);
                    if (!lastAlignment.equals(alignment)) {
                        lastAlignment = alignment;
                        // contentBuilder.append(lastAlignment);
                    }

                    String placeHolder = placeHolders.get(j);
                    String value = table.get(j).get(i);
                    String padding = padString(value, lastAlignment, widths.get(j));
                    String content = placeHolder.replace("[]", value);
                    switch (lastAlignment) {
                        case "[L]":
                            contentBuilder.append(content);
                            contentBuilder.append(padding);
                            break;
                        case "[C]":
                            contentBuilder.append(padding);
                            contentBuilder.append(content);
                            contentBuilder.append(padding);
                            break;
                        case "[R]":
                            contentBuilder.append(padding);
                            contentBuilder.append(content);
                    }
                }
                contentBuilder.append("\n");
            }
        } catch (Exception e) {
            throw new EscPosParserException("There is an error in print command syntax.");
        }
    }

    private String padString(String value, String alignment, int width) throws EscPosParserException {
        try {
            StringBuilder builder = new StringBuilder();
            int maxWidth = width - value.length();
            if (value.length() < width) {
                if (alignment.equals("[C]")) {
                    maxWidth /= 2;
                }
                for (int p = 0; p < maxWidth; p++) {
                    builder.append(" ");
                }
            }
            return builder.toString();
        } catch (Exception e) {
            throw new EscPosParserException("There is an error in print command syntax.");
        }
    }

    // [C]<img>LOGO|96|96</img>
    private String parseImage(String line) throws EscPosParserException {
        try {
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

            if (imagesMap.containsKey(tag)) {
                String parsedImage;
                if (width != 0 && height != 0) {
                    parsedImage = PrinterTextParserImg.bitmapToHexadecimalString(printer, imagesMap.get(tag), width,
                            height);
                } else {
                    parsedImage = PrinterTextParserImg.bitmapToHexadecimalString(printer, imagesMap.get(tag));
                }
                return line.replace(content, parsedImage);
            }
            return null;
        } catch (Exception e) {
            throw new EscPosParserException("There is an error in print command syntax.");
        }
    }

    private Queue<String> parseTags(String content) {
        Queue<String> list = new LinkedList<>();
        int start = content.indexOf("[");
        int end = content.indexOf("]");
        if (start != end) {
            String[] tags = content.substring(start + 1, end).split("\\|");
            String value = content.substring(end + 1);

            list.add(value);
            for (String tag : tags) {
                list.add(getTag(tag));
            }
        }
        return list;
    }

    private String getTag(String token) {
        return tokenMap.get(token);
    }

    private String getPlaceHolder(Queue<String> tags) {
        if (tags.isEmpty()) {
            return "[]";
        }
        String placeHolder = tags.remove();
        while (!tags.isEmpty()) {
            String tag = tags.remove();
            placeHolder = tag.replace("[]", placeHolder);
        }
        return placeHolder;
    }
}
