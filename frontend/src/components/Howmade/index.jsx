import React from 'react';
import './Howmade.css';

const Howmade = () => {
  return (
   <div>
      <div className="stext">Appeal Points</div>
      <p/>
      <div className="sub-sub-sub-text">Contract-Centric Design in which our contract is responsible for generating subdomains and NFTs </div>
      <div className="sub-sub-sub-text">Generation of Land NFTs using random elements of TokenID and block number, conditional on the subdomain. </div>
      <div>
      <a
            className="sub-sub-text"
            href="https://showcase.ethglobal.com/nfthack2022/phi-land"
            target="_blank" rel="noopener noreferrer"
          >{`detail more here...`}</a>
        </div>
 </div>

   
  );
};

export default Howmade;
