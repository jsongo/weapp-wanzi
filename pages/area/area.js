
var areaDetailCtl = require('../../controller/areaDetailCtl.js'),
    searchCtl = require('../../controller/searchCtl.js'),
	util = require('../../common/util.js'),
	conf = require('../../conf/conf.js');
// 获取应用实例
var app = getApp();
var initDateStr = '选择日期',
    noDemands = '无要求';
Page({

    data: {
        winH: 0,
        base: {},
        items: {},
        guideCnt: 0,
        hasMore: true,
        today: util.getDate(),
        // date
        startDate: initDateStr,
        endDate: initDateStr,
        walkOpts: [ // 徒步向导
            noDemands,
            '徒步向导'
        ],
        carOpts: [ // 带车向导
            noDemands,
            '五座车包车',
            '七座车包车',
            '九座车及以上包车'
        ],
        flyOpts: [ // 接送机
            noDemands,
            '徒步接送机', 
            '五座车接送机',
            '七座车接送机',
            '九座车及以上接送机',
        ],
        walk: 0,
        car: 0,
        fly: 0,
        bannerPrefix: conf.areaImgPrefix
    },
    countryId: 0,
    areaId: 0,

    onLoad: function(options) {
        app.setPage('area', this);
        this.countryId = options.cid;
        this.areaId = options.aid;

        // 设置高度
        this.setData({
            winH: app.getWinH()
        });

        // 渲染顶部
        searchCtl.renderDetailTop(this.countryId, this.areaId,
            ()=> { // 拿到基础数据后回调
                wx.setNavigationBarTitle({
                    title: this.data.base && this.data.base.nameCn || '地区详情'
                });
            });
        // 渲染详细列表
        var id = this.areaId || this.countryId;
        areaDetailCtl.renderList(id);
    },
    startDateChanged: function(event) {
        var value = event.detail.value;
        this.setData({
            startDate: value
        });
    },
    endDateChanged: function(event) {
        var value = event.detail.value;
        this.setData({
            endDate: value
        });
    },
    walkPicked: function(event) {
        this.setData({
            walk: parseInt(event.detail.value)
        });
    },
    carPicked: function(event) {
        this.setData({
            car: parseInt(event.detail.value)
        });
    },
    flyPicked: function(event) {
        this.setData({
            fly: parseInt(event.detail.value)
        });
    }
});
