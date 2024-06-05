const IoTIntegrationHelper = artifacts.require("IoTIntegrationHelper");
const IoTDataStorage = artifacts.require("IoTDataStorage");
const IoTDeviceAuth = artifacts.require("IoTDeviceAuth");

module.exports = async function (deployer, network, accounts) {
  try {
    const iotDataStorage = await IoTDataStorage.deployed();
    const iotDeviceAuth = await IoTDeviceAuth.deployed();
    await deployer.deploy(IoTIntegrationHelper, iotDataStorage.address, iotDeviceAuth.address);
    const iotIntegrationHelper = await IoTIntegrationHelper.deployed();
    console.log("IoTIntegrationHelper deployed at:", iotIntegrationHelper.address);
  } catch (error) {
    console.error("Failed to deploy IoTIntegrationHelper:", error);
  }
};
