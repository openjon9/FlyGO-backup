angular.module('starter.mydramaDetail.controllers', [])
  .controller('MyDramaDetailCtrl', function ($rootScope, $http, $state, $cordovaCamera, $scope, $ionicModal, $ionicPopup, httpService, $ionicLoading, $ionicScrollDelegate, $timeout, $filter, $ionicActionSheet, $cordovaFileTransfer, $stateParams) {
    console.log("MyDramaDetailCtrl", $stateParams.id);
    $scope.LocationDetail = [];
    $scope.key = [];

    $scope.weather = [
      { key: "豔陽", value: 1 }, { key: "晴天", value: 2 }, { key: "多雲", value: 3 }, { key: "晴雨", value: 4 }, { key: "雨天", value: 5 },
      { key: "夕陽", value: 6 }, { key: "夜晚有雨", value: 7 }, { key: "飄雨", value: 8 }, { key: "雷雨", value: 9 }, { key: "閃電", value: 10 },
      { key: "小雪", value: 11 }, { key: "大雪", value: 12 }, { key: "結霜", value: 13 }, { key: "潮濕", value: 14 }, { key: "撐傘", value: 15 },
      { key: "有風", value: 16 }, { key: "夜晚有雪", value: 17 }, { key: "夜晚", value: 18 }, { key: "華氏", value: 19 }, { key: "攝氏", value: 20 }
    ];



    var getMyDramaLocationDetail = function (id) {
      httpService.get("/script/getLocationDetail/" + id, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {

        $scope.LocationDetail = $scope.LocationDetail.concat(response.data.data);
        console.log($scope.LocationDetail);
        var _numWeather = response.data.data.weather-1;
        console.log(_numWeather);
        try {
          $scope.key.weather = $scope.weather[_numWeather].key;
        }catch{
          $scope.key.weather="";
        }



      });
    };

    getMyDramaLocationDetail($stateParams.id);


  });
