import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract, Signer, parseEther } from "ethers";
// Import main-net addresses used for testing
import { SWAP_ROUTER_ADDRESS, WETH_ADDRESS, USDT_ADDRESS, QUOTER_ADDRESS } from "./addresses";

// Import contract ABIs
import QuoterJson from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import ERC20Json from "@openzeppelin/contracts/build/contracts/IERC20.json";


describe("ERC20Swapper", function () {
  let erc20Swapper: Contract;
  let deployer: Signer;
  let Quoter: Contract;
  let USDT: Contract;

  before(async function () {
    // Retrieve the first signer as the deployer
    [deployer] = await ethers.getSigners();

    // Instantiate Uniswap Quoter
    Quoter = await ethers.getContractAt(QuoterJson.abi, QUOTER_ADDRESS);

    // Instantiate USDT contract
    USDT = await ethers.getContractAt(ERC20Json.abi, USDT_ADDRESS);

    // Deploy the ERC20Swapper contract
    const ERC20SwapperFactory = await ethers.getContractFactory("ERC20Swapper");
    erc20Swapper = await upgrades.deployProxy(
      ERC20SwapperFactory,
      [SWAP_ROUTER_ADDRESS, WETH_ADDRESS], // Using provided addresses
      { initializer: 'initialize' }
    );

    // Wait for the deployment to be confirmed
    await erc20Swapper.waitForDeployment();
  });

  it("Should have correctly set swapRouter and WETH addresses", async function () {
    // Verify that the contract's swapRouter address is set correctly
    expect(await erc20Swapper.swapRouter()).to.equal(SWAP_ROUTER_ADDRESS);

    // Verify that the contract's WETH address is set correctly
    expect(await erc20Swapper.WETH()).to.equal(WETH_ADDRESS);
  });

  it("Re-initialization should be prevented", async function () {
    await expect(
      erc20Swapper.initialize(SWAP_ROUTER_ADDRESS, WETH_ADDRESS)
    ).to.be.reverted; 
  });

  it("swaps ETH for USDT successfully", async function () {
    // Estimate USDT amount to receive for 1 ETH
    const minUSDTOut = await Quoter.quoteExactInputSingle.staticCall(
      WETH_ADDRESS, USDT_ADDRESS, 500, parseEther("1"), 0
    );

    // Action: Record USDT balance before swap, perform swap, then check balance after
    const initialUSDTBalance = await USDT.balanceOf(deployer);
    await erc20Swapper.swapEtherToToken(USDT_ADDRESS, minUSDTOut, 500, { value: parseEther("1") });

    // Assertion: Verify USDT balance increased by at least the estimated amount
    const finalUSDTBalance = await USDT.balanceOf(deployer);
    expect(finalUSDTBalance).to.be.gte(initialUSDTBalance + minUSDTOut);
  });

  it("revert when requesst too much USDT for 1 ETH", async function () {

    // Estimate USDT amount to be received for 1 ETH
    const minUSDTOut = await Quoter.quoteExactInputSingle.staticCall(
      WETH_ADDRESS, USDT_ADDRESS, 500, parseEther("1"), 0
    );
    
    // Double the estimated amount to ensure it's an unrealistic expectation
    const unrealisticMinUSDTOut = minUSDTOut + minUSDTOut;

    // Attempt to swap with a high minimum amount that cannot be satisfied
    await expect(
      erc20Swapper.swapEtherToToken(USDT_ADDRESS, unrealisticMinUSDTOut, 500, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Too little received");
  });

});
