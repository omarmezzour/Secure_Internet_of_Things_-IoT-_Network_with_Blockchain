    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.18;


    /**
    * @title IoTDeviceAuth
    * @dev Manages authentication and registration of IoT devices.
    */
    contract IoTDeviceAuth {
        mapping(bytes32 => bool) public isRegistered;

        event DeviceRegistered(bytes32 indexed deviceId);

        event DeviceUnregistered(bytes32 indexed deviceId);

        /**
        * @dev Registers a new IoT device.
        * @param deviceId The unique identifier of the device.
        */
        function registerDevice(bytes32 deviceId) external {
            require(!isRegistered[deviceId], "Device already registered.");
            isRegistered[deviceId] = true;
            emit DeviceRegistered(deviceId);
        }

        /**
        * @dev Unregisters an IoT device.
        * @param deviceId The unique identifier of the device.
        */
        function unregisterDevice(bytes32 deviceId) external {
            require(isRegistered[deviceId], "Device not registered.");
            isRegistered[deviceId] = false;
            emit DeviceUnregistered(deviceId);
        }

        /**
        * @dev Checks if a device is registered.
        * @param deviceId The unique identifier of the device.
        * @return bool True if the device is registered, false otherwise.
        */
        function checkDevice(bytes32 deviceId) public view returns (bool) {
            return isRegistered[deviceId];
        }
    }