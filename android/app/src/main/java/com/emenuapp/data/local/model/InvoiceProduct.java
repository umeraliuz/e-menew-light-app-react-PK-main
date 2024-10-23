package com.emenuapp_pk.data.local.model;

import java.util.ArrayList;
import java.util.List;

public class InvoiceProduct {

    private String title = "";
    private String attribute = "";
    private List<String> extras = new ArrayList<>();
    private List<String> instructions = new ArrayList<>();
    private int quantity;
    private double price;
    private double discountedPrice;
    private double vat;

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    public List<String> getExtras() {
        return extras;
    }

    public List<String> getInstructions() {
        return instructions;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setDiscountedPrice(double discountedPrice) {
        this.discountedPrice = discountedPrice;
    }

    public double getDiscountedPrice() {
        return discountedPrice;
    }

    public void setVat(double vat) {
        this.vat = vat;
    }

    public double getVat() {
        return vat;
    }
}
