package com.emenew.genericprnt.barcode;

import com.emenew.genericprnt.exceptions.EscPosBarcodeException;
import com.emenew.genericprnt.EscPosPrinterCommands;
import com.emenew.genericprnt.EscPosPrinterSize;

public class BarcodeEAN13 extends BarcodeNumber {

    public BarcodeEAN13(EscPosPrinterSize printerSize, String code, float widthMM, float heightMM, int textPosition) throws EscPosBarcodeException {
        super(printerSize, EscPosPrinterCommands.BARCODE_TYPE_EAN13, code, widthMM, heightMM, textPosition);
    }

    @Override
    public int getCodeLength() {
        return 13;
    }
}
