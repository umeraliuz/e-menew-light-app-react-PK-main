package com.emenew.genericprnt.connection.bluetooth;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;

import androidx.annotation.Nullable;

import java.util.Set;

public class BluetoothConnections {
    protected BluetoothAdapter bluetoothAdapter;

    /**
     * Create a new instance of BluetoothConnections
     */
    public BluetoothConnections() {
        this.bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    /**
     * Get a list of bluetooth devices available.
     *
     * @return Return an array of BluetoothConnection instance
     */
    @SuppressLint("MissingPermission")
    @Nullable
    public BluetoothConnection[] getList() {
        if (this.bluetoothAdapter == null) {
            return null;
        }

        if (!this.bluetoothAdapter.isEnabled()) {
            return null;
        }

        Set<BluetoothDevice> bluetoothDevicesList = this.bluetoothAdapter.getBondedDevices();
        BluetoothConnection[] bluetoothDevices = new BluetoothConnection[bluetoothDevicesList.size()];

        if (bluetoothDevicesList.size() > 0) {
            int i = 0;
            for (BluetoothDevice device : bluetoothDevicesList) {
                bluetoothDevices[i++] = new BluetoothConnection(device);
            }
        }

        return bluetoothDevices;
    }

    @Nullable
    public static BluetoothConnection selectSpecificPrinter(BluetoothConnections bluetoothConnections, String identifier) {
        BluetoothConnection[] list = bluetoothConnections.getList();

        if (list != null) {
            for (BluetoothConnection connection : list) {
                BluetoothDevice device = connection.getDevice();
                if (device.getAddress().equals(identifier)) {
                    return connection;
                }
            }
        }

        return null;
    }
}
