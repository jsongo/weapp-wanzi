
var app = getApp();
var net = require('../common/net.js'),
	util = require('../common/util.js'),
	conf = require('../conf/conf.js');

module.exports = {
    limit: 30,
    guides: null,
    total: -1, // 列表的长度
    areaId: 0, // maybe a country id or and area id

    reqData: function(pageNo, callback){
        var url = conf.apiDomain + conf.api.areaDetail,
            data = {
                offset: pageNo * this.limit,
                limit: this.limit,
                start: '',
                end: '',
                keyword: this.areaId, 
                sp: 0,
                time: util.getTime()
            };
        net.post({
            url: url,
            data: data,
            success: (data) => {
                callback && callback.call(this, data);
            }
        });
    },
    renderEachItem: function(){
        var page = app.getPage('area'),
            more = true;
        if (this.guides.length >= this.total) {
            more = false;
        }
        page.setData({
            hasMore: more,
            guideCnt: this.total,
            items: this.guides
        });
    },
    prepareData: function(data){
        var list = data.result;
        for (var k in list) {
            var item = list[k];
            item = this.formatItem(item);
            if (item) {
                this.guides.push(item);
            }
        }
        // 存到storage中
        wx.setStorage({
            key: conf.storeKeys.area(this.areaId, 0),
            data: this.guides
        });
    },
    formatItem: function(item){
        /*if (item.ser_status != '1') { // 过滤status
            return;
        }*/
        return {
            bg: conf.guidePrefix + item.ser_face,
            avatar: conf.guidePrefix + item.user_avatar,
            name: item.user_name,
            job: item.gd_job,
            title: item.ser_title,
            status: parseInt(item.ser_status||0),
            id: item.user_id,
            commentCnt: parseInt(item.ser_rmkc||0),
            area: item.area_name
        }
    },
    checkData: function(callback){
        // load from the cache
        var key = conf.storeKeys.area(this.areaId); // 0
        this.guides = wx.getStorageSync(key);
        key = conf.storeKeys.areaCnt(this.areaId);
        this.total = wx.getStorageSync(key);

        if (this.guides && this.total > -1) {
            return true;
        }
        else {
            return false;
        }
    },
    renderList: function(areaId) {
        this.areaId = areaId;
        if(!this.checkData()) {
            this.guides = [];
            this.reqData(0, (data)=>{
                // 存个数
                this.total = data.count;
                wx.setStorageSync(conf.storeKeys.areaCnt(this.areaId), this.total);

                this.prepareData(data); // 格式化数据
                this.renderEachItem();
            });
        }
        else {
            this.renderEachItem();
        }
    }
};