angular.module('starter.productDetail.controllers', [])
.controller('ProductDetailCtrl', function($scope, $ionicPopup, $ionicSlideBoxDelegate, $ionicLoading, $stateParams, httpService, $ionicScrollDelegate, $timeout) {

    console.log($stateParams);

    console.log("ProductDetailCtrl");
    $scope.messages = {
        "title":"test message",
        "content":"test content"
    }

    $scope.default_list_id = null;

    $scope.pic_loaded = false;

    httpService.get("/shop/getList", {
        header: {
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
        }
    }, null, function (response) {
        $scope.shoppingDetail = response.data.data;

        console.log($scope.shoppingDetail);
        $scope.default_list_id = $scope.shoppingDetail[0].list_id;

        $timeout( function() {
            $ionicSlideBoxDelegate.update();
            $scope.pic_loaded = true;
        }, 200);

    });

    httpService.get("/product/getDetail?pno=" + $stateParams.pno, {
        header: {
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
        }
    }, null, function (response) {
        $scope.detail = response.data.data;
        console.log($scope.detail);
    });

    $scope.changeListSelected = function(res){
        console.log(this.addList);
        //$scope.newList = this.addList;
        //console.log($scope.newList);

    }


    $scope.showAddToCartPopup = function(product) {
        $scope.data = {};
        $scope.data.product = {
            title: $scope.detail.title,
            price: $scope.detail.price,
            eprice: $scope.detail.eprice,
            currency: $scope.detail.currency
        };//product;
        $scope.data.productOption = 1;
        $scope.data.productQuantity = 1;

        $scope.addList = {
            "num": 1,
            "list_id": $scope.default_list_id
        };

        var myPopup = $ionicPopup.show({
            cssClass: 'add-to-cart-popup',
            templateUrl: 'templates/popup/add-to-cart-popup.html',
            title: '加入清單',
            scope: $scope,
            buttons: [
                { text: '', type: 'close-popup ion-ios-close-outline' },
                {
                    text: '確定加入',
                    onTap: function(e) {

                        console.log($scope.addList);

                        //console.log(e, $scope);

                        //console.log($scope.list_id);

                        return $scope.addList;
                    }
                }
            ]
        });

        myPopup.then(function(res) {
            console.log(res);
            if(res) {
                $ionicLoading.show({
                    template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">加入中</p>',
                    duration: 1000
                });

                console.log($scope.addList);


                httpService.post("/shop/addItem",{
                    header: {
                        //"Device-Id": "0970030222",
                        //"Api-Token": "rWZuyCs6hdHBuLaQLksXvF7TWCOmK0iW1Kh0rbDSAFT1WAXfK6PAa0iZBLf1"
                        "Device-Id": localStorage.getItem("Device-Id"),
                        "Api-Token": localStorage.getItem("Api-Token")
                    },
                    data:{
                        list_id: res.list_id,
                        pno: $stateParams.pno,
                        qty: res.num
                    }
                },{
                    title:"新增成功",
                    content: "清單已新增"
                },function(response){

                    $ionicLoading.hide({
                        template: '<ion-spinner></ion-spinner>'
                    });

                    console.log($stateParams);

                    //getShoppingList();

                    console.log(response)
                    //$scope.closeRegister();
                    //$scope.openActive();
                });

                //ShopService.addProductToCart(res.product);

                console.log('Item added to cart!', res);

            } else {
                console.log('Popup closed');
            }
        });
    };



});
