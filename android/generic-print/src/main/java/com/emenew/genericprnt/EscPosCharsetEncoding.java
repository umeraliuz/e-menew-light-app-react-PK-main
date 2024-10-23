package com.emenew.genericprnt;

public class EscPosCharsetEncoding {
    public static final String[] ENCODING_TYPES = new String[]{
            "CP437",
            "CP850",
            "CP860",
            "CP863",
            "CP865",
            "CP857",
            "CP737",
            "CP928",
            "Windows-1252",
            "CP866",
            "CP852",
            "CP858",
            "CP874",
            "Windows-775",
            "CP855",
            "CP862",
            "CP864",
            "GB18030",
            "BIG5",
            "KSC5601",
            "utf-8"
    };

    private String charsetName;
    private byte[] encodingByteType;
    private byte[] charsetCommand;


    /**
     * Create new instance of EscPosCharsetEncoding with default charset.
     */
    public EscPosCharsetEncoding() {
        this(1);

        /* this.charsetName = "GB18030";
        this.encodingByteType = new byte[]{0x1C, 0x26};
        this.charsetCommand = new byte[]{0x1C, 0x43, (byte) 0x00};

        this.charsetName = "CP850";
        this.encodingByteType = new byte[]{0x1C, 0x2E};
        this.charsetCommand = new byte[]{0x1B, 0x74, (byte) 2}; */
    }


    /**
     * Create new instance of EscPosCharsetEncoding with record index
     */
    public EscPosCharsetEncoding(int record) {
        this.charsetName = ENCODING_TYPES[record];
        if (record < 17) {
            this.encodingByteType = new byte[]{0x1C, 0x2E};
            this.charsetCommand = new byte[]{0x1B, 0x74, codeParse(record)};
        } else {
            this.encodingByteType = new byte[]{0x1C, 0x26};
            this.charsetCommand = new byte[]{0x1C, 0x43, codeParse(record)};
        }
    }

    /**
     * Create new instance of EscPosCharsetEncoding.
     *
     * @param charsetName     Name of charset encoding (Ex: windows-1252)
     * @param escPosCharsetId Id of charset encoding for your printer (Ex: 16)
     */
    public EscPosCharsetEncoding(String charsetName, int escPosCharsetId) {
        this.charsetName = charsetName;
        //this.charsetCommand = new byte[]{0x1B, 0x74, (byte) escPosCharsetId};
        this.encodingByteType = new byte[]{0x1C, 0x26};
        this.charsetCommand = new byte[]{0x1C, 0x43, (byte) escPosCharsetId};
    }

    public byte[] getCommand() {
        return this.charsetCommand;
    }

    public byte[] getEncodingByteType() {
        return encodingByteType;
    }

    public String getName() {
        return this.charsetName;
    }

    public int getRecord() {
        for (int i = 0; i < ENCODING_TYPES.length; i++) {
            if (this.charsetName == ENCODING_TYPES[i]) {
                return i;
            }
        }
        return 1;
    }

    private byte codeParse(int value) {
        byte res = 0x00;
        switch (value) {
            case 0:
                res = 0x00;
                break;
            case 1:
            case 2:
            case 3:
            case 4:
                res = (byte) (value + 1);
                break;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                res = (byte) (value + 8);
                break;
            case 12:
                res = 21;
                break;
            case 13:
                res = 33;
                break;
            case 14:
                res = 34;
                break;
            case 15:
                res = 36;
                break;
            case 16:
                res = 37;
                break;
            case 17:
            case 18:
            case 19:
                res = (byte) (value - 17);
                break;
            case 20:
                res = (byte) 0xff;
                break;
            default:
                break;
        }
        return res;
    }
}
