angular.module('starter.controllers', [])

.controller('TabCtrl', function($scope, $rootScope){

    $scope.tabTip = {
        messageNum: 0
    };

    console.log(localStorage.getItem("Api-Token"), localStorage.getItem("Talk-Token"));

    $rootScope.chat = {
        "role" : 2,
        "socket": null,
        "init" : function(){
            console.log("init...");
            $rootScope.socket = io.connect('http://59.126.17.211:8124');

            $rootScope.socket.on('connect', function() {
                $rootScope.socket.emit('register', {
                    logintoken: localStorage.getItem("Api-Token"),
                    role: $rootScope.chat.role
                });
            });

            $rootScope.socket.on('message',function(res){
                console.log("on message", res);
            });

            $rootScope.socket.on('Mymasg_unread_num',function(res){
                console.log('Mymasg_unread_num', res);

                if(res.result && res.data.num > 0){
                    $scope.$apply(function() {
                        $scope.tabTip.messageNum = res.data.num;
                    });

                    console.log($scope.tabTip.messageNum);
                }
            });




        },
        "emit": function(channelName, content){
            $rootScope.socket.emit(channelName, content);
        }
    };

    $rootScope.chat.init();

    console.log("TabCtrl");

})
.controller('AppCtrl', function($scope, $rootScope, httpService, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, Users, $http, $ionicLoading, $state, $timeout, PhotoService) {

  $rootScope.user = {
      "Device-Id":"",
      "Talk-Token":"",
      "Api-Token":""
  };

  console.log("AppInitCtrl");

    $scope.onTabSelected = function(v1, v2){
        console.log("onTabSelected",v1, v2);
    };



    localStorage.getItem("Device-Id") !="" ? ($scope.user.phone = localStorage.getItem("Device-Id")) : $scope.user.phone = ""



    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        console.log(toState);

        /*
        $ionicLoading.show()
        $timeout(function(){
            $ionicLoading.hide()
        },1000);
        */
    });


    $scope.$on('tab.shown', function() { console.error('tab.shown Root this should not happen'); });
    $scope.$on('tab.hidden', function() { console.error('tab.hidden Root this should not happen'); });

    $scope.controllerChanged = function(event) {
        console.log('Controller changed', event);
    };

    /*
  if(localStorage.getItem("Device-Id") !="" && localStorage.getItem("Api-Token") != ""){
      httpService.get("/user/info",{
          header: {
              "Device-Id": localStorage.getItem("Device-Id"),
              "Api-Token": localStorage.getItem("Api-Token")
          },
          data:{
          }
      }, null, function(response){
          console.log("check info");
          $scope.goToHome();
      });
  }
*/


/*
$http.get("http://59.127.37.46:8082/gofly/public/api/product/countryList?code=kr",{

}).success(function(response){
    console.log(response);
});
*/
  $scope.user = {
      phone:"",
      account:""
  };

  $scope.friend = {
      list: [],
      myInviteList:[]
  };

  $scope.users = Users.all();




  $scope.toggleMenu = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.hideKeyboard = function() {
    if (typeof cordova !== 'undefined') {
      $timeout(function() {
        cordova.plugins.Keyboard.close();
      }, 500);
    }
  }


  $scope.goToHome = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });




    $timeout(function() {
      $ionicLoading.hide();
      $state.go('tab.home');
      $scope.closeLogin();
      $scope.closeRegister();
      $scope.closeForgotPassword();
    }, 2000);
  };

  $scope.actionSheet = function() {
    var hideSheet = $ionicActionSheet.show({
      // titleText: 'Modify your album',
      buttons: [
        { text: 'Block or report' },
        { text: 'Copy Link' }
      ],
      destructiveText: 'Delete',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        return true;
      }
    });
  }


  // New Post modal
  $scope.newPost = {
    imgSrc: null
  }

  $scope.removePhoto = function() {
    $scope.newPost.imgSrc = null;
  }

  $scope.addPhoto = function() {
    PhotoService.add()
      .then(function(imageData) {
        $scope.newPost.imgSrc = imageData;
      })
  }

  // //Post Modal
  // $ionicModal.fromTemplateUrl('templates/modal/new_post.html', {
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.modalPost = modal;
  // });
  // $scope.openPost = function() {
  //   $scope.modalPost.show();
  // };
  // $scope.closePost = function() {
  //   $scope.modalPost.hide();
  // };

  // Login modal 登入
  $ionicModal.fromTemplateUrl('templates/welcome/login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalLogin = modal;
  });
  $scope.openLogin = function() {
    $scope.modalLogin.show();
  };
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
  };

  // Sign up modal 登出
  $ionicModal.fromTemplateUrl('templates/welcome/register.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalRegister = modal;
  });
  $scope.openRegister = function() {
    $scope.modalRegister.show();
  };
  $scope.closeRegister = function() {
    $scope.modalRegister.hide();
  };

  $ionicModal.fromTemplateUrl('templates/welcome/active.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modalActive = modal;
  });
  $scope.openActive = function() {
      $scope.modalActive.show();
  };
  $scope.closeActive = function() {
      $scope.modalActive.hide();
  };

  $ionicModal.fromTemplateUrl('templates/welcome/account_add.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modalAccountAdd = modal;
  });
  $scope.openAccountAdd = function() {
      $scope.modalAccountAdd.show();
  };
  $scope.closeAccountAdd = function() {
      $scope.modalAccountAdd.hide();
  };

    // Sign up modal
  $ionicModal.fromTemplateUrl('templates/welcome/forgot_password.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modalForgotPassword = modal;
  });
  $scope.openForgotPassword = function() {
      $scope.modalForgotPassword.show();
  };
  $scope.closeForgotPassword = function() {
      $scope.modalForgotPassword.hide();
  };

    $ionicModal.fromTemplateUrl('templates/welcome/modify_password.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalModifyPassword = modal;
    });
    $scope.openModifyPassword = function() {
        $scope.modalModifyPassword.show();
    };
    $scope.closeModifyPassword = function() {
        $scope.modalModifyPassword.hide();
    };

  // Sign up Terms
  $ionicModal.fromTemplateUrl('templates/welcome/terms.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modalTerms = modal;
  });

  $scope.openTerms = function() {
      $scope.modalTerms.show();
  };
  $scope.closeTerms = function() {
      $scope.modalTerms.hide();
  };

  // Sign up Terms
  $ionicModal.fromTemplateUrl('templates/welcome/privacy.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modalPrivacy = modal;
  });

  $scope.openPrivacy = function() {
      $scope.modalPrivacy.show();
  };
  $scope.closePrivacy = function() {
      $scope.modalPrivacy.hide();
  };

    // filter film
    $ionicModal.fromTemplateUrl('templates/home/filter.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalHomeFilter = modal;
    });

    $scope.openHomeFilter = function() {
        $scope.modalHomeFilter.show();
    };
    $scope.closeHomeFilter = function() {
        $scope.modalHomeFilter.hide();
    };

    // filter product
    $ionicModal.fromTemplateUrl('templates/product/filter.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalProductFilter = modal;
    });

    $scope.openProductFilter = function() {
        $scope.modalProductFilter.show();
    };
    $scope.closeProductFilter = function() {
        $scope.modalProductFilter.hide();
    };



  $scope.userRegister = function() {

      console.log("userRegister" + $scope.user.phone);

      $rootScope.user.phone = $scope.user.phone;
      console.log("phone: ", $rootScope.user.phone);

      // params: apiURI, data, success(), moveTo
      httpService.post("/user/getRegCode",{
          data:{
            phone: $scope.user.phone
          }
      },{
        title:"註冊成功",
        content: "請輸入驗證碼"
      },function(response){
        //console.log(response)
          $scope.closeRegister();
          $scope.openActive();
      });


  };

  $scope.reSendActive = function() {

      httpService.post("/user/getRegCode",{
          data:{
            phone: $scope.user.phone
          }
      },{
          title:"重發成功",
          content: "請輸入驗證碼"
      });
  };

    $scope.activeRegister = function() {

    httpService.post("/user/chkRegCode",{
          data:{
              phone: $scope.user.phone,
              regcode: $scope.user.regcode
          }
      },{
          title:"驗證成功",
          content: "請輸想要申請之帳號/密碼資訊"
      },function(response){
          console.log(response.data.data);
          //$rootScope.user["Api-Token"] = response.data.data.regtoken;
          //$rootScope.user["Device-Id"] = $scope.user.phone;

          localStorage.setItem('Api-Token', response.data.data.regtoken);
          //localStorage.setItem('Talk-Token', response.data.data.regtoken);
          localStorage.setItem('Device-Id', $scope.user.phone);

          $scope.openAccountAdd();
          $scope.closeActive();
      });
    };

    $scope.accountAdd = function() {

        httpService.post("/user/register",{
          header: {
            "Device-Id": localStorage.getItem("Device-Id")
          },
          data:{
              account: $scope.user.account,
              password: $scope.user.password,
              regtoken: localStorage.getItem("Api-Token")
          }
        },{
            title:"申請成功",
            content: "請重新登入"
        },function(response){
            $scope.openLogin();
            $scope.closeAccountAdd();
        });
    };

    $scope.login = function() {

        httpService.post("/user/register",{
            header: {
                "Device-Id": localStorage.getItem("Device-Id")
            },
            data:{
                account: $scope.user.account,
                password: $scope.user.password,
                regtoken: localStorage.getItem("Api-Token")
            }
        },{
            title:"申請成功",
            content: "請重新登入"
        },function(response){
            $scope.openLogin();
            $scope.closeAccountAdd();
        });
    };

    $scope.checkLogin = function() {

        httpService.post("/user/login",{
            header: {
                "Device-Id": $scope.user.phone
            },
            data:{
                account: $scope.user.account,
                password: $scope.user.password
            }
        }, null ,function(response){
            console.log(response.data.data.apitoken+' '+response.data.data.apitoken+' '+$scope.user.phone);
            localStorage.setItem('Api-Token', response.data.data.apitoken);
            localStorage.setItem('Talk-Token', response.data.data.talktoken);
            localStorage.setItem('Device-Id', $scope.user.phone);
            $scope.closeAccountAdd();
            $scope.goToHome();
        });
    };



    $scope.forgotPassword = function() {

        httpService.post("/user/forgotPwd",{
            data:{
                phone: $scope.user.phone
            }
        },{
            title:"已傳送驗證碼",
            content: "請輸入驗證碼和新密碼"
        },function(response){
            $scope.openModifyPassword();
            $scope.closeForgotPassword();

        });
    };

    $scope.reSendForgotPassword = function() {

        httpService.post("/user/forgotPwd",{
            data:{
                phone: $scope.user.phone
            }
        },{
            title:"重發成功",
            content: "請輸入驗證碼"
        });
    };


    $scope.modifyPassword = function() {

        httpService.post("/user/changePwd",{
            data:{
                phone: $scope.user.phone,
                password: $scope.user.password,
                regcode: $scope.user.regcode
            }
        },{
            title:"修改成功",
            content: "請重新登入"
        },function(response){
            $scope.openLogin();
            $scope.closeModifyPassword();
        });
    };







})
