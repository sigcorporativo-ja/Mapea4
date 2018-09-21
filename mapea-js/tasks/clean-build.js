const path = require('path');
const fs = require('fs-extra');
const { argv } = require('yargs');

const pathFolder = argv.path;
const folderToRemove = path.resolve(__dirname, '..', pathFolder);
fs.removeSync(folderToRemove);
console.log(`clean-build task: Remove folder ${folderToRemove}`);
