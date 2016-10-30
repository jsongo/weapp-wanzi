module.exports = {
    splash: '../../res/splash/splash0.jpg',
    splashes: [
        '../../res/splash/splash1.jpg',
        '../../res/splash/splash2.jpg',
        '../../res/splash/splash3.jpg',
        '../../res/splash/splash4.jpg'
    ],
    homeOrder: [2, 1, 4, 3, 5, 6],
    countryOrder: ['zhongguo', 'xianggang', 'aomen', 'taiwan'],
    splashDuration: 3000, // ms
    apiDomain: 'http://base.wanzi.cc/',
    api: {
        home: 'content/getChannelContent',
        countries: 'area/getAreaAll',
        areaDetail: 'service/searchList'
    },
    storeKeys: {
        guide: (id)=>{return 'guide#'+id;},
        area: (id, index=0)=>{return 'area#' + id + '#' + index;},
        areaCnt: (id)=>{return 'area-cnt#' + id;}
    },
    // image prefix
    imgPrefix: 'http://img.wanzi.cc/images/',
    flagImgPrefix: 'http://wanzi.cc/mobile/public/images/Flag/',
    areaImgPrefix: 'http://base.wanzi.cc/static/areas/',
    guidePrefix: 'https://wanzi-image-alimmdn-com.alikunlun.com/images/',
};