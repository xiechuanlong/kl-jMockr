const path = require('path');
const fs = require('fs');
const fileUtil = require('../util/fileUtil');
const { isUndefined} = require('../util/typeUtil');
let config = fileUtil.json5Require(path.resolve('./jmockr.config.json'));
const envData = JSON.parse((fs.readFileSync('./.env')).toString())
if(isUndefined(config.authConfig.entranceEnv)) {
    config.authConfig.entranceEnv = envData.entranceEnv
}
if(isUndefined(config.proxyConfig.enable )) {
    config.proxyConfig.enable = config.proxyConfig.enable || envData.isProxy
}
console.log(config, 5555555555555555)
module.exports = config;
