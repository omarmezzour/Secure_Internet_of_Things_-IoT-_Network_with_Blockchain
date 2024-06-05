const IoTDataStorage = artifacts.require("./IoTDataStorage.sol");
const IoTDeviceAuth = artifacts.require("./IoTDeviceAuth.sol");
const IoTIntegrationHelper = artifacts.require("./IoTIntegrationHelper.sol");

contract("IoTIntegrationHelper", accounts => {
  it("should process and store data for a registered IoT device, then retrieve it", async () => {
    const iotDeviceAuth = await IoTDeviceAuth.deployed();
    const iotDataStorage = await IoTDataStorage.deployed();
    const iotIntegrationHelper = await IoTIntegrationHelper.deployed(iotDataStorage.address, iotDeviceAuth.address);
    const deviceId = web3.utils.sha3("device123");
    const rawData = "sample raw data";

    // First, register the device
    await iotDeviceAuth.registerDevice(deviceId, { from: accounts[0] });

    // Process and store the data
    await iotIntegrationHelper.processAndStoreData(deviceId, rawData, { from: accounts[0] });

    // Retrieve the processed data
    const storedData = await iotIntegrationHelper.getConvertedData(deviceId);

    assert.equal(storedData, rawData, "The data retrieved should match the processed data.");
  });
});
