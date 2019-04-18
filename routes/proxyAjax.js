const proxyCfg = require('../scanner/config').proxyConfig;
const cfg = require('../scanner/index').authConfig;
const authTool = require('../auth/cas');
const logUtil = require('../util/logUtil');

let urlRoot = `${proxyCfg.protocol}://${proxyCfg.useIP ? proxyCfg.ip : proxyCfg.domain}`;

if (proxyCfg.enablePort) urlRoot += `:${proxyCfg.port || ''}`;

function init(app) {
    authTool.login()
        .then((superagent) => {
            app.use((req, res) => {
                var m = req.method.toLowerCase();
                var url = `${urlRoot}${req.path}`;
                console.info(url);
                logUtil.logRequest(req);
                superagent[m](url)
                    .set({
                        entranceEnv: cfg.entranceEnv || '',
                        Accept: req.get('Accept'),
                        'Content-Type': req.get('Content-Type'),
                        'User-Agent': req.get('User-Agent'),
                        'X-Requested-With': req.get('X-Requested-With') || 'XMLHttpRequest',
                        'Accept-Language': req.get('Accept-Language'),
                        'Accept-Encoding': req.get('Accept-Encoding'),
                    })
                    .query(req.query)
                    .send(req.body)
                    .end((err, sres) => {
                        if (err) {
                            console.info('Error in sres');
                            res.status(500)
                                .json({
                                    retCode: 500,
                                    retDesc: 'proxy Error'
                                });
                        } else {
                            console.info('Response arrived.');
                            try {
                                res.json(JSON.parse(sres.text));
                            } catch(e) {
                                
                            }
                        }
                    });
            });
        })
        .catch((err) => {
            console.info('Login CAS error.');
            console.info(err);
        });
}

module.exports = {
    init
};
