$(function() {
    PathNode = function(id, gMarker) {
        this.id = id;
        this.successors = {};
        this.hazards = {};
        this.gMarker = gMarker;
        return this;
    };

    PathNode.prototype.connect = function(node, hazards) {
        this.successors[node.id] = {
            node: node,
            hazards: hazards
        };
    };

    PathNode.prototype.setHazards = function(hazards) {
        this.hazards = hazards;
    };

    PathNode.prototype.setPathHazards = function(endNode, hazards) {
        this.successors[endNode.id].hazards = hazards;
    };

    PathNode.prototype.getPathHazards = function(endNode){
        return this.successors[endNode.id].hazards || {};
    };

    PathNode.prototype.travel = function(currentJourney, hazards) {
        currentJourney = currentJourney || [];
        currentHazards = hazards || this.hazards || {};
        currentJourney.push(this);

        _.each(this.successors, function(successor) {
            var thisHazards = _.clone(currentHazards);

            thisHazards = this.calculateHazards(
                thisHazards
            ,   successor.hazards
            ,   successor.node.hazards
            );

            successor.node.travel(currentJourney.slice(), thisHazards);
        }, this);

        if (Object.keys(this.successors).length === 0) {
            journey.completePath(currentJourney, currentHazards);
            currentHazards = {}; // Reset hazards after calculating a path
        }
    };

    PathNode.prototype.calculateHazards = function(currentHazards, pathHazards, nodeHazards) {
        var calculatedPathHazards = {}
        ,   calculatedNodeHazards = {};

        _.each(pathHazards, function(value, name) {
            if (currentHazards.hasOwnProperty(name)) {
                var xpp = Mediate(name, currentHazards, pathHazards, currentHazards[name], value);
                // console.log('xpp', name, value, xpp);

                if (_.isObject(xpp)) {
                    calculatedPathHazards = _.defaults(calculatedPathHazards, xpp);
                }
                else {
                    calculatedPathHazards[name] = xpp;
                }
            }
            else {
                calculatedPathHazards[name] = value;
            }
        }, this);

        // console.log('calculatedPathHazards', calculatedPathHazards, currentHazards);

        // NODE HAZARDS ARE NOT CALCULATED!!!

        // _.each(nodeHazards, function(value, name) {
        //  if (calculatedPathHazards.hasOwnProperty(name)) {
        //      var xpp2 = Mediate(name, calculatedPathHazards[name], value, calculatedPathHazards, pathHazards);
        //      console.log('xpp2', xpp2);
        //      calculatedPathHazards[name] = xpp2;
        //  }
        //  else {
        //      calculatedPathHazards[name] = value;
        //  }
        // }, this);

        return _.defaults(calculatedPathHazards, currentHazards);
    };

    Journey = function(paths) {
        this.allNodes = [];
        this.startNode = null;
        this.completedPaths = [];
    };

    Journey.prototype.createNode = function(id, gMarker) {
        var n = new PathNode(id, gMarker);
        this.allNodes.push(n);
        return n;
    };

    Journey.prototype.getAllNodes = function() {
        return this.allNodes;
    };

    Journey.prototype.findNodeByGMarker = function(gMarker) {
        xx =  _.first(_.where(this.allNodes, {
            gMarker: gMarker
        }));
        // console.log('xx', xx);
        return xx;
    };

    Journey.prototype.nodesConnected = function(nodeA, nodeB) {
        // console.log('connected?', nodeA, nodeB);
        return nodeA.id == nodeB.id || nodeA.successors[nodeB.id] || nodeB.successors[nodeA.id];
    };

    Journey.prototype.connectNodes = function(nodeFrom, nodeTo, hazards) {
        // console.log('connecting', nodeFrom, nodeTo);
        if (this.nodesConnected(nodeFrom, nodeTo)) {
            return false;
        }

        nodeFrom.connect(nodeTo, hazards || {});
        return true;
    };

    Journey.prototype.disconnectNodes = function(nodeA, nodeB) {
        var newSuccessors = [];
        _.each(nodeA.successors, function(path) {
            if (path.node.id != nodeB.id) {
                newSuccessors[path.node.id] = path;
            }
        });
        nodeA.successors = newSuccessors;
    };

    Journey.prototype.setStartNode = function(node) {
        this.startNode = node;
    };

    Journey.prototype.completePath = function(journey, hazards) {
        var details = { journey: journey, hazards: hazards };

        this.completedPaths.push(details);

        //console.log('one path complete!',details);
        window.recommender = recommender = new Recommender(this);

    };

    Journey.prototype.start = function(node) {
        if (node) {
            this.setStartNode(node);
        }

        this.startNode.travel();

        ui = new UI();  
        ui.renderer(window.journey);
    };

    window.j = journey = new Journey();

    //TODO: Probably best to move these to some sort of ui scripts
    $('#setStart').click(function() {
        window.setStart = true;
        journey.setStartNode(window.selected_node);
        $('#go').prop('disabled', false);
    });

    $('#go').click(function(){
        window.journey.start();
    });

    // -------------------------
    // UI
    // -------------------------
    UI = function() {
        this.template = _.template($.trim($('#template').html()));
    };

    UI.prototype.display = function(data) {
        $('#data').append( this.template({data: data }) );
    };
    UI.prototype.renderer = function(allJourneys) {
        console.log(allJourneys.completedPaths);
        for (index in allJourneys.completedPaths){
            this.parse_path(allJourneys.completedPaths[index],index);
        }
    };
    UI.prototype.parse_path = function(path,index) {
        // console.log('path', path);        
        this.display('Found Journey:<br>');
        this.display('<b>'+_.pluck(path.journey, 'id')+'</b> ' + JSON.stringify(path.hazards) + "<a href='#"+index+"'> <span class='glyphicon glyphicon-thumbs-up' > </a>"+ "<a href='#"+index+"'> <span class='glyphicon glyphicon-thumbs-down' > </a>");
    };
});