
# ERC20 Swapper Contract

The project introduces a smart contract designed for the Ethereum blockchain to facilitate swapping Ethereum (ETH) for any ERC-20 token via Uniswap V3.

## Key Features

- **ETH to ERC-20 Token Swap**: Allows users to exchange their ETH for any ERC-20 token supported by Uniswap V3.
- **Minimum Amount Guarantee**: Ensures transactions revert if the received token amount is less than the specified minimum, safeguarding user expectations.
- **Upgradeable Contract**: Utilizes UUPS (Universal Upgradeable Proxy Standard) for straightforward and secure contract upgrades.
- **Owner-Authorized Upgrades**: Restricts upgrade authority to the contract owner.

## Deployment

The contract is deployed on the Goerli Ethereum testnet.

- **Contract Address**: `0xf786154e56e5c88Ce984800dEa71B48EA4FFAbfE`

### Setup

1. **Clone the repository**: Obtain the project files by cloning the repository.
2. **Install dependencies**: Run `npm install` to install necessary dependencies.
3. **Compile the contract**: Execute `npx hardhat compile` to compile the smart contract.
4. **Run tests**: Use `npx hardhat test` to run the tests and verify the contract's functionality.

### Deployment

Deploy the ERC20 Swapper Contract to a network of your choice using Hardhat:

```shell
npx hardhat run scripts/deployERC20Swapper.ts --network <network-name>
```

## Considerations

- **Safety and Security**: Emphasizes the protection of user assets through secure development practices and the integration of established DEX protocols.
- **Performance**: Aims for gas-efficient execution of swaps and contract deployment.
- **Upgradeability and Maintenance**: Facilitates future enhancements and vulnerability mitigation through the adoption of the UUPS upgradeability standard.
- **Usability and Interoperability**: Designed to support interactions from both Externally Owned Accounts (EOAs) and other contracts, broadening the contract's applicability across the Ethereum ecosystem.
- **Readability and code quality**: The code is fully commented, functions and its parameters documented. 