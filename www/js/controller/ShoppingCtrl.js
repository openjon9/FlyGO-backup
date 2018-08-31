angular.module('starter.shopping.controllers', [])
.controller('ShoppingCtrl', function($scope, $ionicPopup, $ionicLoading, httpService, $ionicScrollDelegate, $timeout) {

    console.log("Shopping Ctrl");
    $scope.messages = {
        "title":"test message",
        "content":"test content"
    }

    $scope.shoppingList = [];


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

            }

            $ionicLoading.hide({
                template: '<ion-spinner></ion-spinner>'
            })
        });
        //$scope.$broadcast('scroll.infiniteScrollComplete');

    };

    getShoppingList();

    $scope.showAddToListPopup = function(product) {
        $scope.addList = {
            "name": null,
            "list_id": null,
            "pay": 0
        };

        $scope.payMethod = [{
            "key": 0,
            "value" : "無"
        },{
            "key": 1,
            "value" : "預先付款"
        },{
            "key": 2,
            "value" : "貨到付款"
        }];

        var myPopup = $ionicPopup.show({
            cssClass: 'add-to-cart-popup',
            templateUrl: 'templates/popup/add_shopping_list.html',
            title: '新增清單',
            scope: $scope,
            buttons: [{
                text: '',
                type: 'close-popup ion-ios-close-outline'
            },{
                text: '確定新增',
                onTap: function(e) {
                    console.log($scope.addList);

                    /*
                    $ionicLoading.show({
                        template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">新增中</p>'
                    });
*/

                    console.log($scope.addList.title == undefined);

                    if($scope.addList.title!=undefined) {

                        httpService.post("/shop/addList", {
                            header: {
                                //"Device-Id": "0970030222",
                                //"Api-Token": "rWZuyCs6hdHBuLaQLksXvF7TWCOmK0iW1Kh0rbDSAFT1WAXfK6PAa0iZBLf1"
                                "Device-Id": localStorage.getItem("Device-Id"),
                                "Api-Token": localStorage.getItem("Api-Token")
                            },
                            data: {
                                title: $scope.addList.title,
                                end_time: "2017/2/11",
                                ispublic: 1,
                                paytype: $scope.addList.pay,
                                memo: $scope.addList.note
                            }
                        }, {
                            title: "新增成功",
                            content: "清單已新增"
                        }, function (response) {

                            getShoppingList();

                            console.log(response)
                            //$scope.closeRegister();
                            //$scope.openActive();
                        });

                        return $scope.data;
                    }else{
                        $ionicLoading.show({
                            template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">清單名稱不能為空值</p>',
                            duration: 2000
                        });

                        return "";
                    }
                }
            }]
        });

        myPopup.then(function(res) {
            if(res) {
                $ionicLoading.show({
                    template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">新增中</p>',
                    duration: 1000
                });

                //ShopService.addProductToCart(res.product);



                console.log('Item added to list!');

            } else {
                console.log('Popup closed');
            }
        });
    };

});
