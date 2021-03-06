import './styles/App.css';
import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import card from './assets/card.png';
import figma from './assets/figma.png';
import Ownverse from './assets/yourverse.png';
import subDomain from './utils/Subdomain.json';
import LoadingIndicator from './components/LoadingIndicator';
import Howmade from './components/Howmade';
import Dungeons from './components/Dungeons';
import { SUBDOMAIN_CONTRACT_ADDRESS } from './constants';

const TWITTER_HANDLE = 'Philand_xyz';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [ENScheck, setENScheck] = useState(0);
  const [MintingPHILAND, setMintingPHILAND] = useState(false);
  const [isLoading,] = useState(false);
  const [subd, setsubd] = useState("");
    
  useEffect(() => {
    // Check wallets connected.
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
      } else {
          console.log("No authorized account found")
      }
      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }
  }
    checkIfWalletIsConnected();
    setupEventListener();
  }, []);

  // Setup our listener.
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        const address = accounts[0];
        console.log(address)
        const connectedContract = new ethers.Contract(SUBDOMAIN_CONTRACT_ADDRESS, subDomain.abi, signer);
        // Get Subdomain contract mint-Notify and get token_id.
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          if (address===from.toLowerCase()){
          console.log(from, tokenId.toNumber())
          setENScheck(tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${SUBDOMAIN_CONTRACT_ADDRESS}/${tokenId.toNumber()}`)  
          setMintingPHILAND(false)
          }
        }
        );
        console.log("Setup event listener!")
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async (event) => {
    event.preventDefault();
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
        const subDomainName=subd;
        console.log(subDomainName)
        let ENSTxn = await ENSContract.doregist(subDomainName);
        setMintingPHILAND(true)
        await ENSTxn.wait();
        //???set msg.sender as controller owner
        console.log(`You got a controller of the subdomain. Check this : https://app.ens.domains/address/${address}/controller  `);
        console.log("Mining...please wait.")
        console.log(ENSTxn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${ENSTxn.hash}`);
        
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

  // render Subdomain NFT mint
  const renderMintUI = () => {
    if(ENScheck===0&&!MintingPHILAND){
    return (
      <div>
      <p className="sub-text">"Enter a land name you like in PhiLand"</p>

    <form onSubmit={askContractToMintNft}>
          <label>
            <input 
            size="30"
            type="text" 
            value={subd}
            placeholder="[a land name you like in PhiLand]"
            onChange={(e) => setsubd(e.target.value)}
        />
          </label>
          <p className="sub-sub-text">.philand.eth</p>
          <p/>
          
        <button type="submit" className="cta-button connect-wallet-button" >Mint your Subdomain</button>
      </form>
    </div>
    )
    }else if(ENScheck!==0){
      return (<div>
         <p className="footer-text">Let's see your ENS card</p>
          <a
          href={`https://testnets.opensea.io/assets/${SUBDOMAIN_CONTRACT_ADDRESS}/${ENScheck}`}
          target="_blank" rel="noopener noreferrer"
          >
          <img src={card} alt ="card" width="300" height="200"></img>
          </a>
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
          <p className="header gradient-text">Philand</p>
          {currentAccount === "" ? renderContent() : renderMintUI()}
          {MintingPHILAND && (
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
        </div>
        <p className="sub-text">
            "Minting In Progress..."
          </p>
        <img
          src="https://media.giphy.com/media/l0HlCxCRMTZFT2H1m/giphy.gif"
          alt="Minting loading indicator"
        />
      </div>
    )}
        </div>
        <hr/>
         <p className="stext">Concept</p>
        <img alt="Ownverse" src={Ownverse} width="640" height="380"/>
        <hr/>
        <p className="stext">How it's made</p>
        <div className="sub-text">#Development Language</div>
          <div className="sub-sub-text">Frontend: React. Backend: Solidity </div>
          <p/>
          <div className="sub-text">#Forked Code Source</div>
          <div className="sub-sub-text">Cryptsncaverns(CC-0) </div>
          <div className="sub-sub-sub-text">https://github.com/threepwave/cryptsandcaverns/blob/main/contract/README.md</div>
          <p/>
         <div className="footer-text">Powerd by @ensdomains, @MoralisWeb3, @opensea</div> 
         <hr/>
        <Howmade/>
        <hr/>
        <p className="stext">Architecture</p>
        <img alt="figma" src={figma} width="640" height="380"/>
        <div/>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank" rel="noopener noreferrer"
          >{`build by @${TWITTER_HANDLE}`}</a>
        </div>
    </div>
  );
}

export default App;
