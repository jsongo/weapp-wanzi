
var conf = require('../../conf/conf.js');
//获取应用实例
var app = getApp();
Page({
    data: {
        winH: 0,
        splashes: []
    },
    onLoad: function() {
        var used = wx.getStorageSync('used'),
            splashes = null;
        if (!used) {
            splashes = conf.splashes;
            splashes.push('');
        }
        else {
            splashes = [conf.splash];
            setTimeout(()=>{
                this.navToHome();
            }, conf.splashDuration);
        }
        
        wx.getSystemInfo({
            success: ( res )=> {
                this.setData({
                    winH: res.windowHeight,
                    splashes: splashes
                });
                app.setWinH(res.windowHeight);
                /*try {
                    wx.setStorageSync('used', 'yes');
                }
                catch (ex) {
                    console.log(ex);
                }*/
                wx.setStorage({
                    key: 'used',
                    data: 'yes',
                    success: function(res) {
                        console.log('tag stored. ' + res.data);
                    },
                    fail: function(err) {
                        console.log('error ' + err);
                    }
                });
            }
        });
    },
    swiperChange: function(event){
        var index = event.detail.current;
        if (index === this.data.splashes.length-1) {
            this.navToHome();
        }
    },
    navToHome: function(){
        wx.redirectTo({
            url: '../index/index'
        });
    }
});