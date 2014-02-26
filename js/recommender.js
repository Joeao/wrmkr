var timeRange = 10;
var dangerRange = 10;
var terrainRange  = 10;
var arcSimularityRange = 10;
var graphMinimumComparisionScore = 10;

function compareGraphs(currentGraph, otherGraph){
	currentArcs = currentGraph.arcs;
	otherArcs = otherGraph.arcs;
	//compare each arc of currentGraph with each arc of otherGraph
	//if enough are similar then consider the graph's similar
	graphComparisionScore = 0;
	currentArcs.forEach(function(arc){
		otherArcs.forEach(functon(otherArc){
			graphComparisionScore = graphComparisionScore + compareArcs(arc,otherArc);
		})
	})
	if (graphComparisionScore > graphMinimumComparisionScore){
		return true;
	}
	return false;
}

function compareArcs(arc,otherArc){
	var arcComparisionScore = 0;
	//Comparing the attributes of the arcs, if they're 
	if(arc.traversalTime - timeRange <= otherArc.traversalTime + timeRange){
		arcComparisionScore++;
	} 
	else if(arc.traversalTime - timeRange >= otherArc.traversalTime + timeRange){
		arcComparisionScore++;
	} 
	if (arc.dangerRating - dangerRange <= otherArc.dangerRange + dangerRange){
		arcComparisionScore++;
	}	
	else if(arc.dangerRating - timeRange >= otherArc.dangerRating. + timeRange){
		arcComparisionScore++;
	} 
	if (arc.terrainRating - terrainRange <= otherArc.terrainRating + terrainRange){
		arcComparisionScore++;
	} 	
	else if(arc.terrainRating - timeRange >= otherArc.terrainRating. + timeRange){
		arcComparisionScore++;
	} 
	return arcComparisionScore;
}


//build array of similar graphs to our current graph
var similiarGraphArray = [];
otherGraphs.forEach(function(graph){
	if (compareGraphs(currentGraph,graph) === true){
		similiarGraphArray.push(graph);
	}
};

//go through array of similar graphs and retrieve all the RouteAlgorithm that were computed and get their results
for (var i = 0; i < similiarGraphArray.length; i++) {
	similiarGraphArray[i]
};