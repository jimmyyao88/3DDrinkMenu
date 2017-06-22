
var Index = require('../controller/Index');

module.exports=function(app){
  app.get('/p/:name',Index.showIndex);
  app.get('/wechatcallback',Index.codeCallback);
  app.get('/',Index.showBar);
  app.post('/jssdk',Index.getToken);

};
