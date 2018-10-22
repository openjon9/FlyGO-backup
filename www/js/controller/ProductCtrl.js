angular.module('starter.product.controllers', [])
.controller('ProductCtrl', function($scope, $ionicPopup, $stateParams,  $ionicLoading, httpService, $ionicScrollDelegate, $timeout) {

    $scope.productType = [];


    $scope.filterParams = {
        type2List: [],
        countryType: '',
        sortBy: 'new',
        type1: null,
        type2: null
    };


    httpService.get("/product/typeList", {
        header: {
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
        }
    }, null, function (response) {

        $scope.productType = response.data.data;

    });

    httpService.get("/product/countryList", {
        header: {
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
        }
    }, null, function (response) {


        $scope.countryList = response.data.data;
        //console.log($scope.countryList);

    });

    $scope.nowPage = 1;
    $scope.lastPage = 20;

    $scope.loadingPage = false;
    $scope.productList = [];



    var getProductList = function(){

        var filterParams = $scope.filterParams;

        if(filterParams instanceof Object){
            var paramsString = "";
            //console.log(filterParams);

            if(filterParams.keyword != null ){
                paramsString += "&q=" + filterParams.keyword
            }

            if(filterParams.type1 != null ){
                paramsString += "&type1=" + filterParams.type1
            }

            if(filterParams.type2 != null ){
                paramsString += "&type2=" + filterParams.type2
            }

            if(filterParams.countrytype != '' ){
                paramsString += "&country=" + filterParams.countryType
            }

            if(filterParams.sortBy != null ){
                paramsString += "&sortBy=" + filterParams.sortBy
            }
        }

        if(!$scope.loadingPage && $scope.nowPage <= $scope.lastPage) {
            console.log($scope.nowPage, paramsString);

            $scope.loadingPage = true;
            httpService.get("/product/getList?page=" + $scope.nowPage + "&pageSize=10" + paramsString, {
                header: {
                    "Device-Id": localStorage.getItem("Device-Id"),
                    "Api-Token": localStorage.getItem("Api-Token")
                }
            }, null, function (response) {

                $scope.loadingPage = false;
                $scope.nowPage++;
                $scope.lastPage = response.data.data.last_page;

                //console.log($scope.productList.length, response.data.data.list.length, response.data.data.last_page);


                //console.log(response.data.data.list);

                if(response.data.data.list.length != 0) {
                    $scope.productList = $scope.productList.concat(response.data.data.list);
                    console.log($scope.productList);
                }

                $ionicLoading.hide({
                    template: '<ion-spinner></ion-spinner>'
                })
            });
        }else{
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
    };

    getProductList();


    $scope.prePage = function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.nextPage = function() {
        // Stop the ion-infiniteScrollComplete from spinning
        console.log("xxx");

        getProductList();


        setTimeout(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete')
        }, 2000);
    };


    $scope.changeType1Selected = function(res) {
        console.log($scope.filterParams.type1);
        $scope.filterParams.type2List = $scope.productType.filter(x => x.id === $scope.filterParams.type1)[0].type2;
    };


    $scope.resetParams = function(){
        $scope.filterParams = {
            countryType: '',
            sortBy: 'new',
            type1: null,
            type2: null
        };
    };

    $scope.showFilterPopup = function(product) {

        var myPopup = $ionicPopup.show({
            cssClass: 'add-to-cart-popup',
            templateUrl: 'templates/popup/filter_product.html',
            title: '進階搜尋',
            scope: $scope,
            buttons: [
                { text: '', type: 'close-popup ion-ios-close-outline' },

                { text: '搜尋', onTap: function(e) {
                    //console.log($scope.filterParams);
                        return $scope.filterParams;
                    }
                }

            ]
        });
        myPopup.then(function(res) {
            console.log(res);
            if(res) {
                $ionicLoading.show({
                    template: '<ion-spinner icon="ios"></ion-spinner><p style="margin: 5px 0 0 0;">搜尋中</p>',
                    duration: 1000
                });

                $scope.nowPage = 1;
                //$scope.lastPage = 20;

                $scope.loadingPage = false;
                $scope.productList = [];

                getProductList();



            } else {
                console.log('Popup closed');
            }
        });
    };


    $scope.default_list_id = [];

    httpService.get("/shop/getList", {
        header: {
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
        }
    }, null, function (response) {
        if(response.data.data.length>0){
          $scope.shoppingDetail = response.data.data;
          console.log($scope.shoppingDetail);

          $scope.default_list_id = $scope.shoppingDetail[0].list_id;
          console.log($scope.shoppingDetail[0].list_id);
        }else{
          console.log("f")
        }

    });

    $scope.showAddToCartPopup = function(obj) {


        console.log(obj);
        $scope.data = {};
        $scope.data.product = { title: obj.title, price: obj.price, currency: obj.currency, eprice: obj.eprice};//{ title: $scope.detail.title, price: $scope.detail.eprice};//product;
        $scope.data.productOption = 1;
        $scope.data.productQuantity = 1;
        console.log($scope.default_list_id);
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
                        pno: obj.pno,
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
