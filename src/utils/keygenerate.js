import { params } from "./params";
import crypto from 'crypto';

// generate a key pair
function generateKeyPair(){
    const privateKey = generateSecureRandomNumber(params.n);
    const publicKey = scalarMult(privateKey, params.G);
    return {privateKey, publicKey}
}

function generateSecureRandomNumber(max) {
    const bytes = crypto.randomBytes(32);
    let num = BigInt(`0x${bytes.toString('hex')}`);
    return num % (BigInt(max) - 1n) + 1n;
}

// Scalar multiplication function
function scalarMult(k, point){
    let result = {x: 0n, y: 0n};
    let addend = {...point};
    k = BigInt(k);

    while (k > 0n) {
        if (k & 1n) {
            result = addPoints(result, addend);
        }
        addend = doublePoint(addend);
        k >>= 1n;
    }

    return result;
}

// Point addition function
function addPoints(p1, p2){
    if(p1.x === 0n && p1.y === 0n) return p2;
    if(p2.x === 0n && p2.y === 0n) return p1;

    // Check if points are the same (point doubling)
    if (p1.x === p2.x && p1.y === p2.y) {
        return doublePoint(p1);
    }

    // Calculate the slope
    let m = ((BigInt(p2.y) - BigInt(p1.y)) * modInverse(BigInt(p2.x) - BigInt(p1.x), BigInt(params.P))) % BigInt(params.P);
    if (m < 0n) m += BigInt(params.P);

    // Calculate new point
    let x3 = (m * m - BigInt(p1.x) - BigInt(p2.x)) % BigInt(params.P);
    if (x3 < 0n) x3 += BigInt(params.P);
    let y3 = (m * (BigInt(p1.x) - x3) - BigInt(p1.y)) % BigInt(params.P);
    if (y3 < 0n) y3 += BigInt(params.P);

    return { x: x3, y: y3 };
}

// Point doubling function
function doublePoint(p) {
    if (p.y === 0n) return {x: 0n, y: 0n}; // Point at infinity

    // Calculate the slope
    let m = ((3n * BigInt(p.x) * BigInt(p.x) + BigInt(params.a)) * modInverse(2n * BigInt(p.y), BigInt(params.P))) % BigInt(params.P);
    if (m < 0n) m += BigInt(params.P);

    // Calculate new point
    let x3 = (m * m - 2n * BigInt(p.x)) % BigInt(params.P);
    if (x3 < 0n) x3 += BigInt(params.P);
    let y3 = (m * (BigInt(p.x) - x3) - BigInt(p.y)) % BigInt(params.P);
    if (y3 < 0n) y3 += BigInt(params.P);

    return { x: x3, y: y3 };
}

// Modular inverse function
function modInverse(a, m) {
    let [old_r, r] = [BigInt(a), BigInt(m)];
    let [old_s, s] = [1n, 0n];

    while (r !== 0n) {
        const quotient = old_r / r;
        [old_r, r] = [r, old_r - quotient * r];
        [old_s, s] = [s, old_s - quotient * s];
    }

    return (old_s + m) % m;
}

export default generateKeyPair;