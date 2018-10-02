const fse = require('fs-extra');
const path = require('path');

const LEGACY_PATH = path.resolve(__dirname, '..', '..', 'mapea-legacy');
const DIST_PATH = path.resolve(__dirname, '..', 'dist');

fse.ensureDirSync(DIST_PATH);
fse.copySync(LEGACY_PATH, DIST_PATH);
