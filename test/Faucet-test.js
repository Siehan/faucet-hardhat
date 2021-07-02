const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Faucet', function () {
  let Faucet, faucet, RobinetToken, robinetToken, owner, alice;
  const TOTAL_SUPPLY = ethers.utils.parseEther('1000000');
  const TOKEN_AMOUNT = ethers.utils.parseEther('100');
  const TWO_DAYS = 172800;
  const THREE_DAYS = 259200;

  beforeEach(async function () {
    [owner, alice] = await ethers.getSigners();
    RobinetToken = await ethers.getContractFactory('RobinetToken');
    robinetToken = await RobinetToken.connect(owner).deploy(1000000);
    await robinetToken.deployed();

    Faucet = await ethers.getContractFactory('Faucet');
    faucet = await Faucet.connect(owner).deploy(robinetToken.address);
    await faucet.deployed();
    await robinetToken.connect(owner).approve(faucet.address, TOTAL_SUPPLY);
  });

  describe('Deployment', function () {
    it('should set the token contract address', async function () {
      expect(await faucet.tokenContractAddress()).to.equal(robinetToken.address);
    });

    it('should set the token owner address', async function () {
      expect(await faucet.tokenOwner()).to.equal(owner.address);
    });

    it('should check allowance of faucet', async function () {
      expect(await robinetToken.allowance(owner.address, faucet.address)).to.equal(TOTAL_SUPPLY);
    });
  });

  describe('Claim', function () {
    beforeEach(async function () {
      await faucet.connect(alice).claim();
    });

    it('should revert if faucet time not reached', async function () {
      await ethers.provider.send('evm_increaseTime', [TWO_DAYS]);
      await ethers.provider.send('evm_mine');
      await expect(faucet.connect(alice).claim())
        .to.revertedWith('Faucet: You need to wait 3 days before reclaim new Tokens');
    });

    it('should get token after 3 days', async function () {
      await ethers.provider.send('evm_increaseTime', [THREE_DAYS]);
      await ethers.provider.send('evm_mine');
      expect(await faucet.connect(alice).claim());
      expect(await robinetToken.balanceOf(alice.address)).to.equal(TOKEN_AMOUNT.mul(2));
    });

    it('should decrease supply for the faucet', async function () {
      expect(await faucet.supplyInStock()).to.equal(TOTAL_SUPPLY.sub(TOKEN_AMOUNT));
    });
  });
});
