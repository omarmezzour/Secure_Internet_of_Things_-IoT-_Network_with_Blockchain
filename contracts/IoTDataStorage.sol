// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IoTDeviceAuth.sol";

/**
 * @title IoTDataStorage
 * @dev Manages secure storage and retrieval of IoT data.
 */
contract IoTDataStorage {
    IoTDeviceAuth private authContract;

    // Constructor to set the authentication contract address
    constructor(address _authContractAddress) {
        authContract = IoTDeviceAuth(_authContractAddress);
    }

    // Mapping from device ID to data
    mapping(bytes32 => string) private deviceData;

    // Event for data storage
    event DataStored(bytes32 indexed deviceId, string data);

    /**
     * @dev Stores data from an IoT device.
     * @param deviceId The unique identifier of the device.
     * @param data The encrypted data string.
     */
    function storeData(bytes32 deviceId, string calldata data) external {
        require(authContract.checkDevice(deviceId), "Device not registered.");
        deviceData[deviceId] = data;
        emit DataStored(deviceId, data);
    }

    /**
     * @dev Retrieves data for a specific IoT device.
     * @param deviceId The unique identifier of the device.
     * @return string The stored data.
     */
    function getData(bytes32 deviceId) public view returns (string memory) {
        require(authContract.checkDevice(deviceId), "Device not registered.");
        return deviceData[deviceId];
    }
}