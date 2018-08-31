angular.module('starter.drama.controllers', [])
.controller('DramaCtrl', function($rootScope, $scope,$ionicModal, $ionicPopup, httpService, $ionicLoading, $ionicScrollDelegate, $timeout) {

    //$rootScope.chat.init();
    //var dramaMockData = {"result":true,"data":[{"s_id":"27","s_mid":"8","s_country":"\u5357\u97d3","s_content":"\u5287\u672c\u7c21\u4ecb","s_title":"\u97d3\u570b\u4e4b\u65c5","s_pic":"54dd5996862e5bcf0c99afd501d877cb.jpg","s_tags":"","s_startdate":"0000-00-00 00:00:00","s_enddate":"0000-00-00 00:00:00","s_place":"\u9996\u723e","s_num":"3","s_createtime":"2018-01-29 22:46:41","s_updatetime":"2018-01-29 22:46:41","s_ip":"192.168.1.1","s_admin":"","s_ispublic":"<span class=\"label label-success\">\u662f<\/span>","s_isremove":"0"},{"s_id":"23","s_mid":"0","s_country":"\u5fb7\u570b","s_content":"<strong>Day1 \u8d70\u8a2a\u840a\u8335\u6cb3(1230km),\u8461\u8404\u7f8e\u666f<\/strong><br \/>\r\n<img alt=\"\" src=\"upload\/editor\/ed58b6085eba4f80d72a8e256d10b95c.jpg\" \/><br \/>\r\n<strong>Day2 \u8a2a\u6d77\u5fb7\u5821,\u5fb7\u570b\u53e4\u5178\u512a\u96c5\u5927\u5b78\u57ce<\/strong><br \/>\r\n<img alt=\"\" src=\"upload\/editor\/6fc90720acfaef01f2254736809a46e3.jpg\" \/><br \/>\r\n<br \/>\r\n<strong>Day3~5 \u53c3\u8a2a\u5fb7\u570b\u99ac\u724c\u8f2a\u80ce\u4e8b\u696d\u90e8 Continental Gummi-Werke AG<\/strong><br \/>\r\n&nbsp; &nbsp; &nbsp; &nbsp;1871\u5e74\u6210\u7acb\u65bc\u5fb7\u570b\u6f22\u8afe\u5a01\u3002\u5728\u6f22\u8afe\u5a01\u4e3b\u8981\u5de5\u5ee0\u6240\u751f\u7522\u7684\u7522\u54c1\u5305\u62ec\u8edf\u6a61\u81a0\u88fd\u54c1\u3001\u6a61\u81a0\u7e54\u7269\u3001\u53ca\u99ac\u8eca\u548c\u81ea\u884c\u8eca\u7528\u7684\u5be6\u5fc3\u80ce\u3002<br \/>\r\n<img alt=\"\" src=\"upload\/editor\/afffe8c965ec13e9027e103162ed5e72.jpg\" \/><br \/>\r\n<br \/>\r\n<strong>Day6 Go Home<\/strong>","s_title":"\u5fb7\u570b\u8f2a\u80cekills \u53c3\u8a2a","s_pic":"7757635ea39b72b035c7ea77207726aa.jpeg","s_tags":"\u8f2a\u80ce,\u6a61\u81a0\u88fd\u54c1","s_startdate":"0000-00-00 00:00:00","s_enddate":"0000-00-00 00:00:00","s_place":"\u6f22\u8afe\u5a01","s_num":"3","s_createtime":"2017-11-21 12:27:31","s_updatetime":"2017-11-23 11:01:37","s_ip":"192.168.1.1","s_admin":"emily","s_ispublic":"<span class=\"label label-default\">\u5426<\/span>","s_isremove":"0"},{"s_id":"22","s_mid":"0","s_country":"\u53f0\u7063","s_content":"","s_title":"1115","s_pic":"0368bcfda5279e5324fc724cccffafd7.jpeg","s_tags":"","s_startdate":"0000-00-00 00:00:00","s_enddate":"0000-00-00 00:00:00","s_place":"001","s_num":"0","s_createtime":"2017-11-15 15:59:36","s_updatetime":"2017-11-15 16:20:31","s_ip":"36.235.176.253","s_admin":"admin","s_ispublic":"<span class=\"label label-default\">\u5426<\/span>","s_isremove":"0"},{"s_id":"20","s_mid":"0","s_country":"\u65e5\u672c","s_content":"","s_title":"\u304a\u304a\u3055\u304b","s_pic":"2cdf30ac7fe7fa6208ce0cb106dbfcd8.jpg","s_tags":"","s_startdate":"0000-00-00 00:00:00","s_enddate":"0000-00-00 00:00:00","s_place":"","s_num":"","s_createtime":"2017-10-31 16:11:28","s_updatetime":"2017-10-31 16:11:28","s_ip":"36.235.145.154","s_admin":"admin","s_ispublic":"<span class=\"label label-default\">\u5426<\/span>","s_isremove":"0"},{"s_id":"18","s_mid":"0","s_country":"\u65e5\u672c","s_content":"","s_title":"vietnam for 6days","s_pic":"38475c324e4f3cb1ff36521bc465fd6f.JPG","s_tags":"","s_startdate":"0000-00-00 00:00:00","s_enddate":"0000-00-00 00:00:00","s_place":"hanoi","s_num":"2","s_createtime":"2017-10-31 15:58:51","s_updatetime":"2017-10-31 16:02:26","s_ip":"36.235.145.154","s_admin":"admin","s_ispublic":"<span class=\"label label-success\">\u662f<\/span>","s_isremove":"0"},{"s_id":"17","s_mid":"0","s_country":"\u65e5\u672c","s_content":"","s_title":"test zhen-8","s_pic":"7106348b8de54503bb09a13a76c19814.JPG","s_tags":"","s_startdate":"0000-00-00 00:00:00","s_enddate":"0000-00-00 00:00:00","s_place":"\u5927\u962a","s_num":"1","s_createtime":"2017-10-31 15:40:33","s_updatetime":"2017-10-31 15:40:38","s_ip":"36.235.145.154","s_admin":"admin","s_ispublic":"<span class=\"label label-success\">\u662f<\/span>","s_isremove":"0"},{"s_id":"16","s_mid":"0","s_country":"\u5357\u97d3","s_content":"","s_title":"\u97d3\u570b\u4e4b\u65c5","s_pic":"9e656944da22595b8fe2bb191edae7ed.jpg","s_tags":"","s_startdate":"0000-00-00 00:00:00","s_enddate":"0000-00-00 00:00:00","s_place":"\u9996\u723e","s_num":"3","s_createtime":"2017-10-31 15:39:45","s_updatetime":"2017-10-31 15:39:50","s_ip":"36.235.145.154","s_admin":"admin","s_ispublic":"<span class=\"label label-default\">\u5426<\/span>","s_isremove":"0"},{"s_id":"14","s_mid":"0","s_country":"\u65e5\u672c","s_content":"","s_title":"\u65e5\u672c\u6771\u4eac5\u65e5\u904a","s_pic":"2b9e14e22bb2c68f41e09abe521d75b5.JPG","s_tags":"","s_startdate":"0000-00-00 00:00:00","s_enddate":"0000-00-00 00:00:00","s_place":"\u6771\u4eac","s_num":"3","s_createtime":"2017-10-31 14:59:03","s_updatetime":"2017-10-31 16:00:03","s_ip":"36.235.145.154","s_admin":"admin","s_ispublic":"<span class=\"label label-default\">\u5426<\/span>","s_isremove":"0"},{"s_id":"10","s_mid":"0","s_country":"\u5357\u97d3","s_content":"","s_title":"test zhen-5","s_pic":"421fec84cb796b7f464651536a447525.jpg","s_tags":"","s_startdate":"0000-00-00 00:00:00","s_enddate":"0000-00-00 00:00:00","s_place":"666","s_num":"0","s_createtime":"2017-10-31 13:24:30","s_updatetime":"2017-10-31 15:54:37","s_ip":"36.235.145.154","s_admin":"admin","s_ispublic":"<span class=\"label label-success\">\u662f<\/span>","s_isremove":"0"},{"s_id":"9","s_mid":"0","s_country":"\u53f0\u7063","s_content":"","s_title":"test zhen-4\u73fe\u4ee3\u4e3b\u7fa9\u5efa\u7bc9\u6559\u7236 \u2013 \u67ef\u6bd4\u610f130\u6b72\u7279\u5c55\u958b\u5c55\u6642\u959380","s_pic":"e45ae3fce02d8edf05f4d5cd347d7c24.jpg","s_tags":"","s_startdate":"0000-00-00 00:00:00","s_enddate":"0000-00-00 00:00:00","s_place":"\u53f0\u4e2d\u6587\u5275\u5712\u5340","s_num":"123","s_createtime":"2017-10-31 12:02:34","s_updatetime":"2017-10-31 13:13:11","s_ip":"36.235.145.154","s_admin":"admin","s_ispublic":"<span class=\"label label-success\">\u662f<\/span>","s_isremove":"0"}],"page":{"count":"17","page":1,"pagecount":2,"s_start":1,"s_end":2,"begin":0,"show_num":10}};

    $scope.nowPage = 1;
    $scope.lastPage = 20;

    $scope.loadingPage = false;
    $scope.dramaList = [];

    $scope.filterParams = { };

    var getDramaList = function() {

        var filterParams = $scope.filterParams;

        if(filterParams instanceof Object){
            var paramsString = "";
            //console.log(filterParams);

            if(filterParams.keyword != null ){
                paramsString += "&q=" + filterParams.keyword
            }

            if(filterParams.place != null ){
                paramsString += "&place=" + filterParams.place
            }

            if(filterParams.countrytype != '' && filterParams.countrytype ){
                paramsString += "&country=" + filterParams.countryType
            }

        }

        if($scope.nowPage == 1){
            $scope.dramaList = [];
        }

        httpService.get("/script/getList?page=" + $scope.nowPage + "&pageSize=5" + paramsString, {
            header: {
                "Device-Id": localStorage.getItem("Device-Id"),
                "Api-Token": localStorage.getItem("Api-Token")
            }
        }, null, function (response) {

            $scope.loadingPage = false;
            $scope.nowPage++;
            $scope.lastPage = response.data.data.last_page;



            if (response.data.data.list.length != 0) {
                $scope.dramaList = $scope.dramaList.concat(response.data.data.list);
                console.log($scope.productList);
            }

            $ionicLoading.hide({
                template: '<ion-spinner></ion-spinner>'
            })
        });
    }

    getDramaList();

    $scope.prePage = function() {
        // Stop the ion-refresher from spinning
        console.log("prePage");
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.nextPage = function() {
        // Stop the ion-infiniteScrollComplete from spinning
        console.log("nextPage");

        getDramaList();


        setTimeout(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete')
        }, 2000);
    };


    //$scope.dramaList = dramaMockData.data;

    console.log("Drama Ctrl", $scope.dramaList.length);

    $scope.messages = {
        "title":"test message",
        "content":"test content"
    }




    httpService.get("/product/countryList", {
        header: {
            "Device-Id": localStorage.getItem("Device-Id"),
            "Api-Token": localStorage.getItem("Api-Token")
        }
    }, null, function (response) {


        $scope.countryList = response.data.data;
        //console.log($scope.countryList);

    });

    $ionicModal.fromTemplateUrl('templates/modal/new_post.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modalPost = modal;
    });
    $scope.openPost = function () {
      $scope.modalPost.show();
    };
    $scope.closePost = function () {
      $scope.modalPost.hide();
    };

    $scope.showFilterPopup = function(){
        var myPopup = $ionicPopup.show({
            cssClass: 'add-to-cart-popup',
            templateUrl: 'templates/popup/filter_drama.html',
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

                getDramaList();



            } else {
                console.log('Popup closed');
            }
        });
    };

});
