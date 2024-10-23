package com.emenew.genericprnt.textparser;

import com.emenew.genericprnt.exceptions.EscPosBarcodeException;
import com.emenew.genericprnt.exceptions.EscPosParserException;
import com.emenew.genericprnt.EscPosPrinter;
import com.emenew.genericprnt.EscPosPrinterCommands;

import java.util.Hashtable;

public class PrinterTextParserQRCode extends PrinterTextParserImg {

    private static byte[] initConstructor(PrinterTextParserColumn printerTextParserColumn,
                                          Hashtable<String, String> qrCodeAttributes, String data) throws EscPosParserException, EscPosBarcodeException {
        EscPosPrinter printer = printerTextParserColumn.getLine().getTextParser().getPrinter();
        data = data.trim();

        int size = printer.mmToPx(20f);

        if (qrCodeAttributes.containsKey(PrinterTextParser.ATTR_QRCODE_SIZE)) {
            String qrCodeAttribute = qrCodeAttributes.get(PrinterTextParser.ATTR_QRCODE_SIZE);
            if (qrCodeAttribute == null) {
                throw new EscPosParserException("Invalid QR code attribute : " + PrinterTextParser.ATTR_QRCODE_SIZE);
            }
            try {
                size = printer.mmToPx(Float.parseFloat(qrCodeAttribute));
            } catch (NumberFormatException nfe) {
                throw new EscPosParserException("Invalid QR code " + PrinterTextParser.ATTR_QRCODE_SIZE + " value");
            }
        }

        return EscPosPrinterCommands.QRCodeDataToBytes(data, size);
    }

    public PrinterTextParserQRCode(PrinterTextParserColumn printerTextParserColumn, String textAlign,
                                   Hashtable<String, String> qrCodeAttributes, String data) throws EscPosParserException, EscPosBarcodeException {
        super(
                printerTextParserColumn,
                textAlign,
                PrinterTextParserQRCode.initConstructor(printerTextParserColumn, qrCodeAttributes, data)
        );
    }
}
