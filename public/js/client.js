document.addEventListener('DOMContentLoaded', () => {
    const connectWalletButton = document.getElementById('connectWallet');
    connectWalletButton.addEventListener('click', () => {
        window.location.href = '/loader';
    });

    const disconnectButton = document.getElementById('disconnect');
    disconnectButton.addEventListener('click', disconnectMetaMask);

    fetchDevices(); // Appel initial pour charger les dispositifs.
});

function fetchDevices() {
    console.log('Fetching devices...');
    fetch('/api/devices')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(devices => {
            const container = document.getElementById('device-container');
            if (!container) {
                throw new Error('Device container element not found.');
            }
            container.innerHTML = '';
            devices.forEach(device => {
                const card = createDeviceCard(device);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching devices:', error);
            const container = document.getElementById('device-container');
            if (container) {
                container.innerHTML = `Failed to load devices: ${error.message}`;
            }
        });
}

function createDeviceCard(device) {
    if (!device.transaction || !device.transaction.startsWith('0x') || device.transaction.length !== 42) {
        device.transaction = generateRandomEthereumAddress();
    }
    if (!device.gasusage) {
        device.gasusage = Math.floor(Math.random() * 100000).toString();
    }
    if (!device.Blocknumber) {
        device.Blocknumber = Math.floor(Math.random() * 10000).toString();
    }

    const card = document.createElement('div');
    card.className = 'device-card';
    card.id = `device-${device.device_id}`;
    card.innerHTML = `<p>Transaction: ${device.transaction}</p>
                      <h3>${device.device_name || "Unknown Device"}</h3>
                      <p>Type: ${device.device_type}</p>
                      <p>Value: ${device.data_value}</p>
                      <p>Time: ${device.timestamp}</p>
                      <p>Gas usage: ${device.gasusage}</p>
                      <p>Block number: ${device.Blocknumber}</p>
                      <button class='button-on' onclick='toggleDevicePower(this, "${device.device_id}")'>Power</button>`;
    return card;
}

function toggleDevicePower(button, deviceId) {
    console.log(`Toggling power for device ${deviceId}`);
    const card = document.getElementById(`device-${deviceId}`);
    if (!button || !card) {
        console.error("Button or card element is missing.");
        return;
    }

    const isOn = button.className === 'button-on';
    button.className = isOn ? 'button-off' : 'button-on';
    button.textContent = isOn ? 'Power Off' : 'Power On';

    if (!isOn) { // Régénérer les détails seulement si l'appareil passe de 'off' à 'on'.
        regenerateTransactionDetails(card);
    }
}

function regenerateTransactionDetails(card) {
    const newTransaction = generateRandomEthereumAddress();
    const newGasUsage = Math.floor(Math.random() * 100000).toString();
    const newBlockNumber = Math.floor(Math.random() * 10000).toString();

    const transactionElement = card.querySelector("p:nth-child(1)");
    transactionElement.textContent = `Transaction: ${newTransaction}`;
    const gasUsageElement = card.querySelector("p:nth-child(6)");
    gasUsageElement.textContent = `Gas usage: ${newGasUsage}`;
    const blockNumberElement = card.querySelector("p:nth-child(7)");
    blockNumberElement.textContent = `Block number: ${newBlockNumber}`;
}

function generateRandomEthereumAddress() {
    const hexChars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
    }
    return address;
}

function updateDeviceStatus(device, button) {
    console.log(`Updating status for device ${device.device_id}: ${device.isOn}`);
    button.className = device.isOn ? 'button-on' : 'button-off'; // Update button class based on device state
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    fetchDevices();
});

