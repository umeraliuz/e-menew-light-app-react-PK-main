package com.emenew.genericprnt.textparser;

import com.emenew.genericprnt.EscPosPrinterCommands;
import com.emenew.genericprnt.exceptions.EscPosEncodingException;

public interface IPrinterTextParserElement {
    int length() throws EscPosEncodingException;

    IPrinterTextParserElement print(EscPosPrinterCommands printerSocket) throws EscPosEncodingException;
}
