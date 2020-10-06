const fs = require('fs');

let wordfile = fs.readFileSync('words.json');
const wordlist = JSON.parse(wordfile).words;

module.exports = wordlist;

