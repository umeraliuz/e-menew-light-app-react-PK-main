package com.emenuapp_pk.data.local.model;

import com.google.gson.annotations.SerializedName;

public class ReceiptProduct {
    @SerializedName("product_id")
    private String productId = "0";

    @SerializedName("quantity")
    private int quantity = 0;

    @SerializedName("special_notes")
    private String specialNotes = "";

    @SerializedName("product_name")
    private String productName = "";

    @SerializedName("composeProductSubItems")
    private String productItems = "";

    public String getProductId() {
        return productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getSpecialNotes() {
        return specialNotes;
    }

    public String getProductName() {
        return productName;
    }

    public String getProductItems() {
        return productItems;
    }
}
