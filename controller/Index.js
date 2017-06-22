var request = require('request');
var qs = require('querystring');
var sha1 = require('sha1');
exports.showIndex = function(req,res){
  // res.render('../public/index.html',{
  // })
  console.log('req.params.name',req.params.name)
  if(req.params.name){
    var url="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf12ac78e8de1c160&redirect_uri=http://weixin.okjuke.com/wechatcallback?name="+req.params.name+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
    res.redirect(url);
  }

};

exports.showBar = function(req,res){
  res.render('index',{
  })
}
// exports.getCode=function(req,res){
//   var url="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf12ac78e8de1c160&redirect_uri=http://www.okjuke.com/wechatcallback&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
//   res.redirect(url);
// };
exports.codeCallback=function(req,res){
  console.log('wechat,codeCallback')
  var secret = "6d8a8b8fc5c380348efc0686406a05bb";
  var barName = req.query.name;
  console.log('barName',barName);
  var appid = "wxf12ac78e8de1c160";
  request('https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appid+'&secret='+secret+'&code='+req.query.code+'&grant_type=authorization_code', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(body);
      var refresh_token = json.refresh_token;
      request('https://api.weixin.qq.com/sns/oauth2/refresh_token?appid='+appid+'&grant_type=refresh_token&refresh_token='+ refresh_token, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var refreshTokenBody = JSON.parse(body);
          var access_token = refreshTokenBody.access_token;
          var openId = refreshTokenBody.openid;
          console.log('openId',openId);
          request('https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openId+'&lang=zh_CN', function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var userInfo = JSON.parse(body);
              res.redirect('/#/'+barName+'?avatar='+userInfo.headimgurl+'&name='+userInfo.nickname);
            }
          })
        }
      })
    }
  })
};



exports.getToken=function(req,httpResponse) {
  var pageUrl = req.body.url
  var getNonceStr = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  var getTimestamp = function(){
    return new Date().valueOf();
  }
  var getJsApiTicketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='
  var appid = 'wxf12ac78e8de1c160'
  var secret = '6d8a8b8fc5c380348efc0686406a05bb'
  var queryParams = {
    'grant_type': 'client_credential',
    'appid': appid,
    'secret': secret
  };

  var wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token?'+qs.stringify(queryParams);
  var options = {
    method: 'GET',
    url: wxGetAccessTokenBaseUrl
  };

    request(options, function (err, res, body) {
      if (res) {
        var body = JSON.parse(body)
        var token = body.access_token;
        var options = {
         method: 'get',
         url: getJsApiTicketUrl+token+'&type=jsapi'
       };
       request(options, function (err, res, body) {
          console.log('body',JSON.parse(body));
          var body = JSON.parse(body);
          var ticket = body.ticket ;
          var noncestr = getNonceStr();
          var timestamp = getTimestamp();
          var data = {
            'jsapiTicket': ticket,
            'noncestr': noncestr,
            'timestamp': timestamp,
            'url': pageUrl
          };
          console.log('data',data);
          var sortData = "jsapi_ticket=" + data.jsapiTicket + "&noncestr=" + data.noncestr + "&timestamp=" + data.timestamp + "&url=" + data.url;
          var signature = sha1(sortData);
          console.log('signature',signature);
          console.log('data',data.noncestr);
          console.log('timestamp',data.timestamp);
          httpResponse.send({
            signature:signature,
            timestamp:data.timestamp,
            nonceStr:data.noncestr,
          })
        });
      }
    });
}
