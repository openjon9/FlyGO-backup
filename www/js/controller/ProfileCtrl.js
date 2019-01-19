angular.module('starter.profile.controllers', [])
  .controller('ProfileCtrl', function ($scope, $stateParams, $state, $ionicActionSheet, $ionicPopup, $ionicLoading, httpService, $ionicScrollDelegate, $timeout, $cordovaCamera) {

    console.log($stateParams);
    $scope.profile = {
      "acc": "",
      "gender": "0",
      "nickname": "",
      "place": "",
      "username": "",
      "shoppingListNum": 0,
      "joinNum": 0,
      "birthday": "1990/01/01",
      "pic": ""
    };

    $scope.shoppingList = [];


    var getProfile = function () {
      console.log($stateParams.uid);
      $scope.shoppingList = [];
      httpService.get("/user/info/" + $stateParams.uid, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
        console.log(response)
        var profileData = response.data.data;

        $scope.shoppingList = response.data.data.shoplist;
        console.log($scope.shoppingList);

        Object.assign($scope.profile, profileData);


        $scope.isMyInfo = ($stateParams.uid ? false : true);
        console.log($scope.profile);

      });
    };

    getProfile();


    var getShoppingList = function () {


      $ionicLoading.show({
        template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">載入中</p>',
        duration: 5000
      });

      $scope.loadingPage = true;
      httpService.get("/shop/getList", {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {


        console.log(response.data.data);

        if (response.data.data.length != 0) {
          $scope.shoppingList = response.data.data;
        } else {
          $scope.shoppingList = [];
        }

        $ionicLoading.hide({
          template: '<ion-spinner></ion-spinner>'
        })
      });
      //$scope.$broadcast('scroll.infiniteScrollComplete');

    };

    //getShoppingList();

    $scope.updateProfilePopup = function () {

      var myPopup = $ionicPopup.show({
        cssClass: 'add-to-cart-popup',
        templateUrl: 'templates/popup/update_profile.html',
        title: '資訊更新',
        scope: $scope,
        buttons: [
          { text: '', type: 'close-popup ion-ios-close-outline' },

          {
            text: '更新', onTap: function (e) {

              console.log($scope.filterParams);


              return $scope.profile;
            }
          }

        ]
      });

      myPopup.then(function (res) {
        console.log(res);
        // if (res.pic) res.pic = "";
        src = $scope.imageToBase64(res.pic)
        res.pic = src
        if (res) {
          $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">更新中</p>',
            duration: 1000
          });

          httpService.post("/user/update", {
            header: {
              "Device-Id": localStorage.getItem("Device-Id"),
              "Api-Token": localStorage.getItem("Api-Token")
            },
            data: res
          }, {
              title: "更新成功",
              content: "資訊已更新"
            }, function (response) {

              //getShoppingList();

              console.log(response)
              //$scope.closeRegister();
              //$scope.openActive();
            });

        } else {
          console.log('Popup closed');
        }
      });
    };

    $scope.actionSheet = function () {
      var hideSheet = $ionicActionSheet.show({
        // titleText: 'Modify your album',
        buttons: [

          { text: '封鎖使用者' },
          { text: '刪除使用者' },

        ],
        //destructiveText: '刪除使用者',
        cancelText: '取消',
        cancel: function () {
          console.log("cancel");
          // add cancel code..
        },
        //destructiveButtonClicked: function(){
        //    console.log("Delete");
        //},
        buttonClicked: function (action) {

          // switch (action) {
          //   case 0:
          //     var msg = "登出"
          //     console.log("logout");

          //     break;
          //   case 1:
          //     var msg = "已封鎖"
          //     console.log("blacklist");
          //     break;
          //   case 2:
          //     var msg = "已刪除";
          //     console.log("delete");
          //     break;

          // }

          if (action) {

            var msg = "已刪除"; // 2
          } else {
            console.log(action);
            var msg = "已封鎖"; //1
          }

          httpService.post("/friends/ban", {
            header: {
              "Device-Id": localStorage.getItem("Device-Id"),
              "Api-Token": localStorage.getItem("Api-Token")
            },
            data: {
              fid: $stateParams.uid,
              action: (action + 1)
            }
          }, {
              title: "更新成功",
              content: msg
            }, function (response) {

              //getShoppingList();

              console.log(response)
              $state.go('tab.network');
              //$scope.closeRegister();
              //$scope.openActive();
            });

          return true;
        }
      });
    };


    $scope.imageToBase64 = function (src) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 1280;
      canvas.height = 1280;
      const image = new Image()
      image.width = 1280;
      image.height = 1280;
      image.src = src;
      ctx.drawImage(image, 0, 0, 1280, 1280);

      return canvas.toDataURL('image/png', 1)
    }

    // 更換大頭照
    $scope.changePic = function (type) {
      var sheet = $ionicActionSheet.show({
        cssClass: 'action-sheet-group',
        buttons: [
          {
            text: "<center>相機</center>"
          },
          {
            text: "<center>相簿</center>"
          }
        ],
        buttonClicked: function (index) {
          switch (index) {
            case 0:
              $scope.callCamera(type);
              break;
            case 1:
              $scope.callAlbum(type);
              break;
          }
          return true;
        }
      });
    };
    //取相機
    $scope.callCamera = function (type) {
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
        correctOrientation: true,
        //saveToPhotoAlbum: true,
      };

      // 取照片
      $cordovaCamera.getPicture(options).then(function (imageData) {
        this.imageName = "data:image/jpeg;base64," + imageData;
        console.log(this.imageName);
        switch (type) {
          case 'pic':
            $scope.profile.pic = this.imageName;
            break;
          case 'cover':
            $scope.profile.cover = this.imageName;
            break;
        }
        $scope.updateMyPic();

      }, function (err) {
        console.log(err);
      });

    }
    $scope.callAlbum = function (type) {
      // sourceType
      console.log(Camera, $cordovaCamera)
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

      // 取照片
      $cordovaCamera.getPicture(options).then(function (imageData) {
        this.imageName = "data:image/jpeg;base64," + imageData;
        console.log(this.imageName);
        switch (type) {
          case 'pic':
            $scope.profile.pic = this.imageName;
            break;
          case 'cover':
            $scope.profile.cover = this.imageName;
            break;
        }
        $scope.updateMyPic();

      }, function (err) {
        console.log(err);
      });

    }
    $scope.updateMyPic = function () {
      httpService.post("/user/update", {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        },
        data: {
          ...$scope.profile,
          pic: $scope.profile.pic,
          cover: $scope.profile.cover,
        }
      }, {
        title: "更新成功",
        content: "資訊已更新"
      }, function (response) {
        console.log(response);
      });
    }

  });
