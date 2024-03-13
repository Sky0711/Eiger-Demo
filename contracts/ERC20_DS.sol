// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


// Contract containing all the data structures for ERC20Swapper 
// allowing developer to mitigate any storage collisons during developements/upgrades
abstract contract ERC20_DS {
    
    // Can be made immutable to save gas (requires modification to UUPS deployment)
    address public WETH;
    address public swapRouter;

    // Reserved storage slots to avoid future memory collisions
    uint256[48] private __gap;
}