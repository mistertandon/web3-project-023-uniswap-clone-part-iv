async function main() {
  const [owner, signer2] = await ethers.getSigners();

  const Parvesh = await ethers.getContractFactory("Parvesh", owner);
  const parvesh = await Parvesh.deploy();

  const Payal = await ethers.getContractFactory("Payal", owner);
  const payal = await Payal.deploy();

  const Jiyanshi = await ethers.getContractFactory("Jiyanshi", owner);
  const jiyanshi = await Jiyanshi.deploy();

  await parvesh
    .connect(owner)
    .mint(signer2.address, ethers.utils.parseEther("1000000"));

  await payal
    .connect(owner)
    .mint(signer2.address, ethers.utils.parseEther("1000000"));

  await jiyanshi
    .connect(owner)
    .mint(signer2.address, ethers.utils.parseEther("1000000"));

  console.log("parvesh address", parvesh.address);
  console.log("payal address", payal.address);
  console.log("jiyanshi address", jiyanshi.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("error", error);
    process.exit(1);
  });
