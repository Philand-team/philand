const COUNTRY_CONTRACT_ADDRESS = '0x089587aa91Af2508c6ab3eD7d0dD5Af377794F7d';
const SUBDOMAIN_CONTRACT_ADDRESS = '0xdd4cC1a4daF871f0894Ed14BbAe22c0EABCE98C8';
const DUNGEONS_CONTRACT_ADDRESS = '0xf9b078e5A5e1e15EcEE5d982A586BaE254094545';
/*
 * Add this method and make sure to export it on the bottom!
 */
const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { COUNTRY_CONTRACT_ADDRESS,SUBDOMAIN_CONTRACT_ADDRESS,DUNGEONS_CONTRACT_ADDRESS, transformCharacterData };