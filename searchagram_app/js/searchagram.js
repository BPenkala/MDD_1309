var searchagram = angular.module(
		'searchagram', []
	).config(
		['$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {
			$routeProvider.when('/tag/:tag');
		}]
  	).controller(
		'imageView', function ( $scope, $http, $timeout, $route, $location ) {
			// Set the API endpoint
			var api = 'https://api.instagram.com/v1/tags/%tag%/media/recent?access_token=46913576.5a81226.8e0ba9c992134d9bbab575fb4479bcad&callback=JSON_CALLBACK',
				newReq, refreshApi;

			$scope.fetchImages = function() {
				
				$scope.loadingClass = 'loading';
				$scope.imgCurrent = 0;

				if ( ! $route.current )
					$location.path( '/tag/' + $scope.tag );
				else if ( angular.isDefined( $route.current.params.tag ) )
					$scope.tag = $route.current.params.tag;

				$http.jsonp( 
					api.replace( '%tag%', $scope.tag )
				).success( function( data ) {
					delete $scope.loadingClass;

					$scope.images = data.data;

					// Cancel the previous update request
					if ( refreshApi )
						$timeout.cancel( refreshApi );
						
				}).error( function() {
					delete $scope.loadingClass;
					refreshApi = $timeout( $scope.fetchImages, 2000 );
				});
			}

			$scope.tagChange = function() {
				$location.path( '/tag/' + $scope.tag );

				if ( newReq )
					$timeout.cancel( newReq );

				newReq = $timeout( function() {
					$scope.fetchImages();
					$timeout.cancel( newReq );
				}, 1000);
			}
		}
	).filter(
		'escape', function () {
			return function( input ) {
				return escape( input );
			}
		}	
	);

