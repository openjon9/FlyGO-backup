angular.module('starter.mydramalocationlist.controllers', [])
  .controller('MyDramaLocationCtrl', function ($rootScope, $http, $state, $cordovaCamera, $scope, $ionicModal, $ionicPopup, httpService, $ionicLoading, $ionicScrollDelegate, $timeout, $filter, $ionicActionSheet, $cordovaFileTransfer, $stateParams) {
    console.log("MyDramaLocationCtrl", $stateParams.id);

    var newItem = function () {
      $scope.Location = {
        id: "",
        name: "",
        starttime: "",
        endtime: "",
        opentime: "",
        holiday: "",
        weather: "",
        content: "",
        tel: "",
        email: "",
        address: "",
        social: "",
        traffic: "",
        traffictime: "",
        gps: "",
        baggage: "",
        size: "",
        weight: "",
        picname: "",
        pic_info: [
          {
            pic: "",
            txt: ""
          }
        ],
        ispublic: 1
      };
    }
    //詳細資訊空陣列宣告

    //列表空陣列宣告
    $scope.LocationList = [];
    $scope.LocationDetail = [];
    //天氣下拉選單

    $scope.weather = [
      { key: "豔陽", value: 1 }, { key: "晴天", value: 2 }, { key: "多雲", value: 3 }, { key: "晴雨", value: 4 }, { key: "雨天", value: 5 },
      { key: "夕陽", value: 6 }, { key: "夜晚有雨", value: 7 }, { key: "飄雨", value: 8 }, { key: "雷雨", value: 9 }, { key: "閃電", value: 10 },
      { key: "小雪", value: 11 }, { key: "大雪", value: 12 }, { key: "結霜", value: 13 }, { key: "潮濕", value: 14 }, { key: "撐傘", value: 15 },
      { key: "有風", value: 16 }, { key: "夜晚有雪", value: 17 }, { key: "夜晚", value: 18 }, { key: "華氏", value: 19 }, { key: "攝氏", value: 20 }
    ];




    var getMyDramaLocationList = function () {
      httpService.get("/script/getLocation/" + $stateParams.id, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
        $scope.LocationList = [];
        $scope.LocationList = $scope.LocationList.concat(response.data.data.location);
        console.log(response.data.data.location);
      });
    };


    //取單筆資訊 編輯用
    var getMyDramaLocationDetail = function (id) {
      httpService.get("/script/getLocationDetail/" + id, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
        console.log(response.data.data);
        newItem();
        try {
          var pic = response.data.data.pic_info[0].pic;
        } catch{
          var pic = "";
          var picurl = "";
        }


        var sh = response.data.data.starttime.substring(0, 2);
        var sm = response.data.data.starttime.substring(3, 5);
        var eh = response.data.data.endtime.substring(0, 2);
        var em = response.data.data.endtime.substring(3, 5);
        var st = new Date(1970, 0, 1, sh, sm, 00);
        var et = new Date(1970, 0, 1, eh, em, 00);

        $scope.Location = {
          id: id,
          name: response.data.data.name,
          starttime: st,
          endtime: et,
          opentime: response.data.data.opentime,
          holiday: response.data.data.holiday,
          content: response.data.data.content,
          tel: response.data.data.tel,
          email: response.data.data.email,
          address: response.data.data.address,
          social: response.data.data.social,
          traffic: response.data.data.traffic,
          traffictime: response.data.data.traffictime,
          gps: response.data.data.gps,
          baggage: response.data.data.baggage,
          size: response.data.data.size,
          weight: response.data.data.weight,
          picname: pic,
          ispublic: 1,
          pic_info: [{
            pic: "",
            txt: "",
          }]
        };
        $scope.Location.pic_info.pic = picurl;
        $scope.Location.pic_info.txt = $scope.Location.pic_info.txt;
        console.log("天氣" + response.data.data.weather);

        var weather = response.data.data.weather;
        if (weather != 0) {
          $scope.Location.weather = weather;
        }
      })
    };


    //取地點列表
    getMyDramaLocationList();

    //設定欲開啟的Modal頁
    $ionicModal.fromTemplateUrl('templates/modal/addDramaDetail.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {

      $scope.modalAddLocation = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal/editDramaDetail.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {

      $scope.EditmodalLocation = modal;
    });

    $ionicModal.fromTemplateUrl('templates/modal/imageModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {

      $scope.imagemodal = modal;

    });

    $scope.openImage = function () {
      console.log(1);
      $scope.newPost = [];
      $scope.newPost.imgSrc = $scope.Location.pic_info.pic;
      $scope.imagemodal.show();
    }
    $scope.closeImage = function () {
      $scope.imagemodal.hide();
    }
    //用於開啟
    $scope.openAddLocation = function () {
      newItem();

      $scope.modalAddLocation.show();
    };

    //用於右上角關閉
    $scope.closeAddLocation = function () {
      console.log($scope.Location.name);
      $scope.modalAddLocation.hide();
    };
    $scope.closeEditLocation = function () {
      console.log($scope.Location.name);
      $scope.EditmodalLocation.hide();
    };

    //用於新增
    $scope.submitDramaLocation = function () {
      if (!$scope.Location.name == "" && !$scope.Location.pic_info.pic == "" && !$scope.Location.starttime == "" && !$scope.Location.endtime == "") {
        var starttime = $filter('date')($scope.Location.starttime, "HH:mm")
        console.log(starttime);
        var endtime = $filter('date')($scope.Location.endtime, "HH:mm")
        console.log($scope.Location.picname);
        var URI = "http://59.126.17.211:8082/Danainitrip/public/api";
        var api = "/script/createLocation"
        console.log(endtime);
        console.log($stateParams.id)
        console.log($scope.Location.weather);
        $http({
          method: 'POST',
          url: URI + api,
          headers: {
            "Content-Type": "application/json",
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
          },

          data: {
            sdid: $stateParams.id,
            name: $scope.Location.name,
            starttime: starttime,
            endtime: endtime,
            opentime: $scope.Location.opentime,
            holiday: $scope.Location.holiday,
            weather: $scope.Location.weather,
            content: $scope.Location.content,
            tel: $scope.Location.tel,
            email: $scope.Location.email,
            address: $scope.Location.address,
            social: $scope.Location.social,
            traffic: $scope.Location.traffic,
            traffictime: $scope.Location.traffictime,
            gps: "",
            baggage: $scope.Location.baggage,
            size: $scope.Location.size,
            weight: $scope.Location.weight,
            pic_info: [
              {
                pic: $scope.Location.picname,
                txt: $scope.Location.pic_info.txt
              }
            ],
            ispublic: 1
          },


        }).then(function successCallback(response) {
          console.log(response);
          getMyDramaLocationList();
          $ionicPopup.alert({
            title: "新增成功",

          });

          $scope.modalAddLocation.hide();

        }, function errorCallback(response) {
          console.log(response);
          $ionicPopup.alert({
            title: "新增失敗",
          });
        });

      }
    };
    $scope.editDramaLocation = function () {
      if (!$scope.Location.name == "" && !$scope.Location.pic_info.pic == "" && !$scope.Location.starttime == "" && !$scope.Location.endtime == "") {
        var starttime = $filter('date')($scope.Location.starttime, "HH:mm")
        var endtime = $filter('date')($scope.Location.endtime, "HH:mm")
        var URI = "http://59.126.17.211:8082/Danainitrip/public/api";
        var api = "/script/editLocation"
        console.log("地點ID:" + $scope.Location.id);
        console.log($scope.Location.weather);
        var weather=0;
        if($scope.Location.weather.value>0){
          weather=$scope.Location.weather.value;
        }
        $http({
          method: 'POST',
          url: URI + api,
          headers: {
            "Content-Type": "application/json",
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
          },
          data: {
            id: $scope.Location.id,
            name: $scope.Location.name,
            starttime: starttime,
            endtime: endtime,
            opentime: $scope.Location.opentime,
            holiday: $scope.Location.holiday,
            weather: weather,
            content: $scope.Location.content,
            tel: $scope.Location.tel,
            email: $scope.Location.email,
            address: $scope.Location.address,
            social: $scope.Location.social,
            traffic: $scope.Location.traffic,
            traffictime: $scope.Location.traffictime,
            gps: "",
            baggage: $scope.Location.baggage,
            size: $scope.Location.size,
            weight: $scope.Location.weight,
            pic_info: [
              {
                pic: $scope.Location.picname,
                txt: $scope.Location.pic_info.txt
              }
            ],
            ispublic: 1
          },


        }).then(function successCallback(response) {
          getMyDramaLocationList();
          console.log(response);
          $ionicPopup.alert({
            title: "修改成功",
          });
          $scope.EditmodalLocation.hide();

        }, function errorCallback(response) {
          console.log(response);
          $ionicPopup.alert({
            title: "修改失敗",
          });
        });

      }
    };

    //相機
    $scope.takePicture = function (options) {
      // sourceType
      var options = {
        quality: 100,
        targetWidth: 1920,
        targetHeight: 1080,
        sourceType: 1,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        allowEdit: true,
        popoverOptions: CameraPopoverOptions,
        //saveToPhotoAlbum: true,

      };

      //上傳照片
      $cordovaCamera.getPicture(options).then(function (imageData) {

        this.imageName = "data:image/jpeg;base64," + imageData;
        console.log(this.imageName);
        httpService.post("/script/uploadImgBase64", {
          header: {
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
          },
          data: {
            pic: this.imageName,
          }
        }, {
          }, function (response) {
            console.log(response.data.data)

            var img = response.data.data.pic.dir + response.data.data.pic.name;
            console.log(img);
            $scope.Location.pic_info.pic = img;
            $scope.Location.picname = response.data.data.pic.name;
          });

      }, function (err) {
        console.log(err);
      });
    }


    //相機
    $scope.takePictures = function (options) {
      // sourceType
      var options = {
        quality: 100,
        targetWidth: 1920,
        targetHeight: 1080,
        sourceType: 1,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        allowEdit: true,
        popoverOptions: CameraPopoverOptions,
        //saveToPhotoAlbum: true,

      };

      //上傳照片
      $cordovaCamera.getPicture(options).then(function (imageData) {
        this.imageName = "data:image/jpeg;base64," + imageData;
        console.log(this.imageName);
        httpService.post("/script/uploadImgBase64", {
          header: {
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
          },
          data: {
            pic: this.imageName,
          }
        }, {
          }, function (response) {

            console.log(response.data.data)
            var img = response.data.data.pic.dir + response.data.data.pic.name;
            console.log(img);
            $scope.Location.pic_info.pic = img;
            $scope.Location.picname = response.data.data.pic.name;

          });

      }, function (err) {
        console.log(err);
      });
    }



    $scope.onHolds = function (id) {
      var sheet = $ionicActionSheet.show({
        cssClass: 'action-sheet-group',
        buttons: [
          {
            text: "<center>編輯地點</center>",
          }
        ],
        destructiveText: "<center>刪除地點</center>",
        //編輯按鈕
        buttonClicked: function () {

          getMyDramaLocationDetail(id);
          $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
            duration: 1000
          });
          console.log(id);

          $scope.EditmodalLocation.show();


          return true;
        },
        destructiveButtonClicked: function () {
          var confirm = $ionicPopup.confirm({
            title: "確定要刪除地點",
            cancelText: "否",
            okText: "是"
          });
          confirm.then(function (res) {
            if (res) {
              $ionicLoading.show({
                template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
                duration: 1500
              });
              console.log("執行刪除")
              httpService.post("/script/delLocation/" + id, {
                header: {
                  "Device-Id": localStorage.getItem("Device-Id"),
                  "Api-Token": localStorage.getItem("Api-Token")
                }
              }, null, function (response) {
                console.log(response.data.data);
                $ionicLoading.hide({
                  template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
                  duration: 1000
                });
                getMyDramaLocationList();

              });
            } else {
              console.log("不刪除");
            }
          });

          return true;
        }
      });
    };

  });
