Simulate = function(options) {
	if (options)
		this.options = this.extend(this.options, options);
};

Simulate.prototype.options = {
	points: [
		{
			lat: -34.08,
			lng: 141.24,
			isStart: true
		},
		{
			lat: -26.90,
			lng: 147.65
		},
		{
			lat: -23.48,
			lng: 142.12
		},
		{
			lat: -23.48,
			lng: 137.29
		}
	],
	paths: [
		{
			start: 0,
			end: 1,
			hazards: {
				mountain: 10
			}
		},
		{
			start: 0,
			end: 2,
			hazards: {
				fog: 20
			}
		},
		{
			start: 0,
			end: 3,
			hazards: {
				oxygen: 30
			}
		},
		{
			start: 2,
			end: 3,
			hazards: {
				cars: 40
			}
		}
	]
};

Simulate.prototype.sim = function() {
	var self = this;
	// Create nodes
	this.options.points.forEach(function(point, index) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(point.lat, point.lng),
			map: window.map,
			draggable: false,
			id: index,
			node: {},
			icon: 'img/marker_intermediate.png',
			title: 'Node: ' + index
		});

		var node = journey.createNode(index, marker);
		node.gMarker.node = node;

		if (point.isStart) {
			window.start = node;
			journey.setStartNode(node);
		}
	});

	// Create paths
	this.options.paths.forEach(function(path, index) {
		var startNode = journey.allNodes[path.start]
		,	endNode = journey.allNodes[path.end]
		;

		var line = new google.maps.Polyline({
			id: index,
			pathOrder: [startNode, endNode],
			path: [startNode.gMarker.position, endNode.gMarker.position],
			strokeColor: '#333333',
			strokeOpacity: 0.8,
			strokeWeight: 4,
			map: window.map,
			icons: [{
				icon: {
					path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
				},
				offset: '100%'
			}],
			hazards: {}
		});

		journey.connectNodes(startNode, endNode);

		if (path.hazards)
			startNode.setPathHazards(endNode, path.hazards);
	});
};

Simulate.prototype.extend = function(orig, extra) {
	return Object.keys(extra).forEach(function(key) {
		orig[key] = extra[key];
	});
};
