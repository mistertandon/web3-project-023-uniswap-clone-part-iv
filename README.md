## Uniswap clone

#### Figma

- Car [dashboard](<https://www.figma.com/file/efCWSSfWDL3WIndUHv42d6/Car-Assistant-Dashboard-(Community)?node-id=0-1&t=tGIF5ow7ZYv8TJFD-0>)
- [https://www.figma.com/community/file/834873258912260235](Navigation) Menu

$ npx create-next-app .
√ Would you like to use TypeScript with this project? ... No / Yes [No]
√ Would you like to use ESLint with this project? ... No / Yes [No]
√ Would you like to use Tailwind CSS with this project? ... No / Yes [Yes]
√ Would you like to use `src/` directory with this project? ... No / Yes [No]
√ Would you like to use experimental `app/` directory with this project? ... No / Yes [No]
√ What import alias would you like configured? ... @/\*

#### Roboto Fonts

[Link](https://fonts.google.com/specimen/Roboto) to get font files


$ npx hardhat
Need to install the following packages:
  hardhat
Ok to proceed? (y) y
888    888                      888 888               888
888    888                      888 888               888   
888    888                      888 888               888   
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888   
888    888 .d888888 888    888  888 888  888 .d888888 888   
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b. 
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

Welcome to Hardhat v2.14.0

√ What do you want to do? · Create a JavaScript project
√ Hardhat project root: · D:\web3\synced\web3-project-020-uniswap-clone
√ Do you want to add a .gitignore? (Y/n) · y

You need to install these dependencies to run the sample project:
npm install --save-dev "hardhat@^2.14.0" "@nomicfoundation/hardhat-toolbox@^2.0.0"


# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

npm i @uniswap/v3-periphery

npm install @openzeppelin/contracts@3.4.2
Note: Specified version must get installed in order to get contract compiled correctly.

npm i ether@5.7.2
Note: Specified version must get installed in order to use required API.

npm in web3modal

npm i hardhat-tracer

 > npx hardhat clean

 > npx hardhat compile

 > npx hardhat test --trace

 > npx hardhat node

 > npx hardhat run scripts/deploy.js --network localhost

  > npm install @uniswap/smart-order-router@2.5.30

   - Uninstall following packages
  > npm uninstall hardhat
  > npm uninstall @nomicfoundation/hardhat-toolbox
  > npm uninstall @uniswap/v3-periphery
  > npm uninstall web3modal
   - Install following packages
  > npm install hardhat@2.11.1
  > npm i @nomiclabs/hardhat-ethers@2.1.1
  > npm i @nomiclabs/hardhat-waffle@2.0.3
  > npm install @uniswap/v3-periphery@1.0.1
  > npm i @uniswap/v3-sdk@3.9.0
  > npm i bignumber.js@9.1.0
  > npm i ethereum-waffle@3.4.4
  > npm i jsbi@3.2.5
  > npm i web3modal@1.9.9
  


 > npx hardhat run scripts/uniswapContract.js --network localhost
 > npx hardhat run scripts/uniswapContract.js --network localhost

const WETHAddress = "0xf18774574148852771c2631d7d06E2A6c8b44fCA";
const factoryAddress = "0x9f62EE65a8395824Ee0821eF2Dc4C947a23F0f25";
const swapRouterAddress = "0x20BBE62B175134D21b10C157498b663F048672bA";
const nftDescriptorAddress = "0x3AeEBbEe7CE00B11cB202d6D0F38D696A3f4Ff8e";
const nonfungibleTokenPositionDescriptorAddress =
  "0xB2ff9d5e60d68A52cea3cd041b32f1390A880365";
const nonfungiblePositionMangerAddress =
  "0xa68E430060f74F9821D2dC9A9E2CE3aF7d842EBe";

const parveshAddress = "0x8B64968F69E669faCc86FA3484FD946f1bBE7c91";
const payalAddress = "0x9A86494Ba45eE1f9EEed9cFC0894f6C5d13a1F0b";
const jiyanshiAddress = "0xC0340c0831Aa40A0791cF8C3Ab4287EB0a9705d8";

Pool address is 0x4fc0f416Dc7676620C49F2e96FEBa9644E6865EA