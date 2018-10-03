angular.module('starter.mydramalist.controllers', [])
  .controller('MyDramaListCtrl', function ($rootScope, $state, $cordovaCamera, $scope, $ionicModal, $ionicPopup, httpService, $ionicLoading, $ionicScrollDelegate, $timeout, $filter, $ionicActionSheet, $cordovaFileTransfer) {


    $scope.nowPage = 1;
    $scope.lastPage = 20;

    $scope.loadingPage = false;
    $scope.dramaList = [];

    $scope.filterParams = {};
    $scope.modal = [];

    $scope.newPost = {
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
    }

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
    $ionicModal.fromTemplateUrl('templates/modal/addDrama.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {

      $scope.modalAdd = modal;

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
          getNewItem();
          getMyDramaList();
          $scope.modalAdd.hide();

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
            cover_pic: $scope.newPost.imgSrc,
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
            $scope.modalAdd.hide();
            getMyDramaList();


          });

      }
    };


    //取相機
    $scope.takePicture = function (options) {
      // sourceType
      var options = {
        quality: 75,
        targetWidth: 50,
        targetHeight: 50,
        sourceType: 1,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA ,
        encodingType: Camera.EncodingType.JPEG,
        allowEdit: false,
        popoverOptions: CameraPopoverOptions,
        //saveToPhotoAlbum: true,

      };

      //取照片
      $cordovaCamera.getPicture(options).then(function (imageData) {
        this.imageName = "data:image/jpeg;base64,"+imageData;
        console.log(this.imageName );
        httpService.post("/script/uploadImgBase64", {
          header: {
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
          },
          data: {
            pic:this.imageName,
          }
        }, {
            title: "相片",
            content: "上傳成功"
          }, function (response) {
            console.log(response.data.data)
            var img=response.data.data.pic.dir+response.data.data.pic.name;
            console.log(img);
            $scope.newPost.imgSrc=img;
          });

      }, function (err) {
        console.log(err);
      });

    }




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
          console.log(id);
          getCountry();
          getPeopleNum();

          $scope.modalAdd.show();
          $scope.modal.title = "編輯劇本";
          httpService.get("/script/getMyListDetail/" + id, {
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
          });



          //要return true才會關閉操作表
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
              console.log("執行刪除")
              httpService.post("/script/delList/" + id, {
                header: {
                  "Device-Id": localStorage.getItem("Device-Id"),
                  "Api-Token": localStorage.getItem("Api-Token")
                }
              }, null, function (response) {
                console.log(response.data.data);
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

