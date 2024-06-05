// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IoTDataStorage.sol";
import "./IoTDeviceAuth.sol";


/**
 * @title IoTIntegrationHelper
 * @dev Facilitates interactions between blockchain systems and IoT devices.
 */
contract IoTIntegrationHelper {
    IoTDataStorage private dataStorage;
    IoTDeviceAuth private deviceAuth;

    // Constructor to set the IoT contracts' addresses
    constructor(address _dataStorageAddress, address _deviceAuthAddress) {
        dataStorage = IoTDataStorage(_dataStorageAddress);
        deviceAuth = IoTDeviceAuth(_deviceAuthAddress);
    }

    // Event for successful data processing
    event DataProcessed(bytes32 indexed deviceId, string processedData);

    /**
     * @dev Processes and stores data from IoT devices, converting if necessary.
     * @param deviceId The unique identifier of the IoT device.
     * @param rawData The raw data from the IoT device, might require conversion or validation.
     */
    function processAndStoreData(bytes32 deviceId, string calldata rawData) external {
        require(deviceAuth.checkDevice(deviceId), "Device not registered.");
        
        // Example of data conversion (details depend on specific needs)
        string memory convertedData = convertData(rawData);

        // Store the processed data
        dataStorage.storeData(deviceId, convertedData);
        emit DataProcessed(deviceId, convertedData);
    }

    /**
     * @dev Converts raw data to a suitable format for blockchain storage.
     * @param data The raw data to be converted.
     * @return string The converted data.
     */
    function convertData(string memory data) private pure returns (string memory) {
        // Actual conversion logic depends on the data format and requirements.
        return data; // This is a placeholder.
    }

    /**
     * @dev Retrieves converted data for a specific IoT device.
     * @param deviceId The unique identifier of the IoT device.
     * @return string The converted data.
     */
    function getConvertedData(bytes32 deviceId) public view returns (string memory) {
        require(deviceAuth.checkDevice(deviceId), "Device not registered.");
        return dataStorage.getData(deviceId);
    }
}
