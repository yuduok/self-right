// here store all the params

import { ec as EC } from 'elliptic';

// Create an elliptic curve instance (using secp256k1 curve as an example)
const ec = new EC('secp256k1');

// Generate key pair
const keyPair = ec.genKeyPair();

// Get curve parameters
const curve = ec.curve;

// Export parameters
export const params = {
  P: curve.p,  // Prime p
  a: curve.a,  // Coefficient a
  b: curve.b,  // Coefficient b
  G: curve.g,  // Base point G
  n: curve.n,  // Order n
  equation: (x, y) => {
    return y.pow(2).sub(x.pow(3).add(curve.a.mul(x)).add(curve.b)).mod(curve.p);
  },
  isOnCurve: (x, y) => {
    return curve.validate(x, y);
  }
};

// Export public and private keys if needed
export const publicKey = keyPair.getPublic();
export const privateKey = keyPair.getPrivate();