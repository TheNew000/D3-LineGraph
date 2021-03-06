myApp.directive('lineGraph', ['$window', '$timeout', 'd3Service', function($window, $timeout, d3Service) {
    return {
        restrict: 'EA',
        scope: {
            data: '=',
        onClick: '&'
    },
    link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {

            // set the dimensions and margins of the graph
            var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

            // parse the date / time
            console.log(scope[attrs.data])
            var parseTime = d3.timeParse("%d-%b-%y");

            // format the data
          scope[attrs.data].forEach(function(d) {
               d.date = parseTime(d.date);
                d.value = +d.value;
          });


            // set the ranges
            var x = d3.scaleTime().range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);

            // define the line
            var valueline = d3.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.value); });

            // append the svg obgect to the body of the page
            // appends a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            var svg = d3.select(element[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

            // Scale the range of the data
            x.domain(d3.extent(scope[attrs.data], function(d) { return d.date; }));
            y.domain([0, d3.max(scope[attrs.data], function(d) { return d.value; })]);

          // Add the valueline path.
            svg.append("path")
              .data([scope[attrs.data]])
              .attr("class", "line")
              .attr("d", valueline);

          // Add the X Axis
            svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          // Add the Y Axis
            svg.append("g")
              .call(d3.axisLeft(y));

        });
    }};
}]);
