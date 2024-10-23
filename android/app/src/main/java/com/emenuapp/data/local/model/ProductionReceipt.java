package com.emenuapp_pk.data.local.model;

import java.util.ArrayList;
import java.util.List;

public class ProductionReceipt {
    private String title = "";
    private String orderType = "";
    private String customerFirstName = "";
    private String customerLastName = "";
    private String orderId = "0";
    private String tableId = "0";
    private String orderDate = "";
    private List<ReceiptCategory> categories = new ArrayList<>();

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public String getCustomerFirstName() {
        return customerFirstName;
    }

    public void setCustomerFirstName(String customerFirstName) {
        this.customerFirstName = customerFirstName;
    }

    public String getCustomerLastName() {
        return customerLastName;
    }

    public void setCustomerLastName(String customerLastName) {
        this.customerLastName = customerLastName;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public String getTableId() {
        return tableId;
    }

    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    public List<ReceiptCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<ReceiptCategory> categories) {
        this.categories = categories;
    }
}
