import { params } from "./params";

// generate a key pair
function generateKeyPair(){
    const privateKey = Math.floor(Math.random() * (params.n - 1)) + 1;
    const publicKey = scalarMult(privateKey, params.G);
    return {privateKey, publicKey}
}

// Scalar multiplication function
function scalarMult(k, point){
    let result = {x:0, y:0};
    let current = {...point};
    for(let i = 0; i < k; i++){
        result = addPoints(result, current);
    }
    return result
}

// Point addition function
function addPoints(p1, p2){
    if(p1.x === 0 && p1.y === 0) return p2;
    if(p2.x === 0 && p2.y === 0) return p1;

    // Check if points are the same (point doubling)
    if (p1.x === p2.x && p1.y === p2.y) {
        return doublePoint(p1);
    }

    // Calculate the slope
    let m = ((p2.y - p1.y) * modInverse(p2.x - p1.x, params.P)) % params.P;
    if (m < 0) m += params.P;

    // Calculate new point
    let x3 = (m * m - p1.x - p2.x) % params.P;
    if (x3 < 0) x3 += params.P;
    let y3 = (m * (p1.x - x3) - p1.y) % params.P;
    if (y3 < 0) y3 += params.P;

    return { x: x3, y: y3 };
}

// Point doubling function
function doublePoint(p) {
    if (p.y === 0) return {x: 0, y: 0}; // Point at infinity

    // Calculate the slope
    let m = ((3 * p.x * p.x + params.a) * modInverse(2 * p.y, params.P)) % params.P;
    if (m < 0) m += params.P;

    // Calculate new point
    let x3 = (m * m - 2 * p.x) % params.P;
    if (x3 < 0) x3 += params.P;
    let y3 = (m * (p.x - x3) - p.y) % params.P;
    if (y3 < 0) y3 += params.P;

    return { x: x3, y: y3 };
}

// Modular inverse function
function modInverse(a, m) {
    let [old_r, r] = [a, m];
    let [old_s, s] = [1, 0];

    while (r !== 0) {
        const quotient = Math.floor(old_r / r);
        [old_r, r] = [r, old_r - quotient * r];
        [old_s, s] = [s, old_s - quotient * s];
    }

    return (old_s + m) % m;
}

export default generateKeyPair;