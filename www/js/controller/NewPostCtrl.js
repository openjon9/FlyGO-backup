angular.module('starter.newpost.controllers', [])
  .controller('NewPostCtrl', function ($scope, $ionicLoading, httpService, $ionicScrollDelegate, $timeout, PhotoService,$state) {
    console.log("NewPostCtrl");
    $scope.newPost = {
      imgSrc: null
    }

    // $scope.post.title='test';
    // var postDataModel={
    //   model:{
    //     title:$scope.dramapost.title,
    //     country:$scope.yourSelectCountry,
    //     location:$scope.dramapost.location
    //   }
    // }





    $scope.removePhoto = function () {
      $scope.newPost.imgSrc = null;
    }

    $scope.addPhoto = function () {
      PhotoService.add()
        .then(function (imageData) {
          $scope.newPost.imgSrc = imageData;
        })
    }



  });
