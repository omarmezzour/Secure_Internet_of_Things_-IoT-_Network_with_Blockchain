const AccessControl = artifacts.require("./AccessControl.sol");
const IoTDataStorage = artifacts.require("./IoTDataStorage.sol");

contract("AccessControl", accounts => {
  it("should allow granting and revoking access to IoT device data", async () => {
    const iotDataStorage = await IoTDataStorage.deployed();
    const accessControl = await AccessControl.deployed(iotDataStorage.address);
    const deviceId = web3.utils.sha3("device123");
    const user = accounts[1];

    // Grant access to the user
    await accessControl.grantAccess(user, deviceId, { from: accounts[0] });

    // Check if access is granted
    let hasAccess = await accessControl.checkAccess(user, deviceId);
    assert.equal(hasAccess, true, "Access should be granted.");

    // Revoke access
    await accessControl.revokeAccess(user, deviceId, { from: accounts[0] });

    // Check if access is revoked
    hasAccess = await accessControl.checkAccess(user, deviceId);
    assert.equal(hasAccess, false, "Access should be revoked.");
  });
});
