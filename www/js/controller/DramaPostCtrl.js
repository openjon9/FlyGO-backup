angular.module('starter.drama.post.controllers', [])
  .controller('DramaPostCtrl', function ($scope ,httpService, $stateParams) {

    console.log("Drama Post Ctrl", $stateParams.id);
    $scope.drama = {

    }

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
    getDetail($stateParams.id);



  });
