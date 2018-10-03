angular.module('starter.mydramadatelist.controllers', [])
  .controller('MyDramaDateListCtrl', function ($rootScope, $state, $cordovaCamera, $scope, $ionicModal, $ionicPopup, httpService, $ionicLoading, $ionicScrollDelegate, $timeout, $filter, $ionicActionSheet) {
    $scope.nowPage = 1;
    $scope.lastPage = 20;
    $scope.items = {
      postdate:[]
    };

    $scope.loadingPage = false;
    $scope.dramaList = [];

    $scope.filterParams = {};
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
        // $scope.dramaList = [];
      }

      httpService.get("/script/getMyList?page=" + $scope.nowPage + "&pageSize=5" + paramsString, {
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

        }

        $ionicLoading.hide({
          template: '<ion-spinner></ion-spinner>'
        })
      });
    }

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

      // getMyDramaList();


      setTimeout(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete')
      }, 2000);
    };




    $scope.showAddDatePopup = function () {


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
              console.log($scope.items.postdate.date);

              return $scope.items.postdate.date;
            }
          }
        ]
      });


      //若確定新增
      myPopup.then(function (res) {
        if (res) {
          console.log(res);

          var newdt = $filter('date')($scope.items.postdate.date, "yyyy-MM-dd");
          var array = $scope.items.postdate.indexOf(newdt);
          if (array == -1) {
            console.log(newdt);
            $ionicPopup.alert({
              title: "新增成功",
            });

            httpService.post("/script/create", {
              header: {
                "Device-Id": localStorage.getItem("Device-Id"),
                "Api-Token": localStorage.getItem("Api-Token")
              },
              data: {
                title: $scope.postdate.title,
                date: $scope.postdate.date,
                ispublic:1
              }
            }, {
                title: "劇本建立",
                content: "成功"
              }, function (response) {
                $scope.modalAdd.hide();
                getMyDramaList();


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

      $scope.items.postdate.date = new Date(reDT);
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
              console.log($scope.items.postdate.date);

              return $scope.items.postdate.date;
            }
          }
        ]
      });


      //按了確定之後
      myPopup.then(function (res) {
        if (res) {
          console.log(res);

          var newdt = $filter('date')($scope.items.postdate.date, "yyyy-MM-dd");
          console.log(newdt);
          $ionicPopup.alert({
            title: "修改成功",
          });
          //更改元素值
          $scope.items.postdate.date.find(v => v.date == date).date = newdt;

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


  });
