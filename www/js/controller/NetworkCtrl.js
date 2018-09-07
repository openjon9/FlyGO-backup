angular.module('starter.network.controllers', [])
.controller('NetworkCtrl', function($scope, $ionicModal, $ionicLoading, httpService, $ionicScrollDelegate, $timeout) {

    console.log("NetworkCtrl");



    // Add connection modal
    $ionicModal.fromTemplateUrl('templates/modal/new_connection.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalAdd = modal;
    });
    $scope.openAdd = function() {
        $scope.modalAdd.show();
    };
    $scope.closeAdd = function() {
        $scope.modalAdd.hide();
    };


    // Add connection modal
    $scope.dividerFunction = function(key){
        return key;
    }

    $scope.search = {
        friendsName: ""
    }

    $scope.searchFriends = function(){

        console.log('searchFriends');

        //console.log($scope.search.friendsName);
        //$ionicLoading.show({
        //    template: '<ion-spinner></ion-spinner>'
        //});
        /*
                var mock = {
                    "success": true,
                    "data": {
                        "current_page": 1,
                        "first_page_url": "http://59.127.37.46:8082/gofly/public/api/friends/userList?page=1",
                        "from": 1,
                        "last_page": 1,
                        "last_page_url": "http://59.127.37.46:8082/gofly/public/api/friends/userList?page=1",
                        "next_page_url": null,
                        "path": "http://59.127.37.46:8082/gofly/public/api/friends/userList",
                        "per_page": 10,
                        "prev_page_url": null,
                        "to": 1,
                        "total": 1,
                        "list": [
                            {
                                "id": 20,
                                "acc": "Flygo",
                                "name": ""
                            }
                        ]
                    },
                    "msg": "成功",
                    "msgcode": "0000"
                };

                $scope.search.searchList = mock.data.list;

                console.log($scope.search.searchList);
        */

        httpService.get("/friends/userList?page=1&pageSize=20&q="+$scope.search.friendsName,{
            header: {
                "Device-Id": localStorage.getItem("Device-Id"),
                "Api-Token": localStorage.getItem("Api-Token")
            }
            /*
            data:{
                page: 1,
                pageSize: 20,
                q: $scope.search.friendsName
            }
            */
        },null,function(response){
            console.log(response);
            $scope.search.searchList = response.data.data.list;
            $ionicLoading.hide({
                template: '<ion-spinner></ion-spinner>'
            })
        });

        /*
        $timeout(function(){
            $ionicLoading.hide({
                template: '<ion-spinner></ion-spinner>'
            });
        },2000);
        */
    };

    $scope.addFriend = function(id, idx, pop){
        httpService.post("/friends/invite",{
            header: {
                "Device-Id": localStorage.getItem("Device-Id"),
                "Api-Token": localStorage.getItem("Api-Token")
            },
            data:{
                fid: id
            }
        },{
            title: "邀請好友",
            content: "邀請成功"
        },function(response){
            console.log(response);
            //移除item
            if(pop)$scope.search.searchList.splice(idx, 1);
            console.log(idx,$scope.search.searchList);
            //getFriends();
        });
    };

    //var items = Users.all();

    $scope.connections = []; //items;
    $scope.disconnections = [];
    /*
      items.sort(function(a,b){
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
    */

    $scope.filterFriendName = {
        name: ''
    };

    $scope.filterMyFriend = function(){

        console.log($scope.filterFriendName.name);
        if($scope.filterFriendName.name == ""){
            getFriends();
        };

        var acceptedValues = $scope.filterFriendName.name;
        var myObject = $scope.connections;

        //console.log(acceptedValues);

        $scope.connections = Object.keys(myObject).reduce(function(r, e) {
            //console.log(myObject[e].acc);
            if (myObject[e].acc.includes(acceptedValues)) {
                r[e] = myObject[e];
                console.log(r);
            }
            return r;
        }, {});

    };

    var getFriends = function(){
        httpService.get("/friends/list",{
            header: {
                "Device-Id": localStorage.getItem("Device-Id"),
                "Api-Token": localStorage.getItem("Api-Token")
            }
        },null,function(response){
            console.log(response)
            var items = response.data.data.list;

            items.sort(function(a,b){
                var textA = a.acc.toUpperCase();
                var textB = b.acc.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

            console.log("items:", items);

            $scope.connections = items;
        });
    };

    getFriends();

    var getUnFriends = function(){
        httpService.get("/friends/bannedList",{
            header: {
                "Device-Id": localStorage.getItem("Device-Id"),
                "Api-Token": localStorage.getItem("Api-Token")
            }
        },null,function(response){
            console.log(response)
            var items = response.data.data.list;

            items.sort(function(a,b){
                var textA = a.acc.toUpperCase();
                var textB = b.acc.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

            console.log("items:", items);

            $scope.disconnections = items;
        });
    };

    getUnFriends();

    $ionicModal.fromTemplateUrl('templates/modal/connections.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalConnections = modal;
    });
    $scope.openConnections = function() {
        $scope.modalConnections.show();
        $scope.getInviteList();
    };
    $scope.closeConnections = function() {
        $scope.modalConnections.hide();
        getFriends();
    };




    $scope.getInviteList = function(){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        httpService.get("/friends/getInviteList",{
            header: {
                "Device-Id": localStorage.getItem("Device-Id"),
                "Api-Token": localStorage.getItem("Api-Token")
            }
        },null,function(response){
            console.log(response);
            $scope.friend = {
                myInviteList : response.data.data
            };

            $ionicLoading.hide();
        });
    };

    /*
        $scope.removeInviteListItem = function(idx){
            $scope.friend.myInviteList.splice(idx, 1);
            console.log(idx,$scope.friend.myInviteList);
        };
    */

    $scope.confirmInvite = function(idx, userId, action){
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        });

        httpService.post("/friends/confirm",{
            header: {
                "Device-Id": localStorage.getItem("Device-Id"),
                "Api-Token": localStorage.getItem("Api-Token")
            },
            data: {
                "fid": userId,
                "action": action
            }
        },{
            title: "交友邀請",
            content: "已確認邀請"
        },function(response){
            console.log(response);

            $scope.friend.myInviteList.splice(idx, 1);
            console.log(idx,$scope.friend.myInviteList);

            $ionicLoading.hide();
        });
    };




});
