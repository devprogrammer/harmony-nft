import { pinJSONToIPFS } from './pinata.js'
import { ethers } from 'ethers'; 
// import { nftInfo } from '../../script/deploy.js'

require('dotenv').config();
// const API_URL = process.env.API_URL;
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const web3 = createAlchemyWeb3(API_URL); 

const contractABI = require('../contract-abi.json')
const contractAddress = "0xff8D076BdB5e5b42dE40e347b698d4472ed7c27a";

export const mintNFT = async(url, name, description) => {

    //make metadata
    const metadata = new Object();
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    //make pinata call
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        }
    } 
    const tokenURI = pinataResponse.pinataUrl;  
    
    let provider = await new ethers.providers.Web3Provider(window.ethereum);
    // window.contract = await new web3.eth.Contract(contract.abi, contractAddress);
    window.contract = new ethers.Contract(contractABI, contractAddress);
    
    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI, 0, {value: ethers.utils.parseEther('300000000000000000')}).encodeABI()//make call to NFT smart contract 
    };
    // const transactionParameters = {
    //     to: contractAddress, // Required except during contract publications.
    //     from: window.ethereum.selectedAddress, // must match user's active address.
    //     'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI, 12, 15, "regular", {value: web3.utils.fromWei('500000000000000000', 'ether')}).encodeABI()//make call to NFT smart contract 
    // };
    
    //sign the transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "👆🏽 Write a message in the text-field above.",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };


export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
        const addressArray = await window.ethereum.request({
            method: "eth_accounts",
        });
        if (addressArray.length > 0) {
            return {
                address: addressArray[0],
                status: "👆🏽 Write a message in the text-field above.",
            };
        } else {
            return {
                address: "",
                status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

  