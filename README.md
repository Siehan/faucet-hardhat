# Contract

Dans ce dossier vous trouverez 2 contracts :

- Le contract du Token => RobinetToken.sol;
- Le contract de distribution de token => Faucet.sol

## Installation

Si vous voulez Cloner ce projet, copiez collez ces commandes sur votre terminal :
git clone https://github.com/johnfr14/red-team-faucet.git cd red-team-faucet yarn

Pour compiler et tester les contracts, executer ces commandes sur votre terminal :

yarn hardhat compile
yarn hardhat test

## RobinetToken

Nous avons créé un Token ERC20 qui sera distribué gratuitement, tout les 3 jours, a celui qui en fait la demande.
Ce token s'appelle RobinetToken (RBT) et dispose d'un TOTAL SUPPLY de 10000000 token.
Pour le créer nous avons importé la librairie d'OpenZeppelin ainsi que le contract ERC20.

```js
    // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.5;
        import "@openzeppelin/contracts/access/Ownable.sol";
        import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

        contract RobinetToken is ERC20, Ownable {
            constructor(uint256 totalSupply_) ERC20("RobinetToken", "RBT") {
                _mint(msg.sender, totalSupply_);
            }
        }
 ```

## Faucet

Ce contract permet l'envoi d'une quantité fixe de tokens possédés par une adresse qui est sous contrôle de l'owner.

L'utilisateur ne peut réclamer ces tokens que tous les 3 jours. Pour cela nous avons créé un modifier qui sera appliqué à la fonction claim().
Ce modifier prend en compte le block où l'utilisateur demande les tokens et bloque l'utilisation de cette fonction par ce dernier, pendant une durée de 3 jours.

```js
modifier goodTime() {
        require(
            block.timestamp >= _claimTokens[msg.sender],
            "Faucet: You need to wait 3 days before reclaim new Tokens"
        );
        _;
}
```

Ce Contract dispose d'une seule fonction principale. La fonction claim() qui permet de transférer les tokens à celui qui l'appelle.
Cette fonction comporte différentes conditions :

- Le modifier goodTime, expliqué précédemment
- _supplyInStock !=0, qui permet de vérifier que l'owner dispose encore de token à distribuer.
 Elle permet l'envoie de 100 RobinetToken => uint256 amountRobinet = 100.
 Et enfin exécute l'envoie par le biais d'un transferFrom().

```js
    function claim() public goodTime() {
        require(_supplyInStock != 0, "Faucet: No more Token to claim");
        _claimTokens[msg.sender] = block.timestamp + _deadLine;
        uint256 amountRobinet = 100;
        _Robinet.transferFrom(owner(), msg.sender, amountRobinet);
        emit RobinetTransfer(msg.sender, amountRobinet);
    }
```
# faucet-hardhat
