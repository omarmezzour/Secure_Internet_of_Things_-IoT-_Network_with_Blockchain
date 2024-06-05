const IoTDeviceAuth = artifacts.require("./IoTDeviceAuth.sol");

contract("IoTDeviceAuth", accounts => {
  it("should register and check the registration status of an IoT device", async () => {
    const iotDeviceAuthInstance = await IoTDeviceAuth.deployed();
    const deviceId = web3.utils.sha3("device123");

    // Register the device
    await iotDeviceAuthInstance.registerDevice(deviceId, { from: accounts[0] });

    // Check if the device is registered
    const isDeviceRegistered = await iotDeviceAuthInstance.isRegistered(deviceId);

    assert.equal(isDeviceRegistered, true, "The device should be registered.");
  });
});
