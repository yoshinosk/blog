const { setting } = require('../config')

module.exports = {
    getArticleCover(val){
        if(!val) return setting.site.articleCover;
        else return val.includes('http') ? val : new URL(val,global.HOST).toString();
    }
}