package com.emenuapp_pk.data.local.model;

import com.google.gson.annotations.SerializedName;

import java.util.Collections;
import java.util.List;

public class ReceiptCategory {
    @SerializedName("id")
    private String id = "0";

    @SerializedName("name")
    private String name = "";

    @SerializedName("products")
    private List<ReceiptProduct> products = Collections.emptyList();

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<ReceiptProduct> getProducts() {
        return products;
    }
}
