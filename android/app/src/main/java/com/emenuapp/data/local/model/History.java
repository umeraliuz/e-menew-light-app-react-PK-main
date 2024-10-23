package com.emenuapp_pk.data.local.model;

import io.objectbox.annotation.Entity;
import io.objectbox.annotation.Id;

@Entity
public class History {
    @Id
    private long id;
    private String url;
    private long timestamp;

    public History() {
        this.id = 0;
        this.url = "";
        this.timestamp = System.currentTimeMillis();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
