// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

/**
 * @title WETH Interface
 * @dev Used for the WETH implementation of the mainnet
 */
interface IWETH {
    function deposit() external payable;
    function withdraw(uint256) external;
    function balanceOf(address) external view returns (uint256);
    function approve(address, uint256) external returns (bool);
}