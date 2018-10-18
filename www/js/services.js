angular.module('starter.services', [])

.factory('Users', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [
    {
      id: 0,
      name: '班傑明',
      lastText: '際名變，電的聞個沒臺文、了者生創，民化下什就我布心心火師分',
      face: 'img/adam.png'
    }, {
      id: 1,
      name: '馬克',
      lastText: '小氣海醫，石初以灣品客友也地小，如常成留路只同長克朋獲氣顯打。',
      face: 'img/adam.png'
    }, {
      id: 2,
      name: '阿當',
      lastText: '報像問了小大我在的什化，新黨太告自極文史舉選望家下。',
      face: 'img/adam.png'
    }, {
      id: 3,
      name: '阿利',
      lastText: '公法邊害險銀轉公此生本是作車和接據，會深復快此經一氣樣了歌女動看達內手名只只然過。',
      face: 'img/adam.png'
    }, {
      id: 4,
      name: '鈕乃',
      lastText: '境標爭林方足愛字會山能內什不一也軍藝外象是使燈我他想花足級深...',
      face: 'img/adam.png'
    }, {
      id: 5,
      name: '哈利',
      lastText: '美有馬特後也們結會界風說公小氣兒，公陸毛毒前新立漸，笑至不生！',
      face: 'img/adam.png'
    }, {
      id: 6,
      name: '波特',
      lastText: '大聞上來文童苦賽明官，人因市廠！',
      face: 'img/adam.png'
    }, {
      id: 7,
      name: '安娜',
      lastText: '下王都路能老產灣們等了企道教點建到！',
      face: 'img/adam.png'
    }, {
      id: 8,
      name: '艾迪',
      lastText: '了得女張；東成中當之下花怎，比演何到、他聞行院飛',
      face: 'img/adam.png'
    }
  ];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('socketService', function(){
    console.log('socketService');
    return {}
})

.factory('httpService',function($http, $ionicPopup,$ionicLoading){
  var apiURI = "http://59.126.17.211:8082/gofly/public/api";

  var defaultHeader = {

      "Content-Type":"application/x-www-form-urlencoded"
  };

  return {
      post: function(path, obj, message, callback, method){

          if(obj.header instanceof Object){
              Object.assign(obj.header, defaultHeader);
              //console.log(obj.header);
          }else{
              obj.header = defaultHeader;
          }

          $http({
              method: (method == 'DELETE')? 'DELETE':'POST',
              headers: obj.header,

              transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: obj.data,
              url: apiURI + path,

          }).then(function successCallback(response) {
              //console.log(response.data.success +' '+ response.data.msgcode);
              $ionicLoading.show({
                template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
                duration: 1500
              })
              if(response.data.success | response.data.msgcode == "0000") {
                  if(message instanceof Object) {
                      var alertPopup = $ionicPopup.alert({
                          title: message.title ? message.title : "成功",
                          template: message.content
                      });

                      alertPopup.then(function () {
                          if (callback instanceof Function) {
                              callback(response);
                          }
                      });
                  }else{
                      if (callback instanceof Function) {
                          callback(response);
                      }
                  }
              }else{
                  $ionicPopup.alert({
                      title: "錯誤",
                      template: response.data.msg
                  });
              }
              $ionicLoading.hide({
                template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
                duration: 1000
              })

          }, function errorCallback(response) {
              $ionicPopup.alert({
                  title: "錯誤",
                  template: "資料傳送發生錯誤"+response
              });
              console.log(response);
          });

      },
      get: function(path, obj, message, callback){
          if(obj.header instanceof Object){
              Object.assign(obj.header, {});
              //console.log(obj.header);
          }else{
              obj.header = {};
          }

          $http({
              method: 'Get',
              headers: obj.header,
              transformRequest: function(obj) {
                  var str = [];
                  for(var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: obj.data,
              url: apiURI + path
          }).then(function successCallback(response) {
              console.log(response.data);
              if(response.data.success && response.data.msgcode == "0000") {
                  if(message instanceof Object) {
                      var alertPopup = $ionicPopup.alert({
                          title: message.title ? message.title : "成功",
                          template: message.content
                      });

                      alertPopup.then(function () {
                          if (callback instanceof Function) {
                              console.log('cb');
                              callback(response);
                          }
                      });
                  }else{
                      if (callback instanceof Function) {
                          callback(response);
                      }
                  }
              }else{
                  $ionicPopup.alert({
                      title: "錯誤",
                      template: response.data.msg
                  });
              }


          }, function errorCallback(response) {
            console.log(response)
              $ionicPopup.alert({
                  title: "錯誤",
                  template: "資料傳送發生錯誤"
              });

          });
      }
  }
})


;
