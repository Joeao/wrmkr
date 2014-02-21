var timeRange = 10;
var dangerRange = 10;
var terrainRange  = 10;
var arcSimularityRange = 10;
graphMinimumComparisionScore = 10;

function compareGraphs(currentGraph, otherGraph){
	currentArcs = currentGraph.arcs;
	otherArcs = otherGraph.arcs;
	//compare each arc of currentGraph with each arc of otherGraph
	//if enough are similar then consider the graph's similar
	graphComparisionScore = 0;
	for ( var i = 0; i < currentArcs.length; i++){
		for (var j = 0; j < otherArcs.length; j++ ){
			graphComparisionScore = graphComparisionScore + compareArcs(currentArcs[i],otherArcs[j]);			
		}
	}
	if (graphComparisionScore > graphMinimumComparisionScore){
		return true;
	}
	return false;
}

function compareArcs(arc,otherArc){
	var arcComparisionScore = 0;
	if(arc.traversalTime - timeRange <= otherArc.traversalTime. + timeRange){
		arcComparisionScore++;
	} 
	else if(arc.traversalTime - timeRange >= otherArc.traversalTime. + timeRange){
		arcComparisionScore++;
	} 
	if (arc.dangerRating - dangerRange <= otherArc.dangerRange + dangeRange){
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