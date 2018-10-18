angular.module('starter.mydramalist.controllers', [])
  .controller('MyDramaListCtrl', function ($rootScope, $state, $cordovaCamera, $scope, $ionicModal, $ionicPopup, httpService, $ionicLoading,$cordovaGeolocation, $ionicScrollDelegate, $timeout, $filter, $ionicActionSheet, $cordovaFileTransfer) {


    $scope.nowPage = 1;
    $scope.lastPage = 20;

    $scope.loadingPage = false;
    $scope.dramaList = [];

    $scope.filterParams = {};
    $scope.modal = [];

    $scope.newPost = {
      id:"",
      imgSrc: null,
      country: "",
      place: "",
      lat: "",
      lng: "",
      title: "",
      brief: "",
      content: "",
      num: "",
      ispublic: true,
      imgName:"",
    }
    //取座標
    $scope.getGeoLocation=function(){
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)

        .then(function (position) {
          console.log(position);

          $scope.newPost.lat=position.coords.latitude;
          $scope.newPost.long=position.coords.longitude;
          console.log("lat:"+$scope.newPost.lat);
          console.log("long:"+ $scope.newPost.long);
          console.log("end");
        }, function(err) {
         console.log(err);
        });
    };

    //取列表
    var getMyDramaList = function () {

      var filterParams = $scope.filterParams;

      if (filterParams instanceof Object) {
        var paramsString = "";
        //console.log(filterParams);

        if (filterParams.keyword != null) {
          paramsString += "&q=" + filterParams.keyword
        }

        if (filterParams.place != null) {
          paramsString += "&place=" + filterParams.place
        }

        if (filterParams.countrytype != '' && filterParams.countrytype) {
          paramsString += "&country=" + filterParams.countryType
        }

      }

      if ($scope.nowPage == 1) {
        $scope.dramaList = [];

      }

      httpService.get("/script/getMyList?page=" + $scope.nowPage + "&pageSize=5" + paramsString, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {

        $scope.loadingPage = false;
        // $scope.nowPage++;
        $scope.lastPage = response.data.data.last_page;

        // if (response.data.data.list.length != 0) {

        $scope.dramaList = $scope.dramaList.concat(response.data.data.list);

        console.log(response.data.data.list);
        console.log('--------------');
        console.log($scope.dramaList);
        // }

        $ionicLoading.hide({
          template: '<ion-spinner></ion-spinner>'
        })
      });
    }
    getMyDramaList();
    //上一頁
    $scope.prePage = function () {
      // Stop the ion-refresher from spinning
      console.log("prePage");
      $scope.$broadcast('scroll.refreshComplete');
    }
    //下一頁
    $scope.nextPage = function () {
      // Stop the ion-infiniteScrollComplete from spinning
      console.log("nextPage");

      getMyDramaList();


      setTimeout(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete')
      }, 2000);
    };
    //搜尋欄位
    $scope.showFilterPopup = function () {
      var myPopup = $ionicPopup.show({
        cssClass: 'add-to-cart-popup',
        templateUrl: 'templates/popup/filter_drama.html',
        title: '進階搜尋',
        scope: $scope,
        buttons: [
          { text: '', type: 'close-popup ion-ios-close-outline' },

          {
            text: '搜尋', onTap: function (e) {
              //console.log($scope.filterParams);
              return $scope.filterParams;
            }
          }

        ]
      });
      myPopup.then(function (res) {
        console.log(res);
        if (res) {
          $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">搜尋中</p>',
            duration: 1000
          });

          $scope.nowPage = 1;

          $scope.loadingPage = false;


          getMyDramaList();

        } else {
          console.log('Popup closed');
        }
      });
    };

    //Modal建立
    $ionicModal.fromTemplateUrl('templates/modal/imageModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {

      $scope.imagemodal = modal;

    });

    $scope.openImage=function(){
      console.log(1);
      $scope.imagemodal.show();
    }
    $scope.closeImage=function(){
      $scope.imagemodal.hide();
    }

    $ionicModal.fromTemplateUrl('templates/modal/addDrama.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {

      $scope.modalAdd = modal;

    });

    $ionicModal.fromTemplateUrl('templates/modal/editDrama.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {

      $scope.editmodal = modal;

    });

    var getCountry = function () {
      httpService.get("/product/countryList", {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
        $scope.countryList = response.data.data;
      });
    }
    var getPeopleNum = function () {
      $scope.Numbers = [];
      for (var i = 1; i <= 15; i++) {
        $scope.Numbers.push(i);
      }
    };
    var getNewItem = function () {
      $scope.newPost = [];
    };

    var getDramaDetail=function(id){
      httpService.get("/script/getListDetail/" + id, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
        console.log(response.data.data);

        $scope.newPost.country = response.data.data.country;
        $scope.newPost.lat = response.data.data.lat;
        $scope.newPost.lng = response.data.data.lng;
        $scope.newPost.title = response.data.data.title;
        $scope.newPost.brief = response.data.data.brief;
        $scope.newPost.place = response.data.data.place;
        $scope.newPost.num = $scope.Numbers[response.data.data.num - 1]
        $scope.newPost.ispublic = response.data.data.ispublic == 1 ? true : false;
        try{
          var imgsrc=$scope.newPost.imgSrc=response.data.data.cover_pic_url;
        }catch{
          imgsrc="";
          imgName="";
        }

        $scope.newPost.imgSrc=imgsrc;
        $scope.newPost.imgName=imgName;
        $scope.newPost.id=id;
      });
    };


    //開啟modal新增劇本
    $scope.openAdd = function () {
      getCountry();
      getPeopleNum();
      getNewItem();

      $scope.modalAdd.show();
      $scope.modal.title = "建立劇本";
    };
    //右上角關閉
    $scope.closeAdd = function () {
      var confirm = $ionicPopup.confirm({
        title: "尚未完成劇本,是否離開?",
        cancelText: "否",
        okText: "是"
      });
      confirm.then(function (res) {
        if (res) {

          $scope.modalAdd.hide();
        }
      });
    };

    $scope.closeEdit= function () {
      var confirm = $ionicPopup.confirm({
        title: "尚未完成劇本,是否離開?",
        cancelText: "否",
        okText: "是"
      });
      confirm.then(function (res) {
        if (res) {
          $scope.editmodal.hide();
        }
      });
    };
    //送出劇本
    $scope.submitDrama = function () {
      if (!$scope.newPost.title == "" && !$scope.newPost.country == "" && !$scope.newPost.imgSrc == "") {
        console.log("post");
        httpService.post("/script/create", {
          header: {
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
          },
          data: {
            cover_pic: $scope.newPost.imgName,
            country: $scope.newPost.country,
            place: $scope.newPost.place,
            lat: "",
            lng: "",
            title: $scope.newPost.title,
            brief: $scope.newPost.brief,
            content: $scope.newPost.content,
            num: $scope.newPost.num,
            ispublic: $scope.newPost.ispublic == true ? 1 : 0,
          }
        }, {
            title: "劇本建立",
            content: "成功"
          }, function (response) {

            $ionicLoading.show({
              template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
              duration: 1000
            });
            getMyDramaList();

            $scope.modalAdd.hide();
            $ionicLoading.hide({
              template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
              duration: 1000
            });
          });

      }
    };


    //取相機
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
        correctOrientation:true,
        //saveToPhotoAlbum: true,

      };


      //取照片
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
            $scope.newPost.imgSrc = img;
            $scope.newPost.imgName=response.data.data.pic.name;
            console.log($scope.newPost.imgName);

          });

      }, function (err) {
        console.log(err);
      });

    }
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


      //取照片
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
            $ionicLoading.show({
              template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
              duration: 1000
            });
            console.log(response.data.data)
            var img = response.data.data.pic.dir + response.data.data.pic.name;
            console.log(img);
            $scope.newPost.imgSrc = img;
            $scope.newPost.imgName=response.data.data.pic.name;
            console.log($scope.newPost.imgName);
            $ionicLoading.hide({
              template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
              duration: 1000
            });
          });

      }, function (err) {
        console.log(err);
      });

    }
    //編輯
    $scope.EditDrama=function(){
      if (!$scope.newPost.title == "" && !$scope.newPost.country == "" && !$scope.newPost.imgSrc == "") {
        console.log("post");
        httpService.post("/script/edit", {
          header: {
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
          },

          data: {
            id:$scope.newPost.id,
            cover_pic: $scope.newPost.imgName,
            country: $scope.newPost.country,
            place: $scope.newPost.place,
            lat: "",
            lng: "",
            title: $scope.newPost.title,
            brief: $scope.newPost.brief,
            content: $scope.newPost.content,
            num: $scope.newPost.num,
            ispublic: $scope.newPost.ispublic == true ? 1 : 0,

          }
        }, {
            title: "劇本修改",
            content: "成功"
          }, function (response) {
            getMyDramaList();

            $ionicLoading.show({
              template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
              duration: 2000
            });
            $scope.editmodal.hide();

            $ionicLoading.hide({
              template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;"></p>',
              duration: 1000
            });
          });

      }
    };




    //長按鈕
    $scope.onHolds = function (id) {
      var sheet = $ionicActionSheet.show({
        cssClass: 'action-sheet-group',
        buttons: [
          {
            text: "<center>編輯劇本</center>",
          }
        ],
        destructiveText: "<center>刪除劇本</center>",
        //編輯按鈕
        buttonClicked: function () {
          getCountry();
          getPeopleNum();
          getDramaDetail(id);

          console.log(id);
          $scope.editmodal.show();
          $scope.modal.title = "編輯劇本";


          $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">搜尋中</p>',
            duration: 1000
          });

          return true;
        },
        destructiveButtonClicked: function () {
          var confirm = $ionicPopup.confirm({
            title: "確定要刪除劇本",
            cancelText: "否",
            okText: "是"
          });
          confirm.then(function (res) {
            if (res) {
              $ionicLoading.show({
                template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">搜尋中</p>',
                duration: 1500
              });
              console.log("執行刪除")
              httpService.post("/script/delList/" + id, {
                header: {
                  "Device-Id": localStorage.getItem("Device-Id"),
                  "Api-Token": localStorage.getItem("Api-Token")
                }
              }, null, function (response) {
                console.log(response.data.data);
                $ionicLoading.hide({
                  template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">搜尋中</p>',
                  duration: 1000
                });
                getMyDramaList();

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

