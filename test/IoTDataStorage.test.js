const IoTDeviceAuth = artifacts.require("./IoTDeviceAuth.sol");
const IoTDataStorage = artifacts.require("./IoTDataStorage.sol");

contract("IoTDataStorage", accounts => {
  it("should store and retrieve data for a registered IoT device", async () => {
    const iotDeviceAuth = await IoTDeviceAuth.deployed();
    const iotDataStorage = await IoTDataStorage.deployed(); // Corrected line
    const deviceId = web3.utils.sha3("device123");
    const deviceData = "encryptedDataString";

    // First, register the device
    await iotDeviceAuth.registerDevice(deviceId, { from: accounts[0] });

    // Store data
    await iotDataStorage.storeData(deviceId, deviceData, { from: accounts[0] });

    // Retrieve data
    const retrievedData = await iotDataStorage.getData(deviceId);

    assert.equal(retrievedData, deviceData, "The data retrieved does not match the data stored.");
  });
});
