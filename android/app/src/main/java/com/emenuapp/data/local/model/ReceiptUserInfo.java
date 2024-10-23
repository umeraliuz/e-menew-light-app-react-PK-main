package com.emenuapp_pk.data.local.model;

public class ReceiptUserInfo {
    private String firstName;
    private String lastName;

    public ReceiptUserInfo(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
}
