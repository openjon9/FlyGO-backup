angular.module('starter.mydramadatelist.controllers', [])
  .controller('MyDramaDateListCtrl', function ($rootScope, $state, $cordovaCamera, $scope, $ionicModal, $ionicPopup, httpService, $ionicLoading, $ionicScrollDelegate, $timeout, $filter, $ionicActionSheet, $stateParams) {

    console.log("MyDramaDateListCtrl", $stateParams.id);
    $scope.items = {
      postdate: []
    };
    $scope.dateList = [];
    var getMyDramaDateList = function () {
      httpService.get("/script/getListDetail/" + $stateParams.id, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {

        $scope.dateList = $scope.dateList.concat(response.data.data.schedule);
        console.log($scope.dateList);
        $ionicLoading.hide({
          template: '<ion-spinner></ion-spinner>'
        })
      });
    };
    getMyDramaDateList();

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
              if ($scope.items.postdate.date == undefined || $scope.items.postdate.title == "") {
                $ionicPopup.alert({
                  title: "錯誤",
                  content: "日期或標題不正確"
                });
              }
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
          // var array = $scope.items.postdate.indexOf(newdt);
          // if (array == -1) {



          httpService.post("/script/createDate", {
            header: {
              "Device-Id": localStorage.getItem("Device-Id"),
              "Api-Token": localStorage.getItem("Api-Token")
            },
            data: {
              sid: $stateParams.id,
              title: $scope.items.postdate.title,
              date: newdt,
              ispublic: 1
            }
          }, {
            }, function (response) {
              console.log(response);
              getMyDramaDateList();
              $ionicPopup.alert({
                title: "新增成功",
              });

            });


        }
      });
    };


    //編輯日期
    $scope.showEditDatePopup = function (id,title,date) {
      console.log(id);

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

              var n=$scope.dateList.indexOf(id);





              return id;
            }
          }
        ]
      });


      //按了確定之後
      myPopup.then(function (id) {
        if (id) {
          console.log(id);

          var newdt = $filter('date')($scope.items.postdate.date, "yyyy-MM-dd");
          console.log(newdt);

          httpService.post("/script/editDate", {
            header: {
              "Device-Id": localStorage.getItem("Device-Id"),
              "Api-Token": localStorage.getItem("Api-Token")
            },
            data: {
              sdid: id,
              title: $scope.items.postdate.title,
              date: $scope.items.postdate.date,
              ispublic: 1,
            }
          }, {
            }, function (response) {
              console.log(response.data.data)
              $ionicPopup.alert({
                title: "修改成功",
              });
            });
        } else {
          $ionicPopup.alert({
            title: "錯誤",
            content: "日期或標題不正確",
          });
        }
      });
    };


    //長按之後彈出操作表
    $scope.onHolds = function (id) {
      var sheet = $ionicActionSheet.show({
        cssClass: 'action-sheet-group',
        buttons: [
          {
            text: "<center>編輯日程</center>",
          }
        ],
        destructiveText: "<center>刪除日程</center>",
        buttonClicked: function () {

          $scope.showEditDatePopup(id);

          return true;
        },
        destructiveButtonClicked: function () {
          var confirm = $ionicPopup.confirm({
            title: "確定要刪除行程",
            cancelText: "否",
            okText: "是"
          });
          confirm.then(function (res) {
            if (res) {
              console.log("執行刪除")
              httpService.post("/script/delDay/" + id, {
                header: {
                  "Device-Id": localStorage.getItem("Device-Id"),
                  "Api-Token": localStorage.getItem("Api-Token")
                }
              }, null, function (response) {
                console.log(response.data.data);


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
