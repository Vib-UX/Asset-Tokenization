const Token = artifacts.require("LELOToken");
const TokenSale = artifacts.require("LELOTokenSale");


const chai = require("./setupchai");
const BN = web3.utils.BN;

const expect = chai.expect;
require("dotenv").config({path: "../.env"});


contract("TokenSale Test", async (accounts) =>{

    const [deployerAccount, demo1, demo2, demo3, demo4] = accounts;

    it("should not have any tokens in deployer account ", async () => {
        let instance = await Token.deployed();
        let sample = new BN(0);
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(sample);
    })

    it("all tokens should be in TokenSale contract by default ", async () =>{
        let instance = await Token.deployed();
        let balanceOfTokenSaleContract = await instance.balanceOf(TokenSale.address);
        let totalSupply = await instance.totalSupply();
        return expect(balanceOfTokenSaleContract).to.be.a.bignumber.equal(totalSupply);
    })

    it("should show correct token price with alloted tier", async () =>{
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        expect(tokenSaleInstance.getTier1()).to.eventually.be.a.bignumber.equal(new BN(30e6));
        return expect(tokenSaleInstance.getTokenPrice()).to.eventually.be.a.bignumber.equal(new BN(31e11));
    })

    // it("should be able to buy some tokens from the alloted tier",  async () =>{
    //     let tokenInstance = await Token.deployed();
    //     let tokenSaleInstance = await TokenSale.deployed();
    //     let price = await tokenSaleInstance.getTokenPrice();
    //     let _numOfTokens = 30e6;
    //     // await tokenSaleInstance.buyTokens(_numOfTokens, {from: demo3, value: (_numOfTokens * price)});
    //     // expect(tokenInstance.balanceOf(demo3)).to.eventually.be.a.bignumber.equal(new BN(30e6));
    //     // expect(tokenSaleInstance.getTokenSold()).to.eventually.be.a.bignumber.equal(new BN(30e6));
    //     return expect(tokenSaleInstance.buyTokens(_numOfTokens, {from: demo1, value: (_numOfTokens * price)})).to.be.fulfilled;
    // })

    it("should reject the bulk transaction that surpass the tier system", async () =>{
        let tokenSaleInstance = await TokenSale.deployed();
        let price = await tokenSaleInstance.getTokenPrice();
        let _numOfTokens = 40e6;    // Initial buy 40 Million sale --> tier 1 limit 30 million
        return expect(tokenSaleInstance.buyTokens(_numOfTokens, {from: demo2, value: (_numOfTokens * price)})).to.be.rejected;
    })

    it("should change the rate after PreSale", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        
        let price = await tokenSaleInstance.getTokenPrice();
        let _numOfTokens = 30e6;
        await tokenSaleInstance.buyTokens(_numOfTokens, {from: demo3, value: (_numOfTokens * price)});
        expect(tokenInstance.balanceOf(demo3)).to.eventually.be.a.bignumber.equal(new BN(30e6));
        expect(tokenSaleInstance.getTokenSold()).to.eventually.be.a.bignumber.equal(new BN(30e6));

        // Check to see if token price changed
        expect(tokenSaleInstance.getTokenPrice()).to.eventually.be.a.bignumber.equal(new BN(62e11));

        _numOfTokens = 15e6;
        // 15 Million token sale @ rate 0.02 USD 
        price = await tokenSaleInstance.getTokenPrice();
        await tokenSaleInstance.buyTokens(_numOfTokens, {from: demo4, value: (_numOfTokens*price)});
        expect(tokenInstance.balanceOf(demo4)).to.eventually.be.a.bignumber.equal(new BN(15e6));

        // Total number of token sold == 45 Million
        return expect(tokenSaleInstance.getTokenSold()).to.eventually.be.a.bignumber.equal(new BN(45e6));
    })

    it("should reject the rate change if seed sale is still in progress", async ()=>{
        let tokenSaleInstance = await TokenSale.deployed();
        return expect(tokenSaleInstance.setTokenPrice(70e11, {from: deployerAccount})).to.be.rejected;
    })

})