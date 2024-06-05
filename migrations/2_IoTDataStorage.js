const IoTDeviceAuth = artifacts.require("IoTDeviceAuth");
const IoTDataStorage = artifacts.require("IoTDataStorage");

module.exports = async function (deployer, network, accounts) {
  try {
    const iotDeviceAuth = await IoTDeviceAuth.deployed();
    await deployer.deploy(IoTDataStorage, iotDeviceAuth.address);
    const iotDataStorage = await IoTDataStorage.deployed();
    console.log("IoTDataStorage deployed at:", iotDataStorage.address);
  } catch (error) {
    console.error("Failed to deploy IoTDataStorage:", error);
  }
};
