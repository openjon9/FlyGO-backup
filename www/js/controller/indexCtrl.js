angular.module('starter.index.controllers', [])
  .controller('indexCtrl', function ($scope, httpService, $timeout,  $ionicSlideBoxDelegate,$ionicModal,$ionicPopup) {
    $ionicSlideBoxDelegate.update();
    $scope.indexHot=[];
    $scope.indexSpecial=[];
    $scope.indexJP=[];
    $scope.indexKR=[];
    $scope.banner=[];
    $scope.img=[];
    $scope.googleurl=[];
    $scope.getUrl = function (id) {
      return 'https://www.youtube.com/embed/'+id+'?rel=0'
    }
   //精選
    var GetSpecialList=function(){
      httpService.get("/script/getList?page=1&pageSize=10&special=1", {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {

        $scope.indexSpecial=$scope.indexSpecial.concat(response.data.data.list);
        console.log("精選:"+response);

      });
    }



    //熱門
    var GetHotIndexList=function(){
      httpService.get("/script/getList?page=1&pageSize=10&hot=1", {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
         $scope.indexHot=$scope.indexHot.concat(response.data.data.list);


      });
    }


    //日本
    var GetJPList=function(country){
      httpService.get("/script/getList?page=" +1 + "&pageSize=10" +"&country="+country, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
        $scope.indexJP=$scope.indexJP.concat(response.data.data.list);
        console.log("日本:"+$scope.indexJP);

      });
    }
    //韓國
    var GetKRList=function(country){
      httpService.get("/script/getList?page=" +1 + "&pageSize=10" +"&country="+country, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
        $scope.indexKR=$scope.indexKR.concat(response.data.data.list);
        console.log("韓國:"+$scope.indexKR);

      });
    }

    //Banner
    var GetBanner=function(){
      httpService.get("/home/getBannerList", {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
        console.log("banner");
        $scope.banner=$scope.banner.concat(response.data.data);
        console.log( $scope.banner);

        $ionicSlideBoxDelegate.update();
      });
    };


    $ionicModal.fromTemplateUrl('templates/home/post_2.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {

      $scope.DetailModal = modal;

    });

    $ionicModal.fromTemplateUrl('templates/modal/ImageDetailModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {

      $scope.ImageDetail = modal;

    });

    var getDetail=function(id){
      httpService.get("/script/getListDetail/" + id, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
        $scope.drama = response.data.data;
        var key="https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&z=16&output=embed&t=h&q="
        key+=$scope.drama.lng+","+$scope.drama.lat;
        $scope.googleurl={src:key};
        console.log($scope.drama);

      });
    }
    $scope.openDetail=function(id){
      $scope.DetailModal.show();
      getDetail(id);
    }
    $scope.closeDetail=function(){
      $scope.DetailModal.hide();
    }

    $scope.openImageDetail = function (pics,pic) {

      $scope.pagerIndex=0;
        angular.forEach(pics,function(value,key){
          console.log(key+':'+value);
          if(value.pic==pic){
            $scope.pagerIndex=key;
          }

        })
        $scope.img=pics;
      console.log($scope.pagerIndex);
      console.log($scope.img);

      $scope.ImageDetail.show();
      $ionicSlideBoxDelegate.slide($scope.pagerIndex);
    }
    $scope.closeImageDetail = function () {
      $scope.ImageDetail.hide();
    }
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



        } else {
          console.log('Popup closed');
        }
      });
    };



    GetHotIndexList();
    GetSpecialList();
    GetJPList("jp")
    GetKRList("kr")
    GetBanner();


  });
