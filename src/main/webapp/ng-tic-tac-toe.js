(function() {
	"use strict";

	angular.module('ticTacToeApp', [])
      .controller('UserController', function($scope, $http) {

		var connection;

      	var getUsers = function() {
      		$http.get("/tic-tac-toe/users")
				.then(function(resp) {
					$scope.users = resp.data;
				});
        }

      	getUsers();

      	$scope.login = function() {
      		if( $scope.username !== undefined && $scope.username !== "" ) {
      			$http.post("/tic-tac-toe/register", {},
      					{headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      					 params: {"username" : $scope.username}})
					.then(function(resp) {
						startConnection();

					});
      		}
      	}

      	$scope.askToPlay = function(playWith) {
      		if( connection && playWith.username != $scope.username) {
      			var req = {
      				action: "askToPlay",
      				username: $scope.username,
      				other: playWith.username
      			};
      			connection.send(JSON.stringify(req));
      		}
      	}

		function startConnection() {
			connection = new WebSocket('ws://localhost:8080/tic-tac-toe/play');
			connection.onopen = function() {
				connection.send("{'action': 'start', 'username': '" + $scope.username + "'}");
			}
			connection.onmessage = function(e) {
				var json = JSON.parse(e.data);
				var users = json.users;
				$scope.users = users;

				if( json.action == "askToPlay" && json.username != $scope.username) {
					if (Notification.permission !== "granted") {
                        Notification.requestPermission();
                    } else {
                        var notification = new Notification('Play a game!', {
                          icon: 'http://cdn-img.easyicon.net/png/11259/1125930.gif',
                          body: "Hey there! " + json.username + " wants to play tic tac toe with you!",
                        });

                        notification.onclick = function () {
                          window.open("http://localhost:8080/tic-tac-toe/");
                        };
                      }
				}
			}
		}

      });

})();