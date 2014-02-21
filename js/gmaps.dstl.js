
window.start = null; 			//Start point for Linking two nodes together
window.setStart = false;
window.selected = null;	//Select node as shown by gui
window.$viewer = {};
window.allLines = [];
window.end  = null;
window.startDrawMarker; //Start draw marker from here



$(document).ready(function(){
    var counter = 0;
	var infowindow = new google.maps.InfoWindow();
	infowindow.close();

	window.$viewer = $("#object-viewer");

    var lineCounter = 0;

    var distance = {
        id: lineCounter
    }

    //add the results in the HTML, under the map
    var distanceMessage = document.getElementById("distance");

    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(-33, 151),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true
    }
    var map = new google.maps.Map(document.getElementById('map_canvas'),
        mapOptions);
		
		var lineSymbol = {
			path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
		};


    /**
     * On Double click, make the marker
     */
	 lineCounter = 0;
    google.maps.event.addListener(map, 'dblclick', function(event) {

        var marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            draggable: false,
            id: counter,
            node: {}, //Reference to it's parent object (so we can access it)
            gLines: [], //Array of lines it is connected to
            title: "Node: " + counter.toString()
        });
			

        /**
         * Once the marker has been clicked, either set the start for the journey
         * or set the start or finish point for the line
         */
        google.maps.event.addListener(marker,"click", function(event){
			
			setNodeSelected(this.node);

			if(window.startDrawMarker != null){
				setConnect(window.startDrawMarker, this.node);
			}
        });



        /**
		 * Right click function, which selects node and set it as beginning of new connection
         */
        google.maps.event.addListener(marker,"rightclick", function(){
			setNodeSelected(this.node);
			$("#connect").click();
        });


        // Create new PathNode for this marker
        // node = new PathNode(counter.toString(),marker);
        node = journey.createNode(counter.toString(), marker);

        // Set the gMarker node to the node, so we can access it at the ui level
        node.gMarker.node = node;
		
		// set end node
		/*if(marker.id == 0){
			window.end = node;
			marker.setIcon("img/marker_end.png");
		}(*/
		
		// Reset if the connect button has been clicked, now new node created
		$("#connect").removeClass("disabled").text("Connect to...");
		window.startDrawMarker = null;

		//Select new node
		setNodeSelected(node);

        //Increase counter, we want unique IDs for each one
        counter++;

    });


	function setConnect(nodeA,nodeB){
		console.log('connect', nodeA, nodeB);

		//If we need to connect it up
		if (nodeA != null && nodeB != null && nodeA != nodeB){

			// var nodeA, nodeB;
			// nodeA = window.journey.findNodeByGMarker(marker1);
			// nodeB = window.journey.findNodeByGMarker(marker2);

			// console.log('nodeA',nodeA);
			// console.log('nodeB',nodeB);

			if ( ! nodeA || ! nodeB) return false;

			$("#connect").removeClass("disabled").text("Connect to...");

			//TODO: Path should show arrow head
			gLine = new google.maps.Polyline({
				id: lineCounter++,
				pathOrder: [nodeA,nodeB],
				path: [nodeA.gMarker.position, nodeB.gMarker.position],
				strokeColor: '#333333',
				strokeOpacity: 0.8,
				strokeWeight: 4,
				map: map,
				icons: [{icon: lineSymbol, offset: '100%'}],
				hazards: {}
			});

			// use the journey object to connect. it does the validation
			// marker1.node.connect(marker2.node, []);
			window.journey.connectNodes(nodeA, nodeB);

			window.startDrawMarker = null;

			google.maps.event.addListener(gLine,"click",function(event){
				// var sNode = window.j.findNodeByGMarker(this);
				// console.log('sNode', sNode, this);
				setLineSelected(this);
			});

			setLineSelected(gLine);

		}
	}


	/**
	 * Once the marker has been clicked, either set the start for the journey
	 * or set the start or finish point for the line
	 */
	 $("#connect").click(function(){
	 
		if (window.startDrawMarker == null) {
			$(this).addClass("disabled").text("Select Node");
			window.startDrawMarker = window.selected;
		} else {
			$("#connect").removeClass("disabled").text("Connect to...");
			window.startDrawMarker = null;
		}
	});


	//Node Obj
	function setNodeSelected(node){
	
		//If its an marker, set the icon back
		if (window.selected != null && "gMarker" in window.selected) {
			if(window.selected == window.start){
				window.selected.gMarker.setIcon("img/marker_start.png");
			}
			else if(window.selected == window.end){
				window.selected.gMarker.setIcon("img/marker_end.png");
			}
			else{
				window.selected.gMarker.setIcon("img/marker_intermediate.png");
			}
		}
		//If its a line, change the colour
		if (window.selected != null && "pathOrder" in window.selected){
			window.selected.setOptions({strokeColor: '#333333'});
		}
		window.selectedType = 'node';
		window.selected = node;
		
		$("#set_start").removeClass("inactive")
		
		// If end node disable set start button
		if(window.end == window.selected){
			$("#set_start").addClass("inactive");
		}

		window.$viewer.show();

		// Set selected title heading
		$("h4",window.$viewer).text("Node:" + node.id);
		if(window.selected == window.start){
			$("h4",window.$viewer).text("Node:" + node.id + " (Start)");
		}
		else if(window.selected == window.end)
		{
			$("h4",window.$viewer).text("Node:" + node.id + " (End)");
		}

		longLat  = node.gMarker.getPosition().lng() + ", "+ node.gMarker.getPosition().lat();
		
	
			node.gMarker.setIcon("img/marker_selected.png");
		
		// No hazards added to nodes
		//$(".modal-body").show();
		//buildHazardsUI(node.hazards);
		$("#connect",window.$viewer).show();
		$(".modal-body").hide();
		$("#delete",window.$viewer).hide();
		$("#set_start",window.$viewer).show();
		
		$("h5",window.$viewer).text(longLat);
	}

	//setting line as selecetd, update object viewer
	//gLine obj
	function setLineSelected(line){
		console.log('lineeeeee', line);

		//If its an marker, set the icon back
		if (window.selected != null && "gMarker" in window.selected) {
			if(window.selected == window.start){
				window.selected.gMarker.setIcon("img/marker_start.png");
			}
			else if(window.selected == window.end){
				window.selected.gMarker.setIcon("img/marker_end.png");
			}
			else{
				window.selected.gMarker.setIcon("img/marker_intermediate.png");
			}
		}
		//If its a line, change the colour
		if (window.selected != null && "pathOrder" in window.selected){
			window.selected.setOptions({strokeColor: '#333333'});
		}

		line.setOptions({strokeColor: '#36448F'});

		window.selectedType = 'path';
		window.selected = line;
		window.$viewer.show();
		
		//Set the attributes in the UI
		startNode = line.pathOrder[0];
		endNode = line.pathOrder[1];
		hazards = startNode.getPathHazards(endNode);
		
		buildHazardsUI(hazards);

		$("h4",window.$viewer).text("Line: " + line.id);
		
		$("h5",window.$viewer).text("Connecting nodes " + startNode.id + " and " + endNode.id);

		$("#connect",window.$viewer).hide();
		$("#set_start",window.$viewer).hide();
		$("#delete",window.$viewer).show();
		$(".modal-body").show();

	}
	
	$("#set_start").click(function(){
		console.log("Set start node id: " + window.selected.id);
		
		//Reset previous node
		if (window.start != null) {
			window.start.gMarker.setIcon("img/marker_intermediate.png");
		}
		
		//Set new node
		window.start = window.selected;
		window.selected.gMarker.setIcon("img/marker_start.png");
		$("h4",window.$viewer).text("Node:" + node.id + " (Start)");
		
		// utils setup
		window.setStart = true;
		journey.setStartNode(window.selected);
	});

	// Adding new hazard
	$("#hazard_add").click(function(){

		name = $("#hazard_name").val();
		
		if(name != "")
		{
			inputCopy = $("#form").clone().attr("id","").removeClass("hide").addClass("hazard");


			$("span.add-on",inputCopy).text(name).attr("id",name);

			$("#attributes").append(inputCopy);
			$("#hazard_name").val("");

			//TODO: Could be .on("click") ~ Live
			$("#attributes .btn-danger").click(function(){
				$(this).parent().remove();
				updateHazards();
			});


			//PathNode.prototype.setPathHazards
			updateHazards();
		}
	});
		
	//Delete line button clicked
	$("#delete").click(function(){
		if (window.selected != null && "pathOrder" in window.selected){
			connectedNodeA = window.selected.pathOrder[0];  
            connectedNodeB = window.selected.pathOrder[1];
			
			console.log("Deleted connection between nodes " + connectedNodeA.id + " and " + connectedNodeB.id);
                                                
            //Disconnect the nodes
            window.journey.disconnectNodes(connectedNodeA, connectedNodeB); 
                                                
            //Remove the line from the map
            window.selected.setMap(null);
			window.selected = null;
			$(".modal-body").hide();
			$("#delete",window.$viewer).hide();
			$("h5",window.$viewer).text("Successfully deleted");
		}
	});
	
	//Clear output button clicked, clear output div
	$("#clear").click(function(){
		$('#data').empty();
	});


	//Simulate clicked, begin travel
	$("#start").click(function(){
		if(window.start != null){
			window.journey.start();
		}
		else{
			window.alert("Error: Must set a start node to simulate");
		}
	});

		// live on change handler as the input boxes aren't
		// always on the page
		$(document).on('change', '.hazard input', function() {
			updateHazards();
		})

		function updateHazards(){
			newhazards = {};
			$(".hazard").each(function(){

				name = $("span",this).text();
				value = $("input",this).val();

				newhazards[name] = value;
			});

			console.log('update hazards', window.selectedType, window.selected, newhazards);

			if (window.selectedType == 'path') {
				var startNode = window.selected.pathOrder[0];
				var endNode = window.selected.pathOrder[1];
				console.log('update LINE hazards', window.selected, startNode, endNode);
				startNode.setPathHazards(endNode, newhazards);
			}
			else {
				// handle updating node hazards...
				console.log('this is a NODENODENODENODENODE!!!', window.selected);
				window.selected.setHazards(newhazards);
			}

		}




		function buildHazardsUI(hazards) {

			console.log('Loaded attributes ', hazards);
			$("#attributes").html("");
			$.each(hazards, function(key, value) {
				name = $("#hazard_name").val();

				inputCopy = $("#form").clone().attr("id","").removeClass("hide").addClass("hazard");

				$("span.add-on",inputCopy).text(key).attr("id",key);
				$("input",inputCopy).val(value);

				$("#attributes").append(inputCopy);

			});
		}

});





