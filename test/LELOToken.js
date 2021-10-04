const Token = artifacts.require("LELOToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require('dotenv').config({path: '../.env'});


contract("Token Test", async accounts => {

    const [initalHolder, recepient, anotherAccount ] = accounts;

    beforeEach(async() => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    })

    it("All tokens should be in my account", async() => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(initalHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("I can send balance from account 1 to account 2", async () => {
        const sendTokens = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        
        expect(instance.balanceOf(initalHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recepient, sendTokens)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(initalHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        expect(instance.balanceOf(recepient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });

    it("It is not possible to send tokens than account 1 has", async () => {
        const sendTokens = process.env.INITIAL_TOKENS+1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.transfer(recepient, sendTokens)).to.eventually.be.rejected;
        expect(instance.balanceOf(initalHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    });


})
