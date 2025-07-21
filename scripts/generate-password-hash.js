/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt');

// Password to hash
const passwords = ['password123', 'admin123', 'user123'];

async function generateHashes() {
  console.log('Generating password hashes...\n');

  for (const password of passwords) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}\n`);
  }
}

generateHashes().catch(console.error);
