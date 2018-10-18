angular.module('starter.first.controllers', [])
  .controller('FirstCtrl', function ($scope,$ionicLoading,  $http,$state, $rootScope, $timeout, $ionicSlideBoxDelegate, $ionicModal) {

    $rootScope.user = {
      "Device-Id": "",
      "Talk-Token": "",
      "Api-Token": ""
    };
    console.log("FirstCtrl");

    var DeviceId = localStorage.getItem("Device-Id");
    var ApiToken = localStorage.getItem("Api-Token");
    var TalkToken = localStorage.getItem("Talk-Token");
    var URI="http://59.126.17.211:8082/gofly/public/api"
    var path="/friends/userList"
    var getAuth=function(){
        $http({
          method:'Get',
          headers: {
            "Content-Type":"application/json",
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
          },
          url:URI+path
        }).then(function successCallback(response){
          console.log(response);
          $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
            duration: 2000
          });
          $state.go("tab.index");
          $ionicLoading.hide({
            template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
            duration: 1000
          });
        }, function errorCallback(response) {
          console.log(response);
          if(response.data.msgcode == "401"){

          console.log("401");
          $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
            duration: 1000
          });
            $state.go("welcome",{reload: true});
            $ionicLoading.hide({
              template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
              duration: 1000
            });
          }else{
            $ionicPopup.alert({
              title: "錯誤",
              template: "資料傳送發生錯誤"
          });
          }


      });
    };
    var AutoLogin = function () {

      if (DeviceId != "") {
        localStorage.setItem('Api-Token', ApiToken);
        localStorage.setItem('Talk-Token', TalkToken);
        localStorage.setItem('Device-Id', DeviceId);
        console.log(DeviceId);
        console.log(ApiToken);
        console.log(TalkToken);
        getAuth();

      } else {
        console.log(DeviceId);
        console.log(ApiToken);
        console.log(TalkToken);

      }
    }
    AutoLogin();

  });
