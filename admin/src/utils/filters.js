export default{
    imgUrl(src){
        if(!src) return '';
        return src.indexOf('http') > -1 ? src : new URL(src,process.env.VUE_APP_BASE_URL).toString();
    }
}