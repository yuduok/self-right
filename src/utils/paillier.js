const paillier = require('paillier-js');

async function getOrGenerateKeys() {
  const storedPublicKey = localStorage.getItem('paillierPublicKey');
  const storedPrivateKey = localStorage.getItem('paillierPrivateKey');

  if (storedPublicKey && storedPrivateKey) {
    console.log('Keys already exist in localStorage');
    return {
      publicKey: JSON.parse(storedPublicKey),
      privateKey: JSON.parse(storedPrivateKey)
    };
  }

  const { publicKey, privateKey } = await paillier.generateRandomKeys(3072);
  localStorage.setItem('paillierPublicKey', JSON.stringify(publicKey.toString()));
  localStorage.setItem('paillierPrivateKey', JSON.stringify(privateKey.toString()));
  console.log('New keys generated and stored in localStorage');
  return { publicKey, privateKey };
}

getOrGenerateKeys().then(({ publicKey, privateKey }) => {
  console.log('Keys are ready for use');
});