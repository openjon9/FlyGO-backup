angular.module('starter.drama.controllers', [])
  .controller('DramaCtrl', function ($rootScope, $state, $cordovaCamera, $scope, $ionicModal, $ionicPopup, httpService, $ionicLoading, $ionicScrollDelegate, $timeout, $ionicSlideBoxDelegate, $filter, $ionicActionSheet) {
    $scope.addDrama = {
      title: null,
    }
    $scope.picInfo = [{
      pic: null,
      txt: null,
    }];


    //天氣下拉選單
    $scope.weather = [
      { key: "豔陽", value: 1 }, { key: "晴天", value: 2 }, { key: "多雲", value: 3 }, { key: "晴雨", value: 4 }, { key: "雨天", value: 5 },
      { key: "夕陽", value: 6 }, { key: "夜晚有雨", value: 7 }, { key: "飄雨", value: 8 }, { key: "雷雨", value: 9 }, { key: "閃電", value: 10 },
      { key: "小雪", value: 11 }, { key: "大雪", value: 12 }, { key: "結霜", value: 13 }, { key: "潮濕", value: 14 }, { key: "撐傘", value: 15 },
      { key: "有風", value: 16 }, { key: "夜晚有雪", value: 17 }, { key: "夜晚", value: 18 }, { key: "華氏", value: 19 }, { key: "攝氏", value: 20 }
    ];


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
      items: []
    }

    //景點地圖多張圖片用
    $scope.takePictures = function (options) {

      var options = {
        quality: 75,
        targetWidth: 50,
        targetHeight: 50,
        sourceType: 1
      };


      $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.picInfo.pic = imageData;
        $scope.picInfo.push({
          pic: $scope.picInfo.pic,
          txt: "",
        });

        $scope.newPost.items.push({
          date: newdt,
          location: []
        });

      }, function (err) {
        console.log(err);
      });
    }



    $scope.takePicture = function (options) {

      var options = {
        quality: 75,
        targetWidth: 50,
        targetHeight: 50,
        sourceType: 1
      };


      $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.newPost.imgSrc = imageData;
        console.log($scope.newPost.imgSrc);
      }, function (err) {
        console.log(err);
      });
    }



    //增加劇本
    $ionicModal.fromTemplateUrl('templates/modal/addDrama.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.addDrama.title = "建立劇本";
      $scope.modalAdd = modal;

    });
    $scope.openAdd = function () {
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
        items: []
      }
      $scope.modalAdd.show();

    };
    $scope.closeAdd = function () {
      var confirm = $ionicPopup.confirm({
        title: "尚未完成劇本,是否離開?",
        cancelText: "否",
        okText: "是"
      });
      confirm.then(function (res) {
        if (res) {
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
            ispublic:true,
            items: []
          }
          $scope.modalAdd.hide();

        }
      });
    };

    //增加地點
    $ionicModal.fromTemplateUrl('templates/modal/addDramaLocation.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modalAddLocation = modal;
    });
    $scope.openAddLocation = function () {

      $scope.modalAddLocation.show();
    };
    $scope.closeAddLocation = function () {

      $scope.modalAddLocation.hide();
    };
    $scope.doneAddLocation = function () {

      $scope.modalAddLocation.hide();
    };



    $ionicModal.fromTemplateUrl('templates/modal/addDramaDetail.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modalAddDetail = modal;
    });
    $scope.openAddDetail = function () {

      $scope.modalAddDetail.show();
      $scope.newPost.items.location = null;

    };
    $scope.closeAddDetail = function () {

      $scope.modalAddDetail.hide();
    };

    $scope.doneDetail=function(){

      $scope.modalAddDetail.hide();
    };


    //完成新增劇本
    $scope.done = function () {
      $scope.modalAdd.hide();
      $state.go('tab.mydramalistDate');
    };


    //彈出新增日期
    $scope.showAddDatePopup = function () {
      $scope.newPost.date = null;
      var myPopup = $ionicPopup.show({
        cssClass: 'add-to-cart-popup',
        templateUrl: 'templates/popup/addDramaDate-popup.html',
        title: '新增日程',
        scope: $scope,
        buttons: [
          { text: '', type: 'close-popup ion-ios-close-outline' },
          {
            text: '確定新增',
            onTap: function (e) {
              console.log($scope.newPost.date);

              return $scope.newPost.date;
            }
          }
        ]
      });


      //若確定新增
      myPopup.then(function (res) {
        if (res) {
          console.log(res);

          var newdt = $filter('date')($scope.newPost.date, "yyyy-MM-dd");
          var array = $scope.newPost.items.indexOf(newdt);
          if (array == -1) {
            console.log(newdt);
            $ionicPopup.alert({
              title: "新增成功",
            });

            $scope.newPost.items.push({
              date: newdt,
            });


          } else {
            $ionicPopup.alert({
              title: "錯誤",
              content: "日期已重複",
            });
          }

        } else {
          $ionicPopup.alert({
            title: "錯誤",
            content: "請重新選擇日期",
          });
        }
      });
    };


    //編輯日期
    $scope.showEditDatePopup = function (date) {
      console.log(date);
      var reDT = $filter('date')(date, "yyyy,MM,dd");
      console.log(reDT);

      $scope.newPost.date = new Date(reDT);
      var myPopup = $ionicPopup.show({
        cssClass: 'add-to-cart-popup',
        templateUrl: 'templates/popup/addDramaDate-popup.html',
        title: '修改日程',
        scope: $scope,
        buttons: [
          { text: '', type: 'close-popup ion-ios-close-outline' },
          {
            text: '確定',
            onTap: function (e) {
              console.log($scope.newPost.date);

              return $scope.newPost.date;
            }
          }
        ]
      });


      //按了確定之後
      myPopup.then(function (res) {
        if (res) {
          console.log(res);

          var newdt = $filter('date')($scope.newPost.date, "yyyy-MM-dd");
          console.log(newdt);
          $ionicPopup.alert({
            title: "修改成功",
          });
          //更改元素值
          $scope.newPost.items.find(v => v.date == date).date = newdt;

        } else {
          $ionicPopup.alert({
            title: "錯誤",
            content: "請重新選擇日期",
          });
        }
      });
    };


    //長按之後彈出操作表
    $scope.onHolds = function (date) {
      var dt = $filter('date')(date, "yyyy-MM-dd");
      var sheet = $ionicActionSheet.show({
        titleText: '修改劇本日程',
        cssClass: 'action-sheet-group',
        buttons: [
          {
            text: "<center><i class='icon ion-edit'></i>編輯</center>",
          }
        ],
        destructiveText: "<center><i class='icon ion-trash-a'></i>刪除</center>",
        buttonClicked: function () {
          $scope.showEditDatePopup(dt);
          //要return true才會關閉操作表
          return true;
        },
        destructiveButtonClicked: function () {

          return true;
        }
      });

    };




    $scope.nowPage = 1;
    $scope.lastPage = 20;

    $scope.loadingPage = false;
    $scope.dramaList = [];

    $scope.filterParams = {};

    var getDramaList = function () {

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

      httpService.get("/script/getList?page=" + $scope.nowPage + "&pageSize=5" + paramsString, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {

        $scope.loadingPage = false;
        $scope.nowPage++;
        $scope.lastPage = response.data.data.last_page;



        if (response.data.data.list.length != 0) {
          $scope.dramaList = $scope.dramaList.concat(response.data.data.list);
          console.log($scope.productList);
        }

        $ionicLoading.hide({
          template: '<ion-spinner></ion-spinner>'
        })
      });
    }



    getDramaList();

    $scope.prePage = function () {
      // Stop the ion-refresher from spinning
      console.log("prePage");
      $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.nextPage = function () {
      // Stop the ion-infiniteScrollComplete from spinning
      console.log("nextPage");

      getDramaList();


      setTimeout(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete')
      }, 2000);
    };


    //$scope.dramaList = dramaMockData.data;

    console.log("Drama Ctrl", $scope.dramaList.length);

    $scope.messages = {
      "title": "test message",
      "content": "test content"
    }




    httpService.get("/product/countryList", {
      header: {
        "Device-Id": localStorage.getItem("Device-Id"),
        "Api-Token": localStorage.getItem("Api-Token")
      }
    }, null, function (response) {
      $scope.countryList = response.data.data;
    });

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
          $scope.productList = [];

          getDramaList();

        } else {
          console.log('Popup closed');
        }
      });
    };

  });
