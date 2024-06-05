// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IoTDataStorage.sol";

/**
 * @title AccessControl
 * @dev Manages access control policies for IoT data.
 */
contract AccessControl {
    IoTDataStorage private dataStorage;

    // Constructor to set the data storage contract address
    constructor(address _dataStorageAddress) {
        dataStorage = IoTDataStorage(_dataStorageAddress);
    }

    // Mapping from user to access rights per device
    mapping(address => mapping(bytes32 => bool)) public userAccess;

    // Event for granting access rights
    event AccessGranted(address indexed user, bytes32 deviceId);
    // Event for revoking access rights
    event AccessRevoked(address indexed user, bytes32 deviceId);

    /**
     * @dev Grants a user access to a specific IoT device's data.
     * @param user The address of the user.
     * @param deviceId The unique identifier of the IoT device.
     */
    function grantAccess(address user, bytes32 deviceId) external {
        userAccess[user][deviceId] = true;
        emit AccessGranted(user, deviceId);
    }

    /**
     * @dev Revokes a user's access to a specific IoT device's data.
     * @param user The address of the user.
     * @param deviceId The unique identifier of the IoT device.
     */
    function revokeAccess(address user, bytes32 deviceId) external {
        userAccess[user][deviceId] = false;
        emit AccessRevoked(user, deviceId);
    }

    /**
     * @dev Checks if a user has access to a specific device's data.
     * @param user The address of the user.
     * @param deviceId The unique identifier of the IoT device.
     * @return bool True if the user has access, false otherwise.
     */
    function checkAccess(address user, bytes32 deviceId) public view returns (bool) {
        return userAccess[user][deviceId];
    }
}
