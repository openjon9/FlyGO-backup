angular.module('starter.messaging.controllers', [])
.controller('MessagingCtrl', function($rootScope, $scope, $ionicScrollDelegate, $timeout) {

    console.log("MessagingCtrl");

    var currentTime = new Date();

    $rootScope.socket.on('talkacc_list show', function(res){
        if(res.result && res.data.data instanceof Object){
            console.log('talkacc_list show', res);

            $scope.$apply(function(){
                $scope.messageQueue = res.data.data;
            });
        }
    });

    var getTalkList = function() {
        $rootScope.socket.emit('call talkacc_list', {
            "e_date": currentTime.getFullYear() + "-" + (parseInt(currentTime.getMonth()) + 1) + "-" + currentTime.getDate(),
            "logintoken": localStorage.getItem("Api-Token"),
            "notin": [],
            "now_active_id": localStorage.getItem("Talk-Token"),
            "role": 2,
            "talkrole": "2",
            "type": "1"
        });
    }

    getTalkList();

    $scope.messageQueue = [];

    $scope.filterFriendName = {
        name: ''
    };

    $scope.filterMyFriend = function(){

        console.log($scope.filterFriendName.name);
        if($scope.filterFriendName.name == ""){
            getTalkList();
        };

        var acceptedValues = $scope.filterFriendName.name;
        var myObject = $scope.messageQueue;

        //console.log(acceptedValues);

        $scope.messageQueue = Object.keys(myObject).reduce(function(r, e) {
            //console.log(myObject[e].acc);
            if (myObject[e].acc.includes(acceptedValues)) {
                r[e] = myObject[e];
                console.log(r);
            }
            return r;
        }, {});

    };

});
