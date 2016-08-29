var ConfigItem = require('../models/ConfigItem.js');
var config = require('../lib/config.js');
var router = require('express').Router();
var _ = require('lodash');

router.get('/api/config', function (req, res) {
    res.json({
        err: null,
        config: config.getAllValues()
    });
})

router.get('/api/config-items', function (req, res) {
    var configItems = _.cloneDeep(ConfigItem.findAll());
    configItems = configItems.map(function (item) {
        if (item.sensitive) {
            item.effectiveValue = '**********';
            item.dbValue = '**********';
            item.default = '**********';
            item.envValue = '**********';
            item.cliValue = '**********';
            item.savedCliValue = '**********';
        }
        return item;
    });
    res.json({
        configItems: configItems
    });
})

router.post('/api/config-values/:key', function (req, res) {
    var key = req.params.key;
    var value = req.body.value;
    var configItem = ConfigItem.findOneByKey(key);
    configItem.setDbValue(value);
    configItem.save(function (err) {
        if (err) return res.json({error: err});
        return res.json({success: true});
    });
})

router.get('/config-values', function (req, res) {
    return res.render('react-applet', {
        pageTitle: "Configuration"
    });
});

module.exports = router;