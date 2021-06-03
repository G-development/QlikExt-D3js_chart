define([
        //here are the dependencies;
        'jquery',
        'qlik',

        './properties',
        './initial',

        'css!./css/master.css',

        './lib/d3',
        'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.js'
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

                //get datas
                var datasets = hc.qDataPages[0].qMatrix.map((d) => {
                    return {
                        "Dim": d[0].qText,
                        "Dim_key": d[0].qElemNumber,
                        "Value": d[1].qNum
                    }
                });

                //sort datas
                function compare_values(a, b) {
                    if (a.Value < b.Value) {
                        return -1;
                    } else if (a.Value > b.Value) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
                datasets.sort(compare_values);
                console.log("Datasets:", datasets);


                var data = [];
                var dimName = hc.qDimensionInfo[0].qFallbackTitle;
                var measName = [];

                hc.qMeasureInfo.forEach((d, i) => {
                    measName.push(hc.qMeasureInfo[i].qFallbackTitle)
                    data.push(hc.qDataPages[0].qMatrix.map((d) => {
                        return {
                            "Dim": d[0].qText,
                            "Dim_key": d[0].qElemNumber,
                            [measName[i]]: d[i + 1].qNum
                        }
                    }));
                });

                var concat = data[0].concat(data[1]);

                var result = _(concat)
                    .groupBy('Dim')
                    .map(_.spread(_.assign))
                    .value();

                console.log("Result:", result);

                var columns = [];
                var dimensions = [];
                var measures = [];

                hc.qDimensionInfo.forEach((d) => {
                    dimensions.push(d.qFallbackTitle);
                    columns.push(d.qFallbackTitle);
                })
                hc.qMeasureInfo.forEach((d) => {
                    measures.push(d.qFallbackTitle);
                    columns.push(d.qFallbackTitle);
                })
                console.log("Columns:", columns, "Dimensions:", dimensions, "Measures:", measures);


                //Empty the element at every event trigger
                $element.empty();

                var margin = { top: 20, right: 5, bottom: 40, left: 50 },
                    width = $element.width() - margin.left - margin.right,
                    height = $element.height() - margin.top - margin.bottom;

                var id = "container_" + layout.qInfo.qId;

                //check if #id already exists
                if (document.getElementById(id)) {
                    $("#" + id).empty();
                } else {
                    $element.append($('<div />;').attr("id", id));
                }

                //x & y
                var x = d3.scale
                    .ordinal()
                    .rangeRoundBands([0, width], .05);
                var y = d3.scale
                    .linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");
                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(10);

                //append svg
                var svg = d3.select("#" + id).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

                //set x/y domains
                x.domain(datasets.map(function(d) { return d.Dim }));
                y.domain([0, d3.max(datasets, function(d) { return d.Value })]);

                //x axis
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .attr("class", "x axis")
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "rotate(-90)");

                //y axis
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Value");

                //get colors
                var colors = [];
                for (let i = 0; i < hc.qDimensionInfo[0].qCardinal; i++) {
                    colors.push(
                        hc.qDataPages[0].qMatrix[i][1].qAttrExps.qValues[0].qText)
                }

                //create bars
                svg.selectAll("bar")
                    .data(datasets)
                    .enter()
                    .append("rect")
                    .style("fill", (d, i) => { return colors[i] })
                    .attr("x", (d) => { return x(d.Dim); })
                    .attr("width", x.rangeBand())
                    .attr("y", (d) => { return y(d.Value); })
                    .attr("height", (d) => { return height - y(d.Value); });

                svg.selectAll("bar")
                    .data(datasets)
                    .enter().append("text")
                    .style("fill", (d, i) => { return colors[i] })
                    .attr("class", "bar")
                    .attr("text-anchor", "left")
                    .attr("x", function(d) { return x(d.Dim); })
                    .attr("y", function(d) { return y(d.Value) - 5; })
                    .text(function(d) { return d.Value; });

                console.log("-------END-------");
                qlik.resolve();
            }
        };
    });