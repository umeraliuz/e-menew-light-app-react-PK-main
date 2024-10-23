package com.emenuapp_pk.data.local.model;

import com.google.gson.annotations.SerializedName;

public class Product {
    @SerializedName("name")
    private String name;

    @SerializedName("qty")
    private int quantity;

    @SerializedName("price")
    private double price;

    public Product() {
        name = "";
        quantity = 0;
        price = 0.00;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
    }
}
