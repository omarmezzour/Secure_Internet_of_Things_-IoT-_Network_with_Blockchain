import os
import warnings
import simpy
import random
import json
import logging
from web3 import Web3

warnings.filterwarnings("ignore", message="Network 345 avec le nom 'Yooldo Verse Mainnet' n'a pas un ChainId valide")
warnings.filterwarnings("ignore", message="Network 12611 avec le nom 'Astar zkEVM' n'a pas un ChainId valide")

logging.getLogger("eth_utils.network").setLevel(logging.ERROR)

class IoTDevice:
    def __init__(self, env, device_id, device_type, contracts, web3_instance):
        self.env = env
        self.device_id = device_id
        self.device_type = device_type
        self.contracts = contracts
        self.web3 = web3_instance
        self.device_name = f"{device_type.capitalize()}_{device_id}"

    def generate_data(self):
        while True:
            data_value = random.randint(1, 100)
            self.send_data_to_blockchain(str(data_value), self.contracts['IoTDataStorage'])  
            print(f'{self.device_name} ({self.device_type}): Generated data {data_value} at time {self.env.now}')
            yield self.env.timeout(random.randint(5, 10))

    def send_data_to_blockchain(self, data, contract):
        try:
            device_id_bytes = self.web3.to_bytes(text=self.device_id).ljust(32, b'\0')
            data_str = str(data)
            tx_hash = contract.functions.storeData(device_id_bytes, data_str).transact({
                'from': self.web3.eth.accounts[0],
                'gas': 2000000,
                'gasPrice': self.web3.to_wei('50', 'gwei')
            })
            receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)
            print(f'Data stored on blockchain with transaction hash: {receipt.transactionHash.hex()}')
        except Exception as e:
            print(f"An error occurred: {e}")

    def to_dict(self):
        return {
            'device_id': self.device_id,
            'device_type': self.device_type,
            'device_name': self.device_name,
            'data_value': random.randint(1, 100),
            'timestamp': str(self.env.now)
        }

def run_simulation(num_devices, contracts, web3):
    env = simpy.Environment()
    devices = []
    for i in range(num_devices):
        device_type = 'sensor' if i % 2 == 0 else 'actuator'
        device = IoTDevice(env, f"{i}", device_type, contracts, web3)
        env.process(device.generate_data())
        devices.append(device)
    env.run(until=50)
    save_device_data(devices)

def save_device_data(devices):
    # Sauvegarde les données des dispositifs dans un fichier JSON
    filepath = os.path.join(os.path.dirname(__file__), 'device_data.json')
    with open(filepath, 'w') as f:
        json.dump([device.to_dict() for device in devices], f, indent=4)

def setup_contracts():
    web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
    if not web3.is_connected():
        raise ConnectionError("Failed to connect to Ethereum node.")
    with open('ABI_contracts.json', 'r') as file:
        contracts_data = json.load(file)
    contract_keys = ['IoTDeviceAuth', 'IoTDataStorage', 'AccessControl', 'IoTIntegrationHelper']
    contracts = {}
    for key in contract_keys:
        abi = contracts_data[key]['abi']
        address = contracts_data[key]['address']
        checksum_address = web3.to_checksum_address(address)
        contracts[key] = web3.eth.contract(address=checksum_address, abi=abi)
    return contracts, web3

if __name__ == "__main__":
    contracts, web3_instance = setup_contracts()
    run_simulation(5, contracts, web3_instance)  # Simulate with 5 devices
