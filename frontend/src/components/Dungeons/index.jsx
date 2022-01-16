import React, { useEffect, useState } from 'react';
import './Dungeons.css';
import { ethers } from 'ethers';
import '../../styles/App.css';
import ensland from '../../assets/landcreate.png';
import DungeonsSOL from '../../utils/Dungeons.json';
import LoadingIndicator from '../LoadingIndicator';
import { DUNGEONS_CONTRACT_ADDRESS } from '../../constants';
const Dungeons = ({ ENScheck }) => {
  // State
const [dungeonsContract, setDungeonsContract] = useState(null);
const [mintingPhiland, setMintingPhiland] = useState(false);
const [ensSVG, setensSVG] = useState(0);
// UseEffect
useEffect(() => {
  console.log(ENScheck);
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const dungeonsContract = new ethers.Contract(
      DUNGEONS_CONTRACT_ADDRESS,
      DungeonsSOL.abi,
      signer
    );

    setDungeonsContract(dungeonsContract);
  } else {
    console.log('Ethereum object not found');
  }
  setupEventListener2();
}, [ENScheck]);

const setupEventListener2 = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const dungeonsContract = new ethers.Contract(
        DUNGEONS_CONTRACT_ADDRESS,
        DungeonsSOL.abi,
        signer
    );
        dungeonsContract.on("Minted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          setensSVG(tokenId.toNumber());
        });
    
        console.log("Setup event listener!")

      }else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
const mintPhilandNFTAction = (philandId) => async () => {
  try {
    if (dungeonsContract) {
      /*
       * Show our loading indicator
       */
      setMintingPhiland(true);
      console.log('Minting philand in progress...');
      const mintTxn = await dungeonsContract.mint(philandId);
      await mintTxn.wait();
      console.log(mintTxn);
      /*
       * Hide our loading indicator when minting is finished
       */
      
      setMintingPhiland(false);
      
    }
  } catch (error) {
    console.warn('MintPhilandAction Error:', error);
    /*
     * If there is a problem, hide the loading indicator as well
     */
    setMintingPhiland(false);
  }
};
  // Render Methods
  const renderPhilands = (ENScheck) =>     {
  if(!ensSVG && !mintingPhiland){ 
       return ( <button
          type="button"
          className="cta-button connect-wallet-button"
          onClick={mintPhilandNFTAction(ENScheck)}
        >{`Mint your land`}
        </button>)
  }}
  if (!ensSVG) {
  return (
  <div className="select-philand-container">
    <h2>Next Mint Your Philand.</h2>
      {renderPhilands(ENScheck)}
    {/* Only show our loading state if mintingPhiland is true */}
    {mintingPhiland && (
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p className="sub-text">
            "Minting In Progress..."
          </p>
        </div>
        <img
          src="https://media.giphy.com/media/f7b9ltJ4FrhnsKjYx2/giphy.gif"
          alt="Minting loading indicator"
        />
      </div>
    )}
  </div>
  );
}else {
  return (
  <div>
    <p className="footer-text">Let's see your ENS metaverse</p>
        <a
            className="footer-text"
            href={`https://testnets.opensea.io/assets/${DUNGEONS_CONTRACT_ADDRESS}/${ensSVG}`}
            target="_blank" rel="noopener noreferrer"
          ><img src={ensland} alt ="ensland" width="300" height="200">
            </img>
          </a>

          <p className="sub-text">
            "※It may take few minutes to view on Opensea"
          </p>
         </div>
          

          )
}
};

export default Dungeons;