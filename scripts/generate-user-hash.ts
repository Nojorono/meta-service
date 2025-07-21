import * as bcrypt from 'bcrypt';

/**
 * Utility script to generate password hashes for SOFIA users
 * Run this with: npx ts-node scripts/generate-user-hash.ts
 */

async function generateHash(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  const password = process.argv[2] || 'password123';

  console.log('Generating password hash for:', password);

  try {
    const hash = await generateHash(password);
    console.log('Generated hash:', hash);

    // Verify the hash works
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash verification:', isValid ? 'VALID' : 'INVALID');

    console.log('\nSQL INSERT example:');
    console.log(
      `INSERT INTO sofia_users (username, email, password_hash, full_name, role, status)`,
    );
    console.log(
      `VALUES ('user@sofia.com', 'user@sofia.com', '${hash}', 'Sample User', 'user', 'ACTIVE');`,
    );
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

main();
