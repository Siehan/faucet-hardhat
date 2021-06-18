const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('robinettoken', function () {
  let RobinetToken, robinettoken, dev, owner;
  let TOTAL_SUPPLY = ethers.utils.parseEther('1000000');
  let ZERO_ADDRESS = ethers.constants.AddressZero;
  const NAME = 'RobinetToken';
  const SYMBOL = 'RBT';

  beforeEach(async function () {
    ;[dev, owner] = await ethers.getSigners();
    RobinetToken = await ethers.getContractFactory('RobinetToken');
    robinettoken = await RobinetToken.connect(owner).deploy(TOTAL_SUPPLY);
    await robinettoken.deployed();
  })
  it(`Should have name: ${NAME}`, async function () {
    expect(await robinettoken.name()).to.equal(NAME);
  });

  it(`Should have symbol: ${SYMBOL}`, async function () {
    expect(await robinettoken.symbol()).to.equal(SYMBOL);
  });

  it('should emit a Transfer event', async function () {
    expect(robinettoken.deployTransaction).to.emit(robinettoken, 'Transfer')
    .withArgs(ZERO_ADDRESS, owner.address, TOTAL_SUPPLY);
  });

  it('should transfer the total supply to owner', async function () {
    expect(await robinettoken.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
  });
});
