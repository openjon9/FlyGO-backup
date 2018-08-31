angular.module('starter.chat.controllers', [])
.controller('ChatDetailCtrl', function($scope, $stateParams, $rootScope, $ionicScrollDelegate, $timeout) {

    console.log("ChatDetailCtrl");
    console.log($stateParams);

    var currentTime = new Date();

    $scope.talkTo = $stateParams.acc;

    $rootScope.socket.on('talk show', function(res){
        if(res.result && res.data.data instanceof Object){
            console.log('talkacc_list show', res);

            $scope.messages = res.data.data;
            $scope.chatProfile = res.data.row;
            console.log($scope.chatProfile);

        }
        //_scrollBottom();
    });

    $rootScope.socket.on('msg sendMsg_show', function(res){
        if(res.result && res.data.data instanceof Object){
            console.log('msg sendMsg_show', res);

            //$scope.messages = res.data.data;

            $scope.$apply(function() {
                $scope.messages.push({
                    //isMe: (res.data.data.token_id == localStorage.getItem("Talk-Token"))? true:false,
                    acc: res.data.data.acc,
                    avatar: 'img/adam.png',
                    info: {
                        msg: res.data.data.info.msg,
                        type: 'text'
                    },
                    time: res.data.data.time
                });
            });

            $scope.message = '';
            _scrollBottom();
        }
        _scrollBottom();
    });


    $rootScope.socket.emit('msg list', {
        "e_date": currentTime.getFullYear() + "-"+ (parseInt(currentTime.getMonth()) + 1)+"-"+ currentTime.getDate(),
        "logintoken": localStorage.getItem("Api-Token"),
        "talktoken_id": $stateParams.uid,
        "role": 2,
        "talkrole": "2",
        "type": "1"
    });


    $scope.messages = [];

    $scope.message = '';
    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

    $scope.sendText = function() {

        var messageBody = {
            "info" : {
                "msg": $scope.message
            },
            "type": "text",
            "logintoken" : localStorage.getItem("Api-Token"),
            "role" : 2,
            "talkrole" : "2",
            "talktoken_id" : $stateParams.uid
        };

        $rootScope.socket.emit('msg sendMsg', messageBody);
/*
        $scope.messages.push({
            isMe: true,
            type: 'text',
            info: {
                msg: $scope.message
            },
            time: new Date()
        });
        */
        $scope.message = '';
        _scrollBottom();
        //$scope.fakeReply();
    }

    /*
    $scope.fakeReply = function() {
        $timeout(function() {
            $scope.messages.push({
                isMe: false,
                avatar: 'img/adam.jpg',
                type: 'text',
                body: '坐他理以。先現太任，向表後去行我等星面合小友們麼個性不蘭。',
                timestamp: new Date()
            });
            $scope.message = '';
            _scrollBottom();
        }, 2000)
    }
*/
    var _scrollBottom = function(target) {
        target = target || '#type-area';

        viewScroll.scrollBottom(true);
        _keepKeyboardOpen(target);
    }

    // Warning: Demo purpose only. Stay away from DOM manipulating like this
    var _keepKeyboardOpen = function(target) {
        target = target || '#type-area';

        txtInput = angular.element(document.body.querySelector(target));
        console.log('keepKeyboardOpen ' + target);
        txtInput.one('blur', function() {
            console.log('textarea blur, focus back on it');
            txtInput[0].focus();
        });
    }

    /* new Functions as below */

    /*
        {
                isMe: false,
                avatar: 'img/adam.jpg',
                type: 'text',// text || image
                body: '往了小長；議終生我清離球白……食動個家大苦產多氣客者你的。無岸千麼學明孩趣演只……重上國，能公個公動新清效此中會勢難落現人一一教似應點代牛我。價球經機劇開而母準命即見理型不不，這人書集裝，技美語施黑：的環權媽我光；十放係影電房工年相辦以自樂……外部美字，位了眼腳人體供到去長多積說那導和了情，請觀滿因以也的成友，下的時媽不明更功在手關？無的能斯土本，便山成回麼，戰友賣素上：分標造：多以馬的為。知的國驚；和山易家要裡交案。期找子於人斷大特！已始本市了著城沒地藝為得服這子些整劇生信好之著投公靜重我在要對值我任存自，經山視了著士產們是省去電果意說習廣次？體有故最如有難界，待合約部運她。',
                timestamp: '2017/12/11 00:30:13'
            },
            {
                isMe: true,
                type: 'text',// text || image
                body: '求時著止到的府子一那懷學度研心明里也間文聲輪可各頭斯著區即林的參處情來兩更還眼的得像室為家歡高事好或府水了那對於！',
                timestamp: '2017/12/11 00:30:16'
            },
            {
                isMe: false,
                avatar: 'img/adam.jpg',
                type: 'text',// text || image
                body: '公法邊害險銀轉公此生本是作車和接據，會深復快此經一氣樣了歌女動看達內手名只只然過。',
                timestamp: '2017/12/11 00:30:13'
            }
            */

})
