directiveModule.directive('chartDirective', ['$rootScope', 'd3Service', function($rootScope, d3Service) {
    return {
        restrict: 'A',
        scope: {
            'config': '='
      },
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
            
          function validateNumber(input) {

          var fallback = 0;

          if (angular.isNumber(input))
            return input;

          if (angular.isString(input)) {
            var testNumber = Number(input);
            if (!isNaN(testNumber)) {
              return testNumber;
            }

          }

          return fallback;

        }

        /**
         * @function setupGraph
         * @description Setup painting elements and functions ready for render. 
         * This step should ideally only be repeated on window resize. 
         * All data changes need to be handled by render alone.
         */
        function setupGraph() {

          scope.wrapper = element[0];

          // Making sure the element we want to draw in is empty.
          d3
            .select(scope.wrapper)
            .selectAll('*')
            .remove();

          // Injecting our painting canvas in this case a <svg> element
          scope.vizCanvas = d3.select(scope.wrapper)
            .append("svg")
            .style('width', '100%')
            .style('height', d3.select(scope.wrapper).node().getBoundingClientRect().height + "px");

          scope.padding = {
            vertical: 10,
            horizontal: 10
          };

          // Since we want to have some inner padding we group all elements inside a <g>
          scope.vizPadded =
            scope.vizCanvas
            .append("g")
            .attr("transform", "translate(" + scope.padding.vertical + "," + scope.padding.horizontal + ")");

          // Setting up the scale for our x-Axis
          scope.x = d3.scale
            .linear()
            .range([
              0,
              scope.vizCanvas.node().getBoundingClientRect().width - (scope.padding.horizontal * 2)
            ]);

          // Setting up the scale for our y-Axis
          scope.y = d3.scale
            .linear()
            .range([
              scope.vizCanvas.node().getBoundingClientRect().height - (scope.padding.vertical * 2),
              0
            ]);

          // Using d3.svg.line() to setup a function we can use to create the value for d attribute of a <path> element
          scope.plotLine = d3.svg
            .line()
            .x(function(data) {
              return scope.x(validateNumber(data.x));
            })
            .y(function(data) {
              return scope.y(validateNumber(data.y));
            });

        }

        /**
         * @function paintGraph
         *
         * @description
         * Render the actual viz. This step is repeated to reflect changes in data etc.
         */
        function paintGraph() {

          // Do we have an interpolation option set? If so lets apply it
          if (angular.isDefined(scope.config.interpolate))
            scope.plotLine
            .interpolate(scope.config.interpolate);

          // Extending the domain of our x-Axis scale to the current data values
          scope.x
            .domain(d3.extent(scope.config.data, function(dataPoint) {
              return validateNumber(dataPoint.x);
            }));

          // Extending the domain of our y-Axis scale to the current data values
          scope.y
            .domain(d3.extent(scope.config.data, function(dataPoint) {
              return validateNumber(dataPoint.y);
            }));

          // To show a smooth transition on first render we set a standard line flat at minimum y value
          var yMin = d3.min(scope.y.domain());
          var defaultLineConfig = Array.apply(null, {
            length: scope.config.data.length
          }).map(
            function(d, i) {
              return {
                x: i,
                y: yMin
              };
            });

          // On first render or if there is no line we append a <path> path to our <svg>
          if (scope.vizPadded.select(".line").empty())
            scope.line = scope.vizPadded
            .append('path')
            .attr("class", 'line')
            .attr("d", scope.plotLine(defaultLineConfig));

          // Then we apply current data values to that line
          scope.line
            .transition().duration(100).ease('linear')
            .attr("d", scope.plotLine(scope.config.data));

          // Selecting any points present in the <svg>
          scope.points = scope.vizPadded
            .selectAll(".point")
            .data(scope.config.data);

          // If points are switched off
          if (scope.config.showPoints === 'no') {

            // Make sure they are removed
            scope.points
              .transition().duration(100).ease('linear')
              .style("opacity", 0)
              .remove();

            // If points are switched on
          } else {

            // Make sure there to append any <circles> we are missing to represent our data
            scope.points
              .enter()
              .append("circle")
              .attr("class", "point")
              .attr("cx", function(data) {
                return scope.x(validateNumber(data.x));
              })
              .attr("cy", scope.y(validateNumber(yMin)))
              .attr("r", 1.5);

            // Or make if we have more <circle> than points in our data we remove them
            scope.points
              .exit()
              .transition().duration(100).ease('linear')
              .style("opacity", 0)
              .remove();

            // All points that are left now should represent our datapoints so we set their positions
            scope.points
              .transition().duration(100).ease('linear')
              .attr("cx", function(data) {
                return scope.x(validateNumber(data.x));
              })
              .attr("cy", function(data) {
                return scope.y(validateNumber(data.y));
              });

          }

        }

        // We make sure that d3 library is loaded and then trigger setup & painting
        // d3Service.loaded().then(function(d3) {
        //   setupGraph();
        //   paintGraph();
        // });
            setupGraph();
            paintGraph();
        // On config change events we paint our graph again to reflect any changes
        $rootScope.$on('configChange', paintGraph);
        });
      }}
  }]);
