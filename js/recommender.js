Recommender = function(journey, options) {
	if (options)
		this.options = this.extend(this.options, options);

	this.journey = journey;

	// Handle async fetch
	this.fetchRecommendedValues(this.recommend.bind(this));
};

Recommender.prototype.options = {
	weightings: {
		danger: 5,
		mountain: 5,
		fog: 5,
		rain: 5,
		forest: 5,
		water: 5,
		oxygen: 5,
		cars: 5,
		camouflage: 5,
		bears: 5,
		men: 5,
		grenades: 5,
		boats: 5,
		sharks: 5,
		wind: 5
	}
};

Recommender.prototype.fetchRecommendedValues = function(callback) {
	if (this.recommendedValues) return;

	var self = this;

	$.ajax({
		url: 'config.json',
		success: function(data) {
			self.recommendedValues = data.hazards;
			callback(self);
		},
		error: function(err) {
			throw new Error('Err: Recommended values fetch failed');
		}
	});
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
	var recommendedValue = this.recommendedValues[hazard.name].value
	,	weighting = this.options.weightings[hazard.name]
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