const Setting = require('../../model/setting.model');

module.exports.general = async (req, res, next) => {
    const setting = await Setting.findOne({});
    
    res.locals.settingGeneral = setting;

    next();
}