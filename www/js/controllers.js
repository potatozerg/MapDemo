//一个典型的angularjs的controller
var app = angular.module('starter.controllers', []);

app.controller('mainCtrl',function($scope){

	$scope.markers = [];
	$scope.created = false;
	$scope.initMap = () => {
		$scope.directionsService = new google.maps.DirectionsService;
		$scope.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: $scope.map
    });
		$scope.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 6,
			center: {lat: 41.85, lng: -87.65}
		});

		$scope.map.addListener('click', function(event) {
				$scope.addMarker(event.latLng);
		});
		$scope.directionsDisplay.setMap($scope.map);
		// document.getElementById('submit').addEventListener('click', function() {
		// 	calculateAndDisplayRoute(directionsService, directionsDisplay);
		// });
	}
	$scope.startOver = () => {
		$scope.markers = [];
		$scope.waypts = [];
		$scope.created = false;
		let summaryPanel = document.getElementById('directions-panel');
		summaryPanel.innerHTML = '';
		$scope.initMap();
	}
	$scope.addMarker = location => {
		let marker = new google.maps.Marker({
			position: location,
			map: $scope.map,
			draggable: true
		});
		if (!$scope.created) {
			$scope.markers.push(marker);
		} else {
			$scope.markers.splice($scope.markers.length-2, 0, marker);
		}
	}

	$scope.setMapOnAll = map => {
		for (let i = 0; i < $scope.markers.length; i++) {
			$scope.markers[i].setMap(map);
		}
	}

	// Removes the markers from the map, but keeps them in the array.
	$scope.clearMarkers = () => {
		$scope.setMapOnAll(null);
	}

	// Shows any markers currently in the array.
	$scope.showMarkers = () => {
		$scope.setMapOnAll($scope.map);
	}

	// Deletes all markers in the array by removing references to them.
	$scope.deleteMarkers = () => {
		$scope.clearMarkers();
		$scope.markers = [];
	}

	$scope.removeWayPoint = index => {
		$scope.waypts[index].stopover = false;
		console.log(index);
		for (let i = 0; i < $scope.waypts.length; i++) {
			delete $scope.waypts[i].$$hashKey;
		}

		let summaryPanel = document.getElementById('directions-panel');
		summaryPanel.innerHTML = '';
		$scope.initMap();
		$scope.createRoute();
		console.log($scope.waypts);
	}

	$scope.createWaypts = () => {

		$scope.waypts = [];
		if($scope.markers.length <= 1 && !$scope.created){
			alert("You need at least two markers!");
			return;
		}
		$scope.created = true;
		for (let i = 0; i < $scope.markers.length; i++) {
			$scope.waypts.push({
				location: $scope.markers[i].position,
				stopover: true
			});
		}
		$scope.ori = $scope.waypts.shift();
		$scope.des = $scope.waypts.pop();
	}

	$scope.createRoute = () => {

		$scope.directionsService.route({
			origin: $scope.ori.location,
			destination: $scope.des.location,
			waypoints: $scope.waypts,
			optimizeWaypoints: true,
			travelMode: 'DRIVING'
		}, function(response, status) {
			if (status === 'OK') {
				$scope.directionsDisplay.setDirections(response);
				let route = response.routes[0];
				let summaryPanel = document.getElementById('directions-panel');
				summaryPanel.innerHTML = '';
				// For each route, display summary information.
				for (let i = 0; i < route.legs.length; i++) {
					let routeSegment = i + 1;
					summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
							'</b><br>';
					summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
					summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
					summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
				}
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}
	$scope.createTour = () => {

		$scope.createWaypts();
		$scope.createRoute();
	}
});
