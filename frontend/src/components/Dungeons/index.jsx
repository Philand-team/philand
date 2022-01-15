import React, { useEffect, useState } from 'react';
import './Dungeons.css';
import { ethers } from 'ethers';
// import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import '../../styles/App.css';
import DungeonsSOL from '../../utils/Dungeons.json';
// import myEpicGame from '../../utils/MyEpicGame.json';
import LoadingIndicator from '../LoadingIndicator';
import { DUNGEONS_CONTRACT_ADDRESS } from '../../constants';
const Dungeons = ({ ENScheck }) => {
  // State
const [gameContract, setGameContract] = useState(null);
const [mintingCharacter, setMintingCharacter] = useState(false);
const [ensSVG, setensSVG] = useState(false);
// UseEffect
useEffect(() => {
  console.log(ENScheck);
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      DUNGEONS_CONTRACT_ADDRESS,
      DungeonsSOL.abi,
      signer
    );

    /*
     * This is the big difference. Set our gameContract in state.
     */
    setGameContract(gameContract);
  } else {
    console.log('Ethereum object not found');
  }
}, [ENScheck]);

const mintCharacterNFTAction = (characterId) => async () => {
  try {
    if (gameContract) {
      /*
       * Show our loading indicator
       */
      setMintingCharacter(true);
      console.log('Minting character in progress...');
      const mintTxn = await gameContract.mint(characterId);
      await mintTxn.wait();
      console.log(mintTxn);
      /*
       * Hide our loading indicator when minting is finished
       */
      setMintingCharacter(false);
      setensSVG(true);
    }
  } catch (error) {
    console.warn('MintCharacterAction Error:', error);
    /*
     * If there is a problem, hide the loading indicator as well
     */
    setMintingCharacter(false);
  }
};
  // Render Methods
  const renderCharacters = (ENScheck) =>      
        <button
          type="button"
          className="cta-button connect-wallet-button"
          onClick={mintCharacterNFTAction(ENScheck)}
        >{`Mint`}
        </button>
  if (!ensSVG) {
  return (
  <div className="select-character-container">
    <h2>Next Mint Your Phi land map.</h2>
      <div className="character-grid">{renderCharacters(ENScheck)}</div>
    {/* Only show our loading state if mintingCharacter is true */}
    {mintingCharacter && (
      
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Minting In Progress...</p>
        </div>
        <img
          src="https://media.giphy.com/media/f7b9ltJ4FrhnsKjYx2/giphy.gif"
          alt="Minting loading indicator"
        />
      </div>
    )}
  </div>
);}else {
  return (
  <div>
        <a
            className="footer-text"
            href={`https://testnets.opensea.io/assets/${DUNGEONS_CONTRACT_ADDRESS}/${ENScheck}`}
            target="_blank" rel="noopener noreferrer"
          >{`Let' see your ENS metaverse`}</a>
         </div>
          )
}


};

export default Dungeons;