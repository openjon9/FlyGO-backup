angular.module('starter.index.controllers', [])
  .controller('indexCtrl', function ($scope, httpService, $timeout,  $ionicSlideBoxDelegate,$ionicModal) {
    $ionicSlideBoxDelegate.update();
    $scope.indexHot=[];
    $scope.indexSpecial=[];
    $scope.indexJP=[];
    $scope.indexKR=[];
    $scope.banner=[];

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
    var getDetail=function(id){
      httpService.get("/script/getListDetail/" + id, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
        $scope.drama = response.data.data;
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



    GetHotIndexList();
    GetSpecialList();
    GetJPList("jp")
    GetKRList("kr")
    GetBanner();


  });
