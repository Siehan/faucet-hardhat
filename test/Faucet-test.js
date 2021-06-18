const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Faucet', function () {
  let Faucet, faucet, RobinetToken, robinettoken, dev, owner, alice;
  const TOTAL_SUPPLY = ethers.utils.parseEther('10000000');
  const TWO_DAYS = 172800;
  const THREE_DAYS = 259200;

  beforeEach(async function () {
    [dev, owner, alice] = await ethers.getSigners();
    RobinetToken = await ethers.getContractFactory('RobinetToken');
    robinettoken = await RobinetToken.connect(owner).deploy(TOTAL_SUPPLY);
    await robinettoken.deployed();

    Faucet = await ethers.getContractFactory('Faucet');
    faucet = await Faucet.connect(owner).deploy(robinettoken.address);
    await faucet.deployed();
    await robinettoken.connect(owner).approve(faucet.address, TOTAL_SUPPLY);
  });

  describe('Deployment', function () {
    it('should set the token contract address', async function () {
      expect(await faucet.tokenContractAddress()).to.equal(robinettoken.address);
    });

    it('should set the token owner address', async function () {
      expect(await faucet.tokenOwner()).to.equal(owner.address);
    });
  });

  describe('Claim', function () {
    beforeEach(async function () {
      await faucet.connect(alice).claim();
    });

    it('should revert if faucet time not reach', async function () {
      await ethers.provider.send('evm_increaseTime', [TWO_DAYS]);
      await ethers.provider.send('evm_mine');
      await expect(faucet.connect(alice).claim()).to.revertedWith(
        'Faucet: You need to wait 3 days before reclaim new Tokens');
    });

    it('should get token after 3 days', async function () {
      await ethers.provider.send('evm_increaseTime', [THREE_DAYS]);
      await ethers.provider.send('evm_mine');
      expect(await faucet.connect(alice).claim());
    });

    it('should receive tokens', async function () {
      expect(await robinettoken.balanceOf(alice.address)).to.equal(100);
    });

    it('should decrease supply for the faucet', async function () {
      expect(await faucet.supplyInStock()).to.equal(TOTAL_SUPPLY.sub(100));
    });
  });
});
