


	
	          if (window.start == null){
				//Set node start
                window.start = this.node;
				
				//Set node as selected for UI
				setSelected(this, "Node");
				
            } else {
                start = window.start;
                end = this.node;
          
                connected = window.j.connect_nodes(start,end,{
                    danger: 1
                });  
                
                if (connected){
                    //get the position of the 2 nodes:
                    var startNodeX = start.gMarker.getPosition().lng();
                    var startNodeY = start.gMarker.getPosition().lat();
                    var endNodeX = end.gMarker.getPosition().lng();
                    var endNodeY = end.gMarker.getPosition().lat();

                    //Calcul of the distange between 2 bounded nodes with the Pythagore theorem
                    distance[lineCounter] = Math.sqrt((endNodeX - startNodeX)*(endNodeX - startNodeX) + (endNodeY - startNodeY)*(endNodeY - startNodeY));

                    //TODO: Path should show arrow head
                    gLine = new google.maps.Polyline({
                        id: lineCounter,
                        pathOrder: [start,end],  
                        path: [start.gMarker.position, end.gMarker.position ],
                        strokeColor: '#333333',
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                        map: map,
                        lineLenght: distance[lineCounter],
                    });					
					
                    //output to console
					var contentString = "Created new line - Between Nodes " + start.id + " & " + end.id + " Length:" + gLine.lineLenght;
                    console.log(contentString);

                    //Make sure each marker knows what lines its connected to
                    start.gMarker.gLines[lineCounter] = gLine;
                    end.gMarker.gLines[lineCounter] = gLine;


                    google.maps.event.addListener(gLine,"click",function(event){

                        start = this.pathOrder[0];  
                        end = this.pathOrder[1];
						setSelected(this, "Line");
						
						/*                                                
                        //Disconnect the nodes
                        window.j.disconnect_nodes(start,end); 
                        
                        start.gMarker.gLines[this.id] = null
                        end.gMarker.gLines[this.id] = null;
                        
                        //Set the start as null
                        window.start = null;
						                        
                        //Remove the line from the map
                        this.setMap(null);*/
                    });

					//Update line counter
                    lineCounter++;
					
					//Select newly created line
					setSelected(gLine, "Line");
                } else {
					//Clicking the same node will unselect that node
					setSelected(this, "Node");
                }
             
                 window.start = null;             
            }  