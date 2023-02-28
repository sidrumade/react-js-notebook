import crypto from 'crypto';
function generateHash() {
  const hash = crypto.randomBytes(4).toString('hex');
  return hash;
}

console.log(generateHash()); // Example output: "a1b2c3d4"

export default generateHash;
