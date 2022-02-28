import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT  } from "./utils/interact.js";
import { ethers } from 'ethers'; 

const contract = require('./contract-abi.json')
const { ethereum } = window;
const contractAddress = "0x8687fb3E403fC751722f476D28857B6303b123D4";
const abi = contract.abi;

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [_x, setX] = useState("");
  const [_y, setY] = useState("");
  const [url, setURL] = useState("");
 
  useEffect(async () => {
    // const {address, status} = await getCurrentWalletConnected();
    // setWallet(address)
    // setStatus(status); 

    addWalletListener(); 
}, []);

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    // const { status } = await mintNFT(url, name, description);
    // setStatus(status);
    let provider = new ethers.providers.Web3Provider(ethereum);
    let  signer = provider.getSigner();
    let  nftContract = new ethers.Contract(contractAddress, abi, signer);
    console.log("----x----", parseInt(_x));
    console.log("----y----", parseInt(_y));
    await nftContract.mintNFT(
      walletAddress, 
      "https://gateway.pinata.cloud/ipfs/QmYMqpBaxEH8Dc2usemobhPu27WvTLfRkQn1fpE9ZG2ucJ", 
      parseInt(_x), 
      parseInt(_y), 
      "regular",
      { value: ethers.utils.parseEther('3') }
      );
};

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">NFT Minter</h1>
      <p>
        Simply add your asset's link, X and Y coordinate, then press "Mint."
      </p>
      <form>
        <h2>Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>X: Coordinate</h2>
        <input
          type="number"
          placeholder="e.g. 12"
          onChange={(event) => setX(event.target.value)}
        />
        <h2>Y: Coordinate</h2>
        <input
          type="number"
          placeholder="e.g. 13"
          onChange={(event) => setY(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};



export default Minter;
