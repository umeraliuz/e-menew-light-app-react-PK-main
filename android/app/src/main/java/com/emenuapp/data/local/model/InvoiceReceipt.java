package com.emenuapp_pk.data.local.model;

import java.util.ArrayList;
import java.util.List;

public class InvoiceReceipt {
    private String title = "";
    private String tableId = "";
    private String orderId = "";
    private String orderDate = "";
    private String currency = "";
    private String tableTitle = "";
    private String message = "";
    private String addressLineOne = "";
    private String addressLineTwo = "";
    private String phone = "";
    private String vatNo = "";
    private String vatRc = "";

    private double subTotal = 0.0;
    private double reduction = 0.0;
    private double delivery = 0.0;
    private double total = 0.0;
    private double vatAmount = 0.0;
    private String vatRate = "";

    private String paymentStatus = "";

    private List<InvoiceProduct> products = new ArrayList<>();

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    public String getTableId() {
        return tableId;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCurrency() {
        return currency;
    }

    public void setTableTitle(String tableTitle) {
        this.tableTitle = tableTitle;
    }

    public String getTableTitle() {
        return tableTitle;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setAddressLineOne(String addressLineOne) {
        this.addressLineOne = addressLineOne;
    }

    public String getAddressLineOne() {
        return addressLineOne;
    }

    public void setAddressLineTwo(String addressLineTwo) {
        this.addressLineTwo = addressLineTwo;
    }

    public String getAddressLineTwo() {
        return addressLineTwo;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhone() {
        return phone;
    }

    public void setVatNo(String vatNo) {
        this.vatNo = vatNo;
    }

    public String getVatNo() {
        return vatNo;
    }

    public void setVatRc(String vatRc) {
        this.vatRc = vatRc;
    }

    public String getVatRc() {
        return vatRc;
    }

    public List<InvoiceProduct> getProducts() {
        return products;
    }

    public void setSubTotal(double subTotal) {
        this.subTotal = subTotal;
    }

    public double getSubTotal() {
        return subTotal;
    }

    public void setReduction(double reduction) {
        this.reduction = reduction;
    }

    public double getReduction() {
        return reduction;
    }

    public void setVatAmount(double vatAmount) {
        this.vatAmount = vatAmount;
    }

    public double getVatAmount() {
        return vatAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public double getDelivery() {
        return delivery;
    }

    public void setDelivery(double delivery) {
        this.delivery = delivery;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public void setVatRate(String vatRate) {
        this.vatRate = vatRate;
    }

    public String getVatRate() {
        return vatRate;
    }
}
