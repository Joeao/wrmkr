$(function() {

    PathNode = function(id, gMarker) {
        this.id = id;
        this.successors = [];
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

        if (this.successors.length == 0) {
            journey.completePath(currentJourney, currentHazards);
        }
    };

    PathNode.prototype.calculateHazards = function(currentHazards, pathHazards, nodeHazards) {
        var calculatedPathHazards = {}
        ,   calculatedNodeHazards = {};

        _.each(pathHazards, function(value, name) {
            if (currentHazards.hasOwnProperty(name)) {
                var xpp = Mediate(name, currentHazards, pathHazards, currentHazards[name], value);
                console.log('xpp', name, value, xpp);
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

        console.log('calculatedPathHazards', calculatedPathHazards, currentHazards);

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
        console.log('xx', xx);
        return xx;
    };

    Journey.prototype.nodesConnected = function(nodeA, nodeB) {
        console.log('connected?', nodeA, nodeB);
        return nodeA.id == nodeB.id || nodeA.successors[nodeB.id] || nodeB.successors[nodeA.id];
    };

    Journey.prototype.connectNodes = function(nodeFrom, nodeTo, hazards) {
        console.log('connecting', nodeFrom, nodeTo);
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

        console.log('one path complete!', journey, hazards);

        ui = new UI;
        ui.render(details, this.completedPaths);
    };

    Journey.prototype.start = function(node) {
        if (node) {
            this.setStartNode(node);
        }

        this.startNode.travel();
    };

    window.j = journey = new Journey;




    //TODO: Probably best to move these to some sort of ui scripts
    $('#setStart').click(function(){
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
    }

    UI.prototype.display = function(data) {
        $('#data').append( this.template({data: data }) );
    }

    UI.prototype.render = function(completedPath, allCompletedPaths) {
        this.display('New Path FOUND!<br>');

        this.display('Found Journeys:<br>');
        this.display(this.parse_path(completedPath));


        this.display('Least number of nodes:<br>');
        var least = null;
        _.each(allCompletedPaths, function(path) {
            console.log('path here', path);
            if (least == null || path.journey.length < least.journey.length) {
                least = path;
            }
        }, this)
        this.display(this.parse_path(least));


        var all_hazards = [];
        _.each(allCompletedPaths, function(path) {
            _.each(path.hazards, function(value, name) {
                if ( ! _.contains(all_hazards, name)) {
                    all_hazards.push(name);
                }
            })
        })


        _.each(all_hazards, function(hazard_name) {
            this.display('Lowest '+ hazard_name +' value:<br>');
            var lowest = null;
            _.each(allCompletedPaths, function(path) {
                if (lowest == null || path.hazards[hazard_name] < lowest.hazards[hazard_name]) {
                    lowest = path;
                }
            }, this)
            console.log(hazard_name, lowest);
            this.display(this.parse_path(lowest));
        }, this);
    }

    UI.prototype.parse_path = function(path) {
        console.log('path', path);
        return '<b>'+_.pluck(path.journey, 'id')+'</b> ' + JSON.stringify(path.hazards);
    }

});