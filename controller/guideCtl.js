
var app = getApp(),
    net = require('../common/net.js'),
    util = require('../common/util.js'),
	conf = require('../conf/conf.js');

// Guide要经常生成新的，内容比较多，定义成class方便一些
module.exports = class Guide {

    constructor(uid) {
        this.loading = false;
        this.uid = uid;
        this.guide = {}; // 导游详情
        this.photos = null; // 我的相册
        this.spots = null;
        this.page = app.getPage('guide');
    }

    render() {
        var key = conf.storeKeys.guide(this.uid);
        this._renderFromCache_(
            ()=>{
                // fetch basic data
                var api = conf.api.userDetail + this.uid;
                new Promise((resolve, reject)=>{
                    this._fetchAndRender_(api, (data)=>{
                        this._renderDetail_(data);
                        resolve();
                    });
                })
                .then(()=>{
                    // fetch albums
                    var api2 = conf.api.album + this.uid;
                    return new Promise((resolve, reject)=>{ // 需要一个promise来阻塞下一个then
                        this._fetchAndRender_(api2, (data2)=>{
                            this._renderAlbum_(data2.result);
                            resolve();
                        });
                    });
                })
                .then(()=>{
                    var api3 = conf.api.points,
                        reqData = {
                            offset: 0,
                            limit: 10000,
                            pt_user: this.uid,
                            pt_status: 0,
                            time: util.getTime()
                        };
                    return new Promise((resolve, reject)=>{ // 需要一个promise来阻塞下一个then
                        this._fetchAndRender_(api3, (data3)=>{
                            this._renderSpots_(data3);
                            resolve();
                        }, {
                            method: 'post',
                            data: reqData
                        });
                    });
                })
                .then(()=>{
                    // 更新storage
                    wx.setStorage({
                        key: conf.storeKeys.guide(this.uid),
                        data: this.guide
                    });
                });
            }
        );
    }

    _renderFromCache_(callback) { // callback -> called when missed the cache
        wx.getStorage({
            key: conf.storeKeys.guide(this.uid),
            success: (data) => {
                if (data.errMsg && data.errMsg.indexOf('ok') > -1) {
                    this._renderDetail_(data.data, true);
                }
                else {
                    callback && callback.call(null);
                }
            },
            fail: ()=>{
                callback && callback.call(null);
            }
        });
    }
    
    _fetchAndRender_(api, callback, opt) { // 共用的方法
        if (this.loading) {
            console.log('Prevented for the other request is processing...');
            return;
        }

        this.loading = true;

        // 显示标题栏的加载图标
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });

        var url = conf.apiDomain + api;

        // request
        var request = null;
        if (opt && opt.method === 'post') {
            request = net.post;
        }
        else {
            request = net.get;
        }
        var data = opt && opt.data || null;
        request({
            url: url,
            data: data,
            success: (data) => {
                this.loading = false;
                callback && callback.call(this, data.result);
            },
            complete: () => {
                this.loading = false;
                wx.hideToast();

                // 隐藏标题栏的加载图标
                wx.hideNavigationBarLoading();
                
                // 停止下拉的加载图标，可以在网络加载完时调用
                wx.stopPullDownRefresh();
            }
        });
    }
    _renderDetail_(data, formated) { // formated表示数据是否被格式化过，默认无
        if (!formated) {
            Object.assign(this.guide, this._formatInfo_(data));
        }
        else {
            Object.assign(this.guide, data);
        }
        // 设置标题
        wx.setNavigationBarTitle({
            title: this.guide.name
        });
        this.page.setData({
            guide: this.guide
        });
    }

    _renderAlbum_(data) {
        // data is raw
        var newData = {};
        for (var item of data) {
            var type = item.al_type,
                count = parseInt(item.al_count),
                key = '';
            switch(type) {
                case '1': 
                    key = 'myPhoto';
                    break;
                case '2':
                    key = 'traveller';
                    break;
                case '3':
                    key = 'scenery';
                    break;
                case '4':
                    key = 'carImg';
                    break;
            }
            if (item.al_status === '1' && key && count > 0) {
                newData[key] = {
                    img: item.al_face,
                    cnt: count,
                    id: item.al_id
                }
            }
        }
        Object.assign(this.guide, newData);
        this.photos = newData;
        this.page.setData({
            guide: this.guide
        });
    }

    _renderSpots_(data) {
        var newData = [];
        if (!this.spots) {
            this.spots = [];
        }
        var cnt = 3; // 最多三个
        for (var item of data) {
            if (cnt-- < 0) {
                break;
            }
            newData.push({id: item.pt_id, img: item.pt_face});
            this.spots.push(this._formatSpot_(item));
        }
        this.guide['recommends'] = newData;
        this.page.setData({
            guide: this.guide
        });
    }

    _formatSpot_(data) {
        return {
            img: data.pt_face,
            desc: data.pt_content,
        }
    }
    
    _formatInfo_(data){
        var item = {};

        // intro
        var shortIntro = '';
        if (data.content && data.content.count > 0) {
            for (var item of data.content.result) {
                if (!shortIntro && item.note_type === '2') {
                    shortIntro = item.note_content.substr(0, 60) + '...';
                }
            }
        }
        var localTime = util.formatSecondsSimply(data.ser_utime);

        return {
            id: this.uid,
            userBg: data.ser_face,
            addr: data.guide && (data.guide.gd_city || data.guide.gd_country) || '',
            verifiedImg: data.ser_avatar,
            localTime: localTime,
            priority: data.guide && data.guide.gd_accept || '暂无信息',
            notAccept: data.guide && data.guide.gd_refuse || '暂无信息',
            name: data.users && data.users.user_name || '丸子',
            job: data.guide && data.guide.gd_job,
            avatar: data.users && data.users.user_avatar || '../../res/img/default.jpg',
            introShort: shortIntro,
            refund: {
                id: data.ser_refund,
                desc: conf.refunds[data.ser_refund]
            },
            acceptRate: parseInt(data.ser_accept||0) || '待统计',
            replyRate: parseInt(data.ser_accept||0) || '待统计',
            avgReplyTime: parseInt(data.ser_accept||0) || '待统计',
        };
    }

}