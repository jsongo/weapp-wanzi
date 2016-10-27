//app.js
App({
    onLaunch: function() {
    },
    globalData: {
        winH: 600,
        pages: {
            index: null
        }
    },
    setWinH: function(winH){
        this.globalData.winH = winH;
    },
    getWinH: function(){
        return this.globalData.winH;
    },
    getPage: function(name) {
        return this.globalData.pages[name];
    },
    setPage: function(name, page) {
        this.globalData.pages[name] = page;
    }
})