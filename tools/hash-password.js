#!/usr/bin/env node
/**
 * Generate ADMIN_PASSWORD_HASH for .env
 *
 *   node tools/hash-password.js
 *
 * Paste the output into your Vercel environment variables.
 * The plaintext password is never stored anywhere.
 */
'use strict';

const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });

process.stdout.write('Choose an admin password (min 12 chars, input hidden):\n');

// hide input
const stdin = process.stdin;
stdin.setRawMode && stdin.setRawMode(true);

let pwd = '';
rl.question('', () => {});           // keep the interface quiet
stdin.on('data', function (chunk) {
  const s = chunk.toString('utf8');
  for (const ch of s) {
    if (ch === '\r' || ch === '\n') {
      stdin.setRawMode && stdin.setRawMode(false);
      stdin.pause();
      if (pwd.length < 12) {
        console.error('\n✗ Too short. Use at least 12 characters.');
        process.exit(1);
      }
      const salt = crypto.randomBytes(24);
      const hash = crypto.scryptSync(pwd, salt, 64, { N: 16384, r: 8, p: 1 });
      console.log('\n\nADMIN_PASSWORD_HASH=scrypt$' + salt.toString('hex') + '$' + hash.toString('hex'));
      console.log('\nStore this in Vercel → Settings → Environment Variables.');
      console.log('Also set ADMIN_EMAIL and ADMIN_SESSION_SECRET (32+ random chars).\n');
      process.exit(0);
    } else if (ch === '\u0003') {
      process.exit(1);
    } else if (ch === '\u007f') {
      pwd = pwd.slice(0, -1);
    } else {
      pwd += ch;
    }
  }
});
