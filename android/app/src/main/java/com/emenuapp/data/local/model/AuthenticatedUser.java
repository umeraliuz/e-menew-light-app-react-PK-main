package com.emenuapp_pk.data.local.model;

import com.google.gson.annotations.SerializedName;

public class AuthenticatedUser {
    @SerializedName("restaurant_id")
    private String restaurantId = "0";

    @SerializedName("email")
    private String email = "";

    @SerializedName("role_id")
    private String roleId = "";

    @SerializedName("token_app")
    private String token = "";

    @SerializedName("user_id")
    private long userId = 0;

    @SerializedName("first_name")
    private String firstName = "";

    @SerializedName("last_name")
    private String lastName = "";

    @SerializedName("photo")
    private String photo = "";

    @SerializedName("country_iso")
    private String countryIso = "";

    @SerializedName("street_address")
    private String streetAddress = "";

    @SerializedName("postcode_city")
    private String postCodeCity = "";

    @SerializedName("latitude")
    private double latitude = 0.0;

    @SerializedName("longitude")
    private double longitude = 0.0;

    @SerializedName("status")
    private int status = 0;

    @SerializedName("vendor_details")
    private VendorDetail vendorDetail = new VendorDetail();

    public String getEmail() {
        return email;
    }

    public String getRoleId() {
        return roleId;
    }

    public String getRestaurantId() {
        return restaurantId;
    }

    public int getStatus() {
        return status;
    }

    public String getToken() {
        return token;
    }

    public long getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhoto() {
        return photo;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getPostCodeCity() {
        return postCodeCity;
    }

    public String getCountryIso() {
        return countryIso;
    }

    public VendorDetail getVendorDetail() {
        return vendorDetail;
    }
}
