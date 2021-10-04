var LELOToken = artifacts.require("LELOToken.sol");
var LELOTokenSale = artifacts.require("LELOTokenSale.sol");



// var CDEXTokenSale = artifacts.require("./CDEXSale.sol");
// var Kyc = artifacts.require("./KycContract.sol");
require("dotenv").config({path: "../.env"});

module.exports = async function(deployer){
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(LELOToken,process.env.INITIAL_TOKENS);
    let instance = await LELOToken.deployed();  
    // await deployer.deploy(Kyc);
    await deployer.deploy(LELOTokenSale,LELOToken.address);
    await instance.transfer(LELOTokenSale.address,process.env.INITIAL_TOKENS);
}