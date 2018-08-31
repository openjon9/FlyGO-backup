// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'starter.controllers',
    'starter.services',
    'starter.directives',
    'starter.filters',
    'starter.chat.controllers',
    'starter.messaging.controllers',
    'starter.network.controllers',
    'starter.product.controllers',
    'starter.productDetail.controllers',
    'starter.drama.controllers',
    'starter.drama.post.controllers',
    'starter.shopping.controllers',
    'starter.shoppingDetail.controllers',
    'starter.profile.controllers',


    'ionic.ion.autoListDivider',
    'monospaced.elastic',
    'ngCordova'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(false);
    }



    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider, $httpProvider) {
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
  $ionicConfigProvider.navBar
    .alignTitle('center')
    .positionPrimaryButtons('left')
    .positionSecondaryButtons('right');

  //console.log($httpProvider.defaults.headers.common);

  $ionicConfigProvider.tabs
    .position('bottom')
    .style('standard');

    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
/*
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {
    "Content-Type":"application/json"
  };
  $httpProvider.defaults.headers.get = {};
  $httpProvider.defaults.headers.patch = {};
  */
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    /*WELCOME*/
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome/intro.html',
      controller: 'AppCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        //abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'TabCtrl'

    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
      url: '/home',
        //cache: false,
        views: {
        'home': {
          templateUrl: 'templates/home/home.html',
          controller: 'DramaCtrl'
        }
      }
    })

    .state('tab.post', {
        url: '/post/:id',
        cache: false,
        views: {
            'home': {
                templateUrl: 'templates/home/post.html',
                controller: 'DramaPostCtrl'
            }
        }
    })

    .state('tab.product', {
        url: '/product',
        //cache: false,
        views: {
            'product': {
                templateUrl: 'templates/product/list.html',
                controller: 'ProductCtrl'
            }
        }
    })


    .state('tab.productDetail', {
      url: '/productDetail/:pno',
      cache: false,
      views: {
          'product': {
              templateUrl: 'templates/product/detail.html',
              controller: 'ProductDetailCtrl'
          }
      }
    })



    .state('tab.network', {
      url: '/network',
      cache: false,
      views: {
        'network': {
          templateUrl: 'templates/network/network.html',
          controller: 'NetworkCtrl'
        }
      }
    })

    .state('tab.shopping', {
        url: '/shopping',
        cache: false,
        views: {
            'shopping': {
                templateUrl: 'templates/shopping/list.html',
                controller: 'ShoppingCtrl'
            }
        }
    })

    .state('tab.shoppingDetail', {
        url: '/shoppingDetail/:list_id',
        cache: false,
        views: {
             'shopping': {
                 templateUrl: 'templates/shopping/detail.html',
                 controller: 'ShoppingDetailCtrl'
             }
        }
    })

    .state('tab.messaging', {
      url: '/messaging',
        cache: false,
      views: {
        'messaging': {
          templateUrl: 'templates/messaging/messaging.html',
          controller: 'MessagingCtrl'
        }
      }
    })

    .state('tab.chat', {
      url: '/chat/:uid?acc',
      cache: false,
      views: {
        'messaging': {
          templateUrl: 'templates/messaging/chat.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.notifications', {
      url: '/notifications',
      views: {
        'notifications': {
          templateUrl: 'templates/notifications/notifications.html',
          controller: 'AppCtrl'
        }
      }
    })

    .state('tab.profile', {
      url: '/profile/:uid',
      cache: false,
      views: {
        'network': {
          templateUrl: 'templates/me/me.html',
          controller: 'ProfileCtrl'
        }
      }
    })

    .state('tab.settings', {
      url: '/settings',
      views: {
        'network': {
          templateUrl: 'templates/me/settings.html',
          controller: 'SettingCtrl'
        }
      }
    })



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');

});
