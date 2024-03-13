// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "./ERC20_DS.sol";
import "./IWETH.sol";

contract ERC20Swapper is UUPSUpgradeable, OwnableUpgradeable, ERC20_DS {

    event SwapExecuted(
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 amountOutMinimum
    );

    //////////////////////////// UUPS Functionalities  ////////////////////////////////////////
    /**
    * @dev Initializes the contract with necessary addresses and sets up the initial state.
    * @param _swapRouter The address of the Uniswap V3 swap router.
    * @param _WETH The address of the Wrapped Ether (WETH) contract.
    */
    function initialize(address _swapRouter, address _WETH) public initializer {
         __Ownable_init(msg.sender); //Setting contract owner

        // Ensure the addresses are not zero.
        require(_swapRouter != address(0), "swapRouter address cannot be zero");
        require(_WETH != address(0), "WETH address cannot be zero");
        
        swapRouter = _swapRouter;
        WETH = _WETH;

        // Approve the maximum once to save on future transactions.
        _approveWETH();
    }

    /**
    * @dev Authorizes the upgrade of the contract. Required by the OZ UUPS module
    *      (only owner is able to upgrade contract)
    * @param newImplementation The address of the new contract implementation.
    */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}


    //////////////////////////// Main Functionalities ////////////////////////////////////////
   /**
    * @dev Swaps ETH for a specified ERC20 token via Uniswap V3.
    * @param token The address of the token to swap to.
    * @param minAmount of tokens to receive from the swap.
    * @param poolFee of the Uniswap V3 pool to be used for the swap.
    * @return amountOut The tokens received from the swap.
    */
    function swapEtherToToken(address token, uint minAmount, uint24 poolFee) 
    external payable returns (uint) { // Modified visibility from public to external
        
        // Wrap ETH to WETH
        IWETH(WETH).deposit{value: msg.value}();

        // Set up swap parameters
        ISwapRouter.ExactInputSingleParams memory params = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: WETH,
                tokenOut: token,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: msg.value,
                amountOutMinimum: minAmount,
                sqrtPriceLimitX96: 0
            });

        // Execute the swap
        uint256 amountOut = ISwapRouter(swapRouter).exactInputSingle(params);

        emit SwapExecuted(token, msg.value, amountOut, minAmount);

        return amountOut;
    }

    /**
    * @dev Approves the Uniswap V3 router to spend WETH on behalf of this contract.
    *      Opting not to use SafeERC20's safeApprove() for WETH due to its full compliance
    *      with the ERC20 standard.
    */
    function _approveWETH() private {
        IWETH(WETH).approve(swapRouter, type(uint256).max);
    }

}