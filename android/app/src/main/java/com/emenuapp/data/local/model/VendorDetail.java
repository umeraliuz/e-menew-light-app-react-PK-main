package com.emenuapp_pk.data.local.model;

import com.google.gson.annotations.SerializedName;

public class VendorDetail {
    @SerializedName("id")
    private long id = 0;

    @SerializedName("restaurant_code")
    private String restaurantCode = "";

    @SerializedName("public_phone_no")
    private String phoneNumber;

    @SerializedName("trading_name")
    private String merchantName = "";

    @SerializedName("legal_name")
    private String legalName;

    @SerializedName("registry_number")
    private String registryNumber = "";

    @SerializedName("vat_number")
    private String vatNumber = "";

    @SerializedName("currency")
    private String currency = "";

    public long getId() {
        return id;
    }

    public String getRestaurantCode() {
        return restaurantCode;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public String getLegalName() {
        return legalName;
    }

    public String getRegistryNumber() {
        return registryNumber;
    }

    public String getVatNumber() {
        return vatNumber;
    }

    public String getCurrency() {
        return currency;
    }
}
