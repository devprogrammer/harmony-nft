import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT  } from "./utils/interact.js";
import { ethers } from 'ethers'; 
import customStyles from './Minter.css';

const contract = require('./contract-abi.json')
const { ethereum } = window;
const contractAddress = "0x4ae82f81EBaf3046080b673b39E151d20f635895";
const abi = contract.abi;

/**
 *  Functional Component
 */ 

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [url, setURL] = useState("");
 
  useEffect(() => {
    // const {address, status} = await getCurrentWalletConnected();
    // setWallet(address)
    // setStatus(status);

    addWalletListener(); 
  }, []);

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet();
    console.log("wallet response ====>", walletResponse);
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };
  
  /////////////////////////////////////////////// NFT Mint /////////////////////////////////////////////////////////
  const onMintPressed = async () => {
    // const { status } = await mintNFT(url, name, description);
    // setStatus(status);
    let provider = new ethers.providers.Web3Provider(ethereum);
    let signer = provider.getSigner();
    let nftContract = new ethers.Contract(contractAddress, abi, signer);

    let isPublicSale = await nftContract.getPublicSale();
    let isWhitelistSale = await nftContract.getWhiteListSale();
    let whitelist = await nftContract.getWhiteList();
    try {
      if (!isPublicSale) {
        alert("Palanium: public sale is deactivated now");
        return;
      }
    } catch (err) {
      alert(err.message);
      return;
    }
    console.log("public sale ===>", isPublicSale);
    
    let index = whitelist.findIndex((item) => item.toUpperCase() === walletAddress.toUpperCase());
    if (isWhitelistSale && index > -1 ) {
      await nftContract.mintNFT(
        walletAddress, 
        `https://gateway.pinata.cloud/ipfs/${url}`, 
        0,
        { value: ethers.utils.parseEther('0.085') }
      );
    } 
    else {
      await nftContract.mintNFT(
        walletAddress, 
        `https://gateway.pinata.cloud/ipfs/${url}`, 
        0,
        { value: ethers.utils.parseEther('0.17') }
      );
    }
  };

  //////////////////////////////////////////////// isPublicSale ///////////////////////////////////////////////////////
  const updatePublicSaleStatus = async (status) => {
    let provider = new ethers.providers.Web3Provider(ethereum);
    let signer = provider.getSigner();
    let nftContract = new ethers.Contract(contractAddress, abi, signer);
    let isAdmin = await nftContract.checkAdmin();
    console.log("isAdmin or Owner? ===>", isAdmin);
    if (!isAdmin) {
      console.log("your are not admin");
      return;
    }
    
    await nftContract.updatePublicSale(status);
    try {
      alert(`Changed presale status to =====> ${status}`);
    } catch (err) {
      alert(`Error of changing presale status  =====> ${err.message}`);
    }
  }

  //////////////////////////////////////////////// isPublicSale ///////////////////////////////////////////////////////
  const updateWhiteListSaleStatus = async (status) => {
    let provider = new ethers.providers.Web3Provider(ethereum);
    let signer = provider.getSigner();
    let nftContract = new ethers.Contract(contractAddress, abi, signer);
    await nftContract.checkAdmin();
    await nftContract.updateWhileListSale(status);
    try {
      alert(`Changed whitelist status to =====> ${status}`);
    } catch (err) {
      alert(`Error of changing whitelist status  =====> ${err.message}`);
    }
  }

  ///////////////////////////////////////////////// Add whitelist //////////////////////////////////////////////////////
  const addWhiteList = async () => {
    let provider = new ethers.providers.Web3Provider(ethereum);
    let signer = provider.getSigner();
    let nftContract = new ethers.Contract(contractAddress, abi, signer);
    await nftContract.addWhiteList([walletAddress]);
    try {
      alert(`Add ${walletAddress} to whitelist`);
    } catch (err) {
      alert(`Error ===> ${err.message}`);
    }
  }

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
      <form>
        <h2>Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
      <div className="sale-section">
        <h4> ===================// Manage PRESALE status //====================</h4>
      </div>
      <div className="publicSaleContainer">
        <button id="turnOnPublic" onClick={updatePublicSaleStatus} data-status="true">
          Active
        </button>
        <button id="turnOffPublic" onClick={updatePublicSaleStatus} data-status="false">
          Deactive
        </button>
      </div>

      <div className="sale-section">
        <h4> ================// Manage WHITELIST sale status //=================</h4>
      </div>
      <div className="whiteListSaleContainer">
        <button id="turnOnWhiteList" onClick={updateWhiteListSaleStatus} data-status={true}>
          Active
        </button>
        <button id="turnOffWhiteList" onClick={updateWhiteListSaleStatus} data-status={false}>
          Deactive
        </button>
      </div>
      <div className="sale-section">
        <h4> =========// Address {walletAddress} to be added to whitelist //=========</h4>
      </div>
      <div className="whiteListSaleContainer">
        <button id="turnOffWhiteList" onClick={addWhiteList}>
          Add whitelist
        </button>
      </div>
    </div>
  );
};



export default Minter;
