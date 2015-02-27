define(['./module', './referencechart'], function(app, ReferenceChart) {
	var labelsIndian = ["Sa", "", "Re", "", "Ga", "Ma", "", "Pa", "", "Dha", "", "Ni"];
	app.directive('ngSingGraph', function() {
        return {
            link: function(scope, element) {
                var w = window,
				d = document,
				e = d.documentElement,
				g = d.getElementsByTagName('body')[0],
				x = w.innerWidth || e.clientWidth || g.clientWidth,
				y = w.innerHeight|| e.clientHeight|| g.clientHeight;
				//x = 1000;
				var chartSettings = {
					width: x,
					height: 0.46*x,
					marginTop:20,
					marginRight:20,
					marginBottom:20,
					marginLeft:30,
					labels: labelsIndian,
					yTicks: 38,
					timeSpan:10000,
					precision: 0
				};
				chart = ReferenceChart.getChart(element.attr('id'), scope, chartSettings);
				scope.chart = chart;
            }
        };
    });
});