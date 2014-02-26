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
similiarGraphArray.forEach(function(graph){
	retrieveRoutesThroughGraph(graph).forEach(function(path){
		console.log("success");
	})
})