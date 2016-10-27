
var app = getApp();
var net = require('../common/net.js'),
	util = require('../common/util.js'),
	conf = require('../conf/conf.js');

module.exports = {
    limit: 30,
    reqData: function(areaId, pageNo=0){
        var url = conf.apiDomain + conf.api.areaDetail,
            data = {
                offset: pageNo * this.limit,
                limit: this.limit,
                start: '',
                end: '',
                keyword: areaId,
                sp: 0,
                time: util.getTime()
            };
        net.post({
            url: url,
            data: data,
            success: (data) => {
                this.renderDetail(data);
            }
        })
    },
    renderDetail: function(data){
        var count = data.count,
            list = data.result;

    },
};