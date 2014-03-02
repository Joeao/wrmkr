Recommender = function(journey, options) {
	if (options)
		this.options = this.extend(this.options, options);

	this.journey = journey;
};

Recommender.prototype.options = {
	recommendedValues: {
		danger: {
			value: 5,
			weighting: 5
		},
		mountain: {
			value: 5,
			weighting: 5
		},
		fog: {
			value: 5,
			weighting: 5
		},
		rain: {
			value: 5,
			weighting: 5
		},
		forest: {
			value: 5,
			weighting: 5
		},
		water: {
			value: 5,
			weighting: 5
		},
		oxygen: {
			value: 5,
			weighting: 5
		},
		cars: {
			value: 5,
			weighting: 5
		},
		camouflage: {
			value: 5,
			weighting: 5
		},
		bears: {
			value: 5,
			weighting: 5
		},
		men: {
			value: 5,
			weighting: 5
		},
		grenades: {
			value: 5,
			weighting: 5
		},
		boats: {
			value: 5,
			weighting: 5
		},
		sharks: {
			value: 5,
			weighting: 5
		},
		wind: {
			value: 5,
			weighting: 5
		}
	}
};

Recommender.prototype.recommend = function() {
	var self = this;

	this.journey.completedPaths.forEach(function(path) {
		path.hazardValue = self.recommendPath(path);
	});

	this.keySort(this.journey.completedPaths);
};

Recommender.prototype.recommendPath = function(path) {
	var total = 0;

	for (var hazard in path.hazards) {
		total += this.calculateHazard({
			name: hazard,
			value: path.hazards[hazard]
		});
	}

	return total;
};

Recommender.prototype.calculateHazard = function(hazard) {
	var recommendedValue = this.options.recommendedValues[hazard.name].value
	,	weighting = this.options.recommendedValues[hazard.name].weighting
	;

	return (Math.abs(recommendedValue - hazard.value)) * weighting;
};

Recommender.prototype.keySort = function(arr) {
	arr.sort(function(a, b) {
		a = a.hazardValue;
		b = b.hazardValue;

		return a - b;
	});
};

Recommender.prototype.extend = function(orig, extra) {
	return Object.keys(extra).forEach(function(key) {
		orig[key] = extra[key];
	});
};