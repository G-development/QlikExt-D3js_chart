define([
        //here are the dependencies;
        'jquery',
        'qlik',

        './properties',
        './initial',

        'css!./css/master.css',

        './lib/d3.v3.min'

        /*
        './lib/d3',
        './lib/d3.min',
        './lib/d3.v3',
        'https://d3js.org/d3.v6.min.js',
        'https://d3js.org/d3-array.v2.min.js',
        'https://d3js.org/d3-color.v2.min.js',
        'https://d3js.org/d3-format.v2.min.js',
        'https://d3js.org/d3-interpolate.v2.min.js',
        'https://d3js.org/d3-time.v2.min.js',
        'https://d3js.org/d3-time-format.v3.min.js',
        'https://d3js.org/d3-scale.v3.min.js'
        */
    ],
    function($, qlik, props) {
        'use strict';

        return {

            //def of layout-panels - ref to properties.js / initial.js
            definition: props,
            initialProperties: initial,


            //Paint resp.Rendering logic
            paint: function($element, layout) {
                //Create hyperCube var
                var hc = layout.qHyperCube;
                var self = this;

                //Empty the element
                $element.empty();

                var margin = { top: 20, right: 5, bottom: 40, left: 20 },
                    width = $element.width() - margin.left - margin.right,
                    height = $element.height() - margin.top - margin.bottom;

                var id = "container_" + layout.qInfo.qId;
                //console.log("Width:", width, "Height:", height, "Id", id);

                if (document.getElementById(id)) {
                    $("#" + id).empty();
                } else {
                    $element.append($('<div />;').attr("id", id));
                }

                var parseDate = d3.time.format("%Y-%m").parse;

                var x = d3.scale
                    .ordinal()
                    .rangeRoundBands([0, width], .05);
                var y = d3.scale
                    .linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    //.tickFormat(d3.time.format("%Y-%m"));
                console.log("xAxis:", xAxis);

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(10);

                var svg = d3.select("#" + id).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

                var data = [
                    { date: 25, value: 53 },
                    { date: 29, value: 63 },
                    { date: 17, value: 73 },
                    { date: 50, value: 83 },
                    { date: 171, value: 93 }
                ];

                x.domain(data.map(function(d) { return d.date; }));
                y.domain([0, d3.max(data, function(d) { return d.value; })]);

                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .attr("class", "x axis")
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "rotate(-90)");


                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Value ($)");



                svg.selectAll("bar")
                    .data(data)
                    .enter().append("rect")
                    .style("fill", "red")
                    .attr("x", function(d) { return x(d.date); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.value); })
                    .attr("height", function(d) { return height - y(d.value); });


                console.log("-------END-------");
            }
        };
    });