// npx hardhat run scripts/deployERC20Swapper.ts --network goerli
import { ethers, upgrades } from "hardhat";
import { SWAP_ROUTER_ADDRESS, WETH_ADDRESS } from "./addresses"; 


async function main() {
  console.log("Deploying ERC20Swapper...");

  const ERC20Swapper = await ethers.getContractFactory("ERC20Swapper");
  const erc20Swapper = await upgrades.deployProxy(
    ERC20Swapper,
    [SWAP_ROUTER_ADDRESS, WETH_ADDRESS],
    { initializer: 'initialize', kind: "uups" }
  );

  // Wait for the deployment to finish
  await erc20Swapper.waitForDeployment();
  
  // Log the address of the proxy contract
  console.log("ERC20Swapper deployed to:", erc20Swapper.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to deploy ERC20Swapper:", error.message);
    process.exit(1);
  });
