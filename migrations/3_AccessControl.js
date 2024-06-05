const AccessControl = artifacts.require("AccessControl");
const IoTDataStorage = artifacts.require("IoTDataStorage");

module.exports = async function (deployer, network, accounts) {
  try {
    const iotDataStorage = await IoTDataStorage.deployed();
    await deployer.deploy(AccessControl, iotDataStorage.address);
    const accessControl = await AccessControl.deployed();
    console.log("AccessControl deployed at:", accessControl.address);
  } catch (error) {
    console.error("Failed to deploy AccessControl:", error);
  }
};
