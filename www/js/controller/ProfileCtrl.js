angular.module('starter.profile.controllers', [])
.controller('ProfileCtrl', function($scope, $stateParams, $state, $ionicActionSheet, $ionicPopup, $ionicLoading, httpService, $ionicScrollDelegate, $timeout) {

    console.log($stateParams);
    $scope.profile = {
        "acc":"",
        "gender": "0",
        "nickname":"",
        "place":"",
        "username":"",
        "shoppingListNum": 0,
        "joinNum":0,
        "birthday":"1990/01/01",
        "pic":""
    };

    $scope.shoppingList = [];


    var getProfile = function(){
        console.log($stateParams.uid);
        $scope.shoppingList = [];
        httpService.get("/user/info/"+$stateParams.uid,{
            header: {
                "Device-Id": localStorage.getItem("Device-Id"),
                "Api-Token": localStorage.getItem("Api-Token")
            }
        },null,function(response){
            console.log(response)
            var profileData = response.data.data;

            $scope.shoppingList = response.data.data.shoplist;
            console.log($scope.shoppingList);

            Object.assign($scope.profile, profileData);


            $scope.isMyInfo = ($stateParams.uid? false:true);
            console.log($scope.profile);

        });
    };

    getProfile();


    var getShoppingList = function(){


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

            if(response.data.data.length != 0) {
                $scope.shoppingList = response.data.data;
            }else{
                $scope.shoppingList = [];
            }

            $ionicLoading.hide({
                template: '<ion-spinner></ion-spinner>'
            })
        });
        //$scope.$broadcast('scroll.infiniteScrollComplete');

    };

    //getShoppingList();

    $scope.updateProfilePopup = function() {

        var myPopup = $ionicPopup.show({
            cssClass: 'add-to-cart-popup',
            templateUrl: 'templates/popup/update_profile.html',
            title: '資訊更新',
            scope: $scope,
            buttons: [
                {text: '', type: 'close-popup ion-ios-close-outline'},

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
            if(res.pic) res.pic = "";

            if (res) {
                $ionicLoading.show({
                    template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">更新中</p>',
                    duration: 1000
                });

                httpService.post("/user/update",{
                    header: {
                        "Device-Id": localStorage.getItem("Device-Id"),
                        "Api-Token": localStorage.getItem("Api-Token")
                    },
                    data: res
                },{
                    title:"更新成功",
                    content: "資訊已更新"
                },function(response){

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

    $scope.actionSheet = function() {
        var hideSheet = $ionicActionSheet.show({
            // titleText: 'Modify your album',
            buttons: [
                { text: '封鎖使用者' },
                { text: '刪除使用者' }
            ],
            //destructiveText: '刪除使用者',
            cancelText: '取消',
            cancel: function() {
                console.log("cancel");
                // add cancel code..
            },
            //destructiveButtonClicked: function(){
            //    console.log("Delete");
            //},
            buttonClicked: function(action) {

                if(action){
                    var msg = "已刪除"; // 2
               }else{
                    var msg = "已封鎖"; //1
                }

                httpService.post("/friends/ban",{
                    header: {
                        "Device-Id": localStorage.getItem("Device-Id"),
                        "Api-Token": localStorage.getItem("Api-Token")
                    },
                    data: {
                        fid: $stateParams.uid,
                        action: (action +1)
                    }
                },{
                    title:"更新成功",
                    content: msg
                },function(response){

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
});
