'use strict';

/* Controllers */
angular.module('myApp.controllers', []).
  controller('HomeCtrl', function ($scope, $http, $httpParamSerializerJQLike, socket) {
    $scope.members = [];
    $http.get('/api/machines').success(function(data) {
        $scope.members = data;
        checkMemberStatus();
    });

    $scope.notifications = {};
    socket.on('send:notifications', function (data) {
      $scope.notifications = data;
    });

    var checkMemberStatus = function() {
      setTimeout(function(){
        _.forEach($scope.members, function(member) {
          $http.get('/api/health/'+member.name)
            .success(function(data) {
              if (data.health) {
                member.up = true;
              } else {
                member.up = false;
              }
            });
          $http.get('/api/is-leader/'+member.name).success(function(data) {
            if (data.leader) {
              member.leader = true;
            } else {
              member.leader = false;
            }
          });
        });
        checkMemberStatus();
      }, 1000);
    }

    $scope.createToggesDir = function() {
      $http.put('/api/create-toggles-directory', null).success(function() {
        $scope.activeToggles = true;
      });
    }

    $scope.activeToggles = false;
    $scope.setToggle = function(url, key, value) {
      $http({
        url: url + '/v2/keys/toggles/' + key,
        method: 'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: $httpParamSerializerJQLike({'value': value})
      }).success(function(response) {
        console.log('Setted ' + key + ' with ' + value);
      });
    };

  });
