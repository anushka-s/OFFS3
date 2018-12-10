faculty.controller("vcCtrl", function($scope, $rootScope, $location, vcService) {
	$scope.vc  = [];

	$scope.logout = function(req,res) {
		vcService.logout(function(response) {
			
		}
		$location.path("/");
	}		

	$scope.getDetails = function() {
		vcService.getDetails(function(response) {
			$scope.vc = response;
		})
	}

	$scope.checkStatus = function() {
		$location.path("/vcAnalysis");
	}

	$scope.getDetails();
})
