angular.module('starter.shoppingDetail.controllers', [])
    .controller('ShoppingDetailCtrl', function($scope, httpService, $stateParams, $ionicPopup, $ionicLoading, $state, $ionicScrollDelegate, $timeout) {

        console.log("ShoppingDetailCtrl");
        $scope.messages = {
            "title":"test message",
            "content":"test content"
        }

        $scope.shoppingDetail = {
            end_time: "2018/05/23",
            ispublic:1,
            items:[],
            list_id: 3,
            memo: "",
            paytype: 0,
            status : 1,
            title: ""
        };



        var getDetail = function() {
            httpService.get("/shop/getListDetail/" + $stateParams.list_id, {
                header: {
                    "Device-Id": localStorage.getItem("Device-Id"),
                    "Api-Token": localStorage.getItem("Api-Token")
                }
            }, null, function (response) {
                $scope.shoppingDetail = response.data.data;
                console.log($scope.shoppingDetail);
            });
        };

        getDetail();

        $scope.deleteMyList = function(){
            console.log($stateParams);

            var myPopup = $ionicPopup.show({
                cssClass: 'add-to-cart-popup',
                templateUrl: 'templates/popup/delete-cart-popup.html',
                title: '刪除此清單',
                scope: $scope,
                buttons: [
                    { text: '', type: 'close-popup ion-ios-close-outline' },
                    {
                        text: '確定刪除',
                        onTap: function(e) {

                            console.log($scope.shoppingDetail);

                            return $scope.shoppingDetail;
                        }
                    }
                ]
            });

            myPopup.then(function(res) {
                console.log(res);

                    httpService.post("/shop/delList/" + res.list_id, {
                        header: {
                            "Device-Id": localStorage.getItem("Device-Id"),
                            "Api-Token": localStorage.getItem("Api-Token")
                        }
                    }, {
                        title: "刪除成功",
                        content: "清單已刪除"
                    }, function (response) {

                        console.log(response)
                        $state.go('tab.shopping');
                    });

            });
        };

        $scope.deleteFromList = function(res){
            console.log(res);
            $scope.item = res.product;


            var myPopup = $ionicPopup.show({
                cssClass: 'add-to-cart-popup',
                templateUrl: 'templates/popup/delete-from-cart-popup.html',
                title: '刪除此產品',
                scope: $scope,
                buttons: [{
                    text: '',
                    type: 'close-popup ion-ios-close-outline'
                },{
                    text: '確定刪除',
                    onTap: function(e) {
                        console.log(res.idx);

                        return $scope.shoppingDetail.items[res.idx];
                    }
                }]
            });


            myPopup.then(function(res) {
                console.log(res);


                if(res && res.item_id) {
                    httpService.post("/shop/delItem/" + res.item_id, {
                        header: {
                            "Device-Id": localStorage.getItem("Device-Id"),
                            "Api-Token": localStorage.getItem("Api-Token")
                        }
                    }, {
                        title: "刪除成功",
                        content: "訂單產品已刪除"
                    }, function (response) {
                        $scope.shoppingDetail.items.splice(res.idx, 1);
                        console.log(response);
                    });
                }

            });

        };


        $scope.changeQtySelected = function(res) {
            console.log($scope.shop.qty);
        };

        $scope.shop = {
            qty : null
        };

        $scope.updateShopNum = function(qty, item_id) {
            console.log(qty, item_id);
            $scope.shop.qty = qty;



            var myPopup = $ionicPopup.show({
                cssClass: 'add-to-cart-popup',
                templateUrl: 'templates/popup/update_shop_num.html',
                title: '資訊更新',
                scope: $scope,
                buttons: [
                    {text: '', type: 'close-popup ion-ios-close-outline'},

                    {
                        text: '更新', onTap: function (e) {
                            console.log($scope.shop.qty);
                            return { qty: $scope.shop.qty, item_id: item_id };
                        }
                    }

                ]
            });

            myPopup.then(function (obj) {

                if (obj && typeof obj.qty) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">更新中</p>',
                        duration: 1000
                    });

                    httpService.post("/shop/editItem",{
                        header: {
                            "Device-Id": localStorage.getItem("Device-Id"),
                            "Api-Token": localStorage.getItem("Api-Token")
                        },
                        data: {
                            item_id: obj.item_id,
                            qty: obj.qty,
                            fee: 100
                        }
                    },{
                        title:"更新成功",
                        content: "資訊已更新"
                    },function(response){

                        if(response.data.success){
                            getDetail();
                        };

                        console.log(response)
                        //$scope.closeRegister();
                        //$scope.openActive();
                    });

                } else {
                    console.log('Popup closed');
                }
            });
        };

    });
