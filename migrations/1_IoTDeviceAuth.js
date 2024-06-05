const IoTDeviceAuth = artifacts.require("IoTDeviceAuth");

module.exports = async function (deployer, network, accounts) {
  try {
    await deployer.deploy(IoTDeviceAuth);
    const iotDeviceAuth = await IoTDeviceAuth.deployed();
    console.log("IoTDeviceAuth deployed at:", iotDeviceAuth.address);
  } catch (error) {
    console.error("Failed to deploy IoTDeviceAuth:", error);
  }
};
