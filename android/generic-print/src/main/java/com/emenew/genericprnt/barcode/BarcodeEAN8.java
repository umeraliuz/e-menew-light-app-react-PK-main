package com.emenew.genericprnt.barcode;

import com.emenew.genericprnt.exceptions.EscPosBarcodeException;
import com.emenew.genericprnt.EscPosPrinterCommands;
import com.emenew.genericprnt.EscPosPrinterSize;

public class BarcodeEAN8 extends BarcodeNumber {
    public BarcodeEAN8(EscPosPrinterSize printerSize, String code, float widthMM, float heightMM, int textPosition) throws EscPosBarcodeException {
        super(printerSize, EscPosPrinterCommands.BARCODE_TYPE_EAN8, code, widthMM, heightMM, textPosition);
    }

    @Override
    public int getCodeLength() {
        return 8;
    }
}
