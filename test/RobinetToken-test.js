const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('robinetToken', function () {
  let RobinetToken, robinetToken, owner;
  const INITIAL_SUPPLY = '1000000';
  const TOTAL_SUPPLY = ethers.utils.parseEther('1000000');
  const ZERO_ADDRESS = ethers.constants.AddressZero;
  const NAME = 'RobinetToken';
  const SYMBOL = 'RBT';

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    RobinetToken = await ethers.getContractFactory('RobinetToken');
    robinetToken = await RobinetToken.connect(owner).deploy(INITIAL_SUPPLY);
    await robinetToken.deployed();
  });

  it(`Should have name: ${NAME}`, async function () {
    expect(await robinetToken.name()).to.equal(NAME);
  });

  it(`Should have symbol: ${SYMBOL}`, async function () {
    expect(await robinetToken.symbol()).to.equal(SYMBOL);
  });

  it('should emit a Transer event', async function () {
    expect(robinetToken.deployTransaction)
      .to.emit(robinetToken, 'Transfer')
      .withArgs(ZERO_ADDRESS, owner.address, TOTAL_SUPPLY);
  });

  it('should transfer the total supply to owner', async function () {
    expect(await robinetToken.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
  });
});
