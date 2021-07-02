/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { deployed } = require('./deployed');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // Optionnel car l'account deployer est utilisé par défaut
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // We get the Token contract to deploy
  const RobinetToken = await hre.ethers.getContractFactory('RobinetToken');
  const robinetToken = await RobinetToken.deploy(1000000);

  // Attendre que le contrat soit réellement déployé, cad que la transaction de déploiement
  // soit incluse dans un bloc
  await robinetToken.deployed();

  // update deployed.json and print usefull information on the console.
  await deployed('RobinetToken', hre.network.name, robinetToken.address);

  // We get the Faucet contract to deploy
  const Faucet = await hre.ethers.getContractFactory('Faucet');
  const faucet = await Faucet.deploy(robinetToken.address);

  // Attendre que le contrat soit réellement déployé, cad que la transaction de déploiement
  // soit incluse dans un bloc
  await faucet.deployed();

  // update deployed.json and print usefull information on the console.
  await deployed('Faucet', hre.network.name, faucet.address);

  if (hre.network.name !== 'mainnet') {
    await robinetToken.approve(`${faucet.address}`, ethers.utils.parseEther('1000000'));
    console.log((await robinetToken.allowance(deployer.address, `${faucet.address}`))
      .toString(), `: Allowance to ${faucet.address}`);
  }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
