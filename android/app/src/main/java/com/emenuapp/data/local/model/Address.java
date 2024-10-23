package com.emenuapp_pk.data.local.model;

import com.google.gson.annotations.SerializedName;

public class Address {
    @SerializedName("line_one")
    private String lineOne;

    @SerializedName("line_one")
    private String lineTwo;

    public Address() {
        lineOne = "";
        lineTwo = "";
    }

    public String getLineOne() {
        return lineOne;
    }

    public String getLineTwo() {
        return lineTwo;
    }
}
