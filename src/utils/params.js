// here storee all the params

// prime number
const P = 23

// equation coefficients y^2 = x^3 + ax + b % p
const a = 1
const b = 0

//base point
const G = {
  x: 13,
  y: 7
}

// base point order
const n = 23

const equation = (x,y)=>{
  return (y**2 - (x**3 + a*x + b)) % P
}

const isOnCurve = (x, y) => {
  if (x === null || y === null || isNaN(x) || isNaN(y)) return false;
  x = ((x % P) + P) % P;  // Ensure x is in the correct range
  y = ((y % P) + P) % P;  // Ensure y is in the correct range
  const left = (y * y) % P;
  const right = (x * x * x + a * x + b) % P;
  return left === right;
}

export const params = {
  P,
  a,
  b,
  G,
  n,
  equation,
  isOnCurve
}