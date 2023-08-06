import { v4 as uuidv4 } from 'uuid';

function generateHash() {
  const hash = uuidv4().replace(/-/g, ''); // Remove dashes from the UUID to get a hash-like string
  return hash;
}

console.log(generateHash()); // Example output: "a1b2c3d4"

export default generateHash;









// import crypto from 'crypto';
// function generateHash() {
//   const hash = crypto.randomBytes(4).toString('hex');
//   return hash;
// }

// console.log(generateHash()); // Example output: "a1b2c3d4"

// export default generateHash;
