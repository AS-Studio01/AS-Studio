#!/usr/bin/env node
import readline from 'node:readline';
import { hashPassword } from '../lib/core.js';

function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stderr,
      terminal: true
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const argPassword = process.argv[2];
  const password = argPassword || (await promptHidden('Enter admin password (min 8 chars): '));
  if (!password || password.length < 8) {
    console.error('Error: password must be at least 8 characters.');
    process.exit(1);
  }
  const hash = hashPassword(password.trim());
  console.log('\nAdd this to your .env or Vercel environment variables:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
