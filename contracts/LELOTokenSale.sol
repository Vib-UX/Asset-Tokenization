pragma solidity ^0.6.0;

import "./LELOToken.sol";

contract LELOTokenSale {
    address payable admin;
    LELOToken public tokenContract;
    uint256 public tokenPrice = 3100000000000;
    uint256 public tokensSold;
    uint256 private _tier1 = 30e6;
    uint256 private _tier2 = 50e6;

    event Sell(address _buyer, uint256 _amount);

    constructor (LELOToken _tokenContract) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
    }

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function getTokenPrice() public view returns (uint256 out){
        if(tokensSold < 30e6){
            // 0.01$ = 0.0000031 eth
            out = 31e11;     // token price in wei
        }
        
        else if(tokensSold >= 30e6 && tokensSold <=80e6){
            // 0.02$ = 0.0000062 eth
            out = 62e11; //token price in wei
        }

        return out;

    }

    function getTokenSold() public view returns (uint256){
        return tokensSold;
    }

    function getTier1() public view returns (uint256){
        return _tier1;
    }

    function getTier2() public view returns (uint256){
        return _tier2;
    }

    function setTokenPrice(uint _tokenPrice) public{
        require(msg.sender == admin);
        require(tokensSold >= 80e6, "Presale / Seed Sale is still pending");
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, getTokenPrice()));
        require((_tier1!=0 && _tier1>= _numberOfTokens) 
        || (_tier1 == 0 && _tier2!=0 && _tier2 >= _numberOfTokens) 
        || (_tier2 == 0), 
        "First purchase from the alloted tier");
        require((100e6 - tokensSold) > _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        if(_tier1 != 0){                                 // If tier1 is not empty subtract number of tokens from it
            _tier1 -= _numberOfTokens;
        }
        else if(_tier1 ==0 && _tier2 !=0){                // else if tier1 is empty start alloting from tier 2 
            _tier2 -= _numberOfTokens;
        }
        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }
}