package com.emenew.genericprnt.barcode;

import com.emenew.genericprnt.exceptions.EscPosBarcodeException;
import com.emenew.genericprnt.EscPosPrinterCommands;
import com.emenew.genericprnt.EscPosPrinterSize;

public class BarcodeUPCA extends BarcodeNumber {

    public BarcodeUPCA(EscPosPrinterSize printerSize, String code, float widthMM, float heightMM, int textPosition) throws EscPosBarcodeException {
        super(printerSize, EscPosPrinterCommands.BARCODE_TYPE_UPCA, code, widthMM, heightMM, textPosition);
    }

    @Override
    public int getCodeLength() {
        return 12;
    }
}
