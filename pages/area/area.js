
var areaDetailCtl = require('../../controller/areaDetailCtl.js'),
	conf = require('../../conf/conf.js');
// 获取应用实例
var app = getApp();
Page({

    data: {
        winH: 0,
        base: {},
        detail: {}
    },
    base: null,

    onLoad: function(options) {
        app.setPage('country', this);
        var countryId = options.id,
            base = {
                img: conf.areaImgPrefix + countryId + '.jpg'
            }

        // 设置高度
        this.setData({
            winH: app.getWinH()
        });

        areaDetailCtl.renderDetail(countryId);
    },

    setBaseData: function(obj) {
        this.base = obj;
    }
});
