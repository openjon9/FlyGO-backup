angular.module('starter.drama.post.controllers', [])
    .controller('DramaPostCtrl', function($scope, $ionicScrollDelegate, httpService, $stateParams, $timeout) {

        console.log("Drama Post Ctrl", $stateParams.id);
        $scope.drama = {

        }

        $ionicModal.fromTemplateUrl('templates/modal/new_post.html', {
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modalopenPost = modal;
      });
      $scope.openPost = function() {
          $scope.modalopenPost.show();
      };
      $scope.openPost = function() {
          $scope.modalopenPost.hide();
      };

        httpService.get("/script/getListDetail/"+$stateParams.id, {
            header: {
                "Device-Id": localStorage.getItem("Device-Id"),
                "Api-Token": localStorage.getItem("Api-Token")
            }
        }, null, function (response) {
            $scope.drama = response.data.data;
            console.log($scope.drama);

        });

    });
