const path = require('path');
const fs = require('fs');
const fileUtil = require('../util/fileUtil');
let config = fileUtil.json5Require(path.resolve('./jmockr.config.json'));
const envData = JSON.parse((fs.readFileSync('./.env')).toString())
config.authConfig.entranceEnv = config.authConfig.entranceEnv || envData.entranceEnv
config.proxyConfig.enable = config.proxyConfig.enable || envData.isProxy
module.exports = config;
