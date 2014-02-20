/**
 * Created by ramakrishna on 18/2/14.
 */
var petasenseDirectives = angular.module('petasenseDirectives', []); // Angular Module Name

petasenseDirectives.directive('linegraph', function () { // Angular Directive

        var LineChart = Class.create({
            initialize: function(datajson,yaxisName,yaxisPos/*,d3Format*/) {
                this.datajson = datajson;
                this.yaxisName = yaxisName;
                this.yaxisPos = yaxisPos;
                //this.d3Format = d3Format;
            },
            workOnElement: function(element) {
                this.element = element;
            },
            generateGraph: function() {
                //d3 specific coding
                var margin = {
                        top: 20, right: 20, bottom: 30, left: 40},
                    width = 500 - margin.left - margin.right,
                    height = 300 - margin.top - margin.bottom;

                //var parseDate = d3.time.format(this.d3Format).parse;

                var x = d3.time.scale()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var line = d3.svg.line()
                    .x(function(d) { return x(d.time); })
                    .y(function(d) { return y(d.data); });

                var svg = d3.select(this.element).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                d3.json(this.datajson, function(error, data) {
                    data.forEach(function(d) {
                        d.time = d.time;//parseDate(d.date);
                        d.data = +d.data;
                    });
                    if (error) return console.warn(error);
                    //console.log(this.xaxisName);

                    x.domain(d3.extent(data, function(d) { return d.time; }));
                    y.domain(d3.extent(data, function(d) { return d.data; }));

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", this.yaxisPos)
                        //.attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(this.yaxisName);

                    svg.append("path")
                        .datum(data)
                        .attr("class", "line")
                        .attr("d", line);
                }.bind(this));
            }
        });
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            compile: function (elem, attrs) {

                console.log(attrs.id);
                console.log(attrs.datajson);
                var html = "<div id='" + attrs.id + "' ></div>";
                var newElem = $(html);
                elem.replaceWith(newElem);
                var ourGraph = new LineChart(attrs.datajson,attrs.yaxisName,attrs.yaxisPos/*,attrs.d3Format*/);
                ourGraph.workOnElement('#'+attrs.id);

                ourGraph.generateGraph();
            }
        };


 });


petasenseDirectives.directive('myCurrentTime', function ($interval, dateFilter) {
    function link(scope, element, attrs) {
        var format, timeoutId;
        function updateTime(){
            element.text(dateFilter(new Date(), format));
        }

        scope.$watch(attrs.myCurrentTime, function(value){
            format = value;
            updateTime();
        });

        element.on('$destroy', function(){
            $interval.cancel(timeoutId);
        });

        timeoutId = $interval(function(){
            updateTime();
        }, 1000);
    }

    return{
        link: link
    };
});
