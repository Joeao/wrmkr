Mediate = function(name, valueSoFar, currentValue, allHazards, pathHazards) {
    var mediators = {

    	/**
    	 * MEDIATORS
    	 *
    	 * Name your mediator function after the hazard to manipulate
    	 * The function receives three arguments:
    	 *    	 
    	 * allHazards    {object}  All current hazards, to use if things affect others
         * pathHazards   {object}  All the hazards for this path
         * valueSoFar    {int}     The total value for this hazard UP UNTIL NOW
         * currentValue  {int}     The new-found hazard value
         *
         * You must return the new value for the hazard
         *
         * You MUST return EITHER:
         *  - the new value for this current hazard
         *  - an object of all changed values
    	 * 
    	 */


    	// "Danger" mediator
        danger: function(allHazards, pathHazards, valueSoFar, currentValue) {
            return (valueSoFar + currentValue) * 2;
        },

        mountain: function(allHazards, pathHazards, valueSoFar, currentValue) {

            if (allHazards.oxygen) { // if oxygen

                var ratio = 1;

                if (currentValue > 500) // if the height on this path is more than 500 miles
                    ratio = 0.8;
                if (currentValue > 1000) // >1000 miles
                    ratio = 0.6;
                if (currentValue > 1500) // >1500 miles
                    ratio = 0.4;
                if (currentValue > 2000) // >2000 miles
                    ratio = 0.3;
                if (currentValue > 2500) // >2500 miles
                    ratio = 0.2;
                if (currentValue > 3000) // >3000 miles
                    ratio = 0.1;
                if (currentValue > 3500) // >3000 miles
                    ratio = 0;
               
                return {
                    mountain: valueSoFar + currentValue,
                    oxygen: Math.floor(allHazards.oxygen * ratio)
                }
            }

            return {
                mountain: valueSoFar + currentValue
            }

        },

        fog: function(allHazards, pathHazards, valueSoFar, currentValue) {

            if (allHazards.cars) {  // if the soldiers are out of their cars (they will try to look after them in the fog)
                
                var ratio = 1;

                if (currentValue > 20) // if fog on this path is denser than 20%
                    ratio = 0.8;
                if (currentValue > 40) // >40%
                    ratio = 0.6;
                if (currentValue > 60) // >60%
                    ratio = 0.4;
                if (currentValue > 80) // >80%
                    ratio = 0.2;
                if (currentValue == 100) // =100%
                    ratio = 0;
               
                return {
                    fog: valueSoFar + currentValue,
                    cars: Math.floor(allHazards.cars * ratio) //remaining cars
                }
            }

            return {
                fog: valueSoFar + currentValue
            }            

        },

        rain: function(allHazards, pathHazards, valueSoFar, currentValue) {

            if (allHazards.camouflage) {  // the rain fucks the camouflage
                
                var ratio = 1;

                if (currentValue > 20) // >20%
                    ratio = 0.8;
                if (currentValue > 40) // >40%
                    ratio = 0.6;
                if (currentValue > 60) // >60%
                    ratio = 0.4;
                if (currentValue > 80) // >80%
                    ratio = 0.2;
                if (currentValue == 100) // =100%
                    ratio = 0;
               
                return {
                    rain: valueSoFar + currentValue,
                    cars: Math.floor(allHazards.camouflage * ratio) //remaining camouflage
                }
            }

            return {
                rain: valueSoFar + currentValue
            }            

        },

        forest: function(allHazards, pathHazards, valueSoFar, currentValue) {

            // if forest on this path is longer than 10 miles
            // AND there are bears (10 maximum)
            if (currentValue > 10 && allHazards.bears) {

                var loss = Math.ceil(100 - Math.random()*30)/100; //between 0% and 30% (0.70 <= loss <= 1)

                return {
                    forest: valueSoFar + currentValue,
                    men: Math.floor(pathHazards.mens * loss)
                }
            }


        },

        water: function(allHazards, pathHazards, valueSoFar, currentValue) {

            // if water on this path is higher than 4m
            // AND we have grenades
            if (currentValue > 4 && allHazards.grenades) {
                // halve the amount of grenades we have
                // also return the new water addition
                return {
                    water: valueSoFar + currentValue,
                    grenades: pathHazards.grenades / 2
                }
            }

            // if water on this path is higher than 100m
            // AND there are sharks and soldiers are on boats
            if (currentValue > 100 && allHazards.sharks && allHazards.boats) {

                var loss = Math.round(100 - (85 + Math.random()*10))/100; //between 30% and 60% (0.40 <= loss <= 0.70)

                return {
                    water: valueSoFar + currentValue,
                    boats: Math.floor(pathHazards.boats * loss),
                    mens: Math.floor(pathHazards.mens * loss) //we assume that every boats have the same number of mens on them
                }
            }

            // if water on this path is higher than 100m
            // AND there are sharks and soldiers are swimming
            if (currentValue > 100 && allHazards.sharks && allHazards.boats == 0) {

                var loss = Math.round(100 - (85 + Math.random()*10))/100; //between 85% and 95% (0.05 <= loss <= 0.15)

                return {
                    water: valueSoFar + currentValue,
                    mens: Math.floor(pathHazards.mens * loss) //we assume that every boats have the same number of mens on them
                }
            }

            if (allHazards.wind && allHazards.boats) {

                var windForce = Math.floor(Math.random()*13); //from 0 to 12, according the Beaufort scale (let's do that properly ^)

                //if <6, no loss
                //if >=6, [6 -> 12] multiplied per 5 in order to have a larger range of loss
                if (windForce < 6)
                    windForce = 0;
                else
                    windForce = windForce*5;

                var loss = Math.round(100 - windForce)/100; //from 30% to 60% of loss (0.40 <= loss <= 0.70) / 0% of loss if windForce < 6 (loss = 1)

                return {
                    water: valueSoFar + currentValue,
                    mens: pathHazards.mens * loss
                }
            }

            return valueSoFar + currentValue;
        },

        // fallback mediator
        default: function(allHazards, pathHazards, valueSoFar, currentValue) {
            return valueSoFar + currentValue;
        }


    };

    if (mediators.hasOwnProperty(name)) {
        return mediators[name](allHazards, pathHazards, valueSoFar, currentValue);
    }

    return mediators.default(allHazards, pathHazards, valueSoFar, currentValue);
};
