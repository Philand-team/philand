import './styles/App.css';
import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import Ownverse from './assets/ownverse.png';
import subDomain from './utils/Subdomain.json';
import LoadingIndicator from './components/LoadingIndicator';
import Dungeons from './components/Dungeons';
import { SUBDOMAIN_CONTRACT_ADDRESS } from './constants';

const TWITTER_HANDLE = 'Philand_xyz';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [ENScheck, setENScheck] = useState(0);
  const [MintingPHILAND, setMintingPHILAND] = useState(false);
  const [isLoading,] = useState(false);
    
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
					setCurrentAccount(account)
          setupEventListener()
      } else {
          console.log("No authorized account found")
      }
      // String, hex code of the chainId of the Rinkebey test network =>rinkeby is down =>change 03
      const rinkebyChainId = "0x3"; 
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Ropsten Test Network!");
      }
  }
    checkIfWalletIsConnected();
  }, []);


  // Setup our listener.
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(SUBDOMAIN_CONTRACT_ADDRESS, subDomain.abi, signer);
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          setENScheck(tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${SUBDOMAIN_CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
          
        });
    
        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        const address = accounts[0];
        const signer = provider.getSigner();
        const ENSContract = new ethers.Contract(SUBDOMAIN_CONTRACT_ADDRESS, subDomain.abi, signer);
        var random = Math.floor( Math.random () * 10) ;
        var random2 = Math.floor( Math.random () * 10);
        var subDomainName=String(random)+String(random2);
        console.log(subDomainName)
        let ENSTxn = await ENSContract.doregist(subDomainName);
        setMintingPHILAND(true)
        await ENSTxn.wait();
        // alert(`Go ENS https://app.ens.domains/address/${address}/controller and check your new subdomain `);
        console.log("Mining...please wait.")
        console.log(ENSTxn);
        alert(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${ENSTxn.hash}`);
        setMintingPHILAND(false)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };


  const renderMintUI = () => {
    if(ENScheck===0&&!MintingPHILAND){
    return (
      <div>
      <p className="sub-text">
            Create Your Metaverse. 
          </p>
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Create Your Sub Domain ENS
    </button>
    </div>
    )
    }else if(ENScheck!==0){
      return (<div>
        <a
            className="footer-text"
            href={`https://testnets.opensea.io/assets/${SUBDOMAIN_CONTRACT_ADDRESS}/${ENScheck}`}
            target="_blank" rel="noopener noreferrer"
          >{`Let' see your ENS card`}</a>
          <br/>
          <Dungeons ENScheck={ENScheck}/>;
          </div>
      )
    }
   
  }

const renderContent = () => {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Connect Wallet To Get Started
        </button>
      </div>
      
    );
  } 
  
};
  return (
    
    <div className="App">
        
        <div className="header-container">
          <p className="header gradient-text">Phi Galaxy</p>
          <p className="header gradient-text"><span role="img" aria-label="battle">⚔️</span> Make Your Ownverse <span role="img" aria-label="battle">⚔️</span></p>
          <img alt="Ownverse" src={Ownverse} />
          
          {currentAccount === "" ? renderContent() : renderMintUI()}
          {MintingPHILAND && (
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
        </div>
        <p>Minting In Progress...</p>
        <img
          src="https://media.giphy.com/media/l0HlCxCRMTZFT2H1m/giphy.gif"
          alt="Minting loading indicator"
        />
      </div>
    )}
        </div>
        <hr/>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank" rel="noopener noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
    </div>
  );
}

export default App;
