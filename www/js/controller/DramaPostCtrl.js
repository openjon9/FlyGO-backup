angular.module('starter.drama.post.controllers', [])
  .controller('DramaPostCtrl', function ($scope ,httpService, $stateParams,$ionicModal,$ionicSlideBoxDelegate,$sce) {
    $scope.getUrl = function (id) {
      return 'https://www.youtube.com/embed/'+id+'?rel=0'
    }
    console.log("Drama Post Ctrl", $stateParams.id);
    $scope.drama = {

    }
    $scope.img=[];
    $scope.googleurl=[];
    var getDetail=function(id){
      httpService.get("/script/getListDetail/" + id, {
        header: {
          "Device-Id": localStorage.getItem("Device-Id"),
          "Api-Token": localStorage.getItem("Api-Token")
        }
      }, null, function (response) {
        $scope.drama = response.data.data;
        $scope.drama.title=response.data.data.title;
        var key="https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&z=16&output=embed&t=h&q="

        console.log($scope.drama.items.location);
        key+=$scope.drama.lng+","+$scope.drama.lat;
        $scope.googleurl={src:key};
        console.log($scope.drama);

      });
    }
    getDetail($stateParams.id);

    $ionicModal.fromTemplateUrl('templates/modal/ImageDetailModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {

      $scope.ImageDetail = modal;

    });
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

  });
