angular.module('starter.drama.post.controllers', [])
  .controller('DramaPostCtrl', function ($scope, $ionicScrollDelegate, httpService, $stateParams, $timeout) {

    console.log("Drama Post Ctrl", $stateParams.id);
    $scope.drama = {

    }


    httpService.get("/script/getListDetail/" + $stateParams.id, {
      header: {
        "Device-Id": localStorage.getItem("Device-Id"),
        "Api-Token": localStorage.getItem("Api-Token")
      }
    }, null, function (response) {
      $scope.drama = response.data.data;
      console.log($scope.drama);

    });


  });
