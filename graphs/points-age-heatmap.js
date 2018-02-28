function drawPointsAgeHeatmap(divName) {

    d3.csv("../data/points.csv", function (data) {

        data = data.map(function (d) {
            d.age = parseFloat(d.age);
            d.points = parseFloat(d.points);
            d.frequency = parseFloat(d.frequency);
            d.logFrequency = Math.log(d.frequency);
            return d;
        });
    var all_data = data;
            data = data.filter(function (d) {
            return d.sex === "male"
        });

        var margin = {top: 20, right: 15, bottom: 60, left: 60}
            , width = 800 - margin.left - margin.right
            , height = 800 - margin.top - margin.bottom;


        var subplot_total_width = 400;
         var margin_subplot1 = {top: 20, right: 15, bottom: 60, left: 820},
            width_subplot1 = (800 + subplot_total_width) - margin_subplot1.left - margin_subplot1.right,
             height_subplot1 = 400 - margin_subplot1.top - margin_subplot1.bottom;

          var margin_subplot2 = {top: 400+20, right: 15, bottom: 60, left: 820},
            width_subplot2 = (800 + subplot_total_width) - margin_subplot1.left - margin_subplot1.right,
             height_subplot2 = 400 - margin_subplot1.top - margin_subplot1.bottom;


        var x = d3.scaleLinear()
            .domain([0, 37])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([14, 100])
            .range([height, 0]);

        var colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain([0, d3.max(data, function (d) {
                return d.frequency;
            })]);

        var chart = d3.select('#' + divName)
            .append('svg:svg')
            .attr('width', 800 + 800)
            .attr('height', 800)
            .attr('class', 'chart');

        var main = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'main');

        main.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .attr('class', 'main axis')
            .append("text")
            .attr("fill", "#000")
            .attr("y", 30)
            .attr("dy", "0.71em")
            .attr("x", (width / 2).toString())
            .attr("text-anchor", "end")
            .text("Points");

        main.append("g")
            .call(d3.axisLeft(y))
            .attr('class', 'main axis')
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Age");


        var g = main.append("svg:g");

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        var rects = g.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.points - 1)
            })
            .attr("width", function (d) {
                return x(d.points) - x(d.points - 1)
            })
            .attr("y", function (d) {
                return y(d.age + 0.5)
            })
            .attr("height", function (d) {
                return y(d.age - 1) - y(d.age)
            })
            .style("fill", function (d) {
                return colorScale(d.frequency);
            })
            .style("stroke", function (d) {
                return colorScale(d.frequency);
            });

        var graph_fixed = false;

        rects.on("mouseover", function (d) {

            d3.select(this).style("stroke", black);
            if (!graph_fixed){
                drawSubplot1(subplot_1, d);
                drawSubplot2(subplot_2, d);
            }

            div.transition()
                .duration(200)
                .style("opacity", .9);

            div.html(to2dp(d.frequency) + "/1000 men of age " + d.age + " have " + d.points + " points ")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mouseout", function () {
                d3.select(this).style("stroke", function (d) {
                    return colorScale(d.frequency);
                });

                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function(){graph_fixed = !graph_fixed;});


        // subplot
        var subplot_1 = chart.append('g')
            .attr('transform', 'translate(' + margin_subplot1.left + ',' + margin_subplot1.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'main');
        var subplot_2 = chart.append('g')
            .attr('transform', 'translate(' + margin_subplot2.left + ',' + margin_subplot2.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'main');


        // Control for color scale
        d3.select('#' + divName)
            .append("label")
            .attr("for", "heat-map-scale-slider")
            .text("Upper limit for color scale");

        d3.select('#' + divName)
            .append("input")
            .attr("id", "heat-map-scale-slider")
            .attr("type", "range")
            .attr("min", 0.01)
            .attr("max", colorScale.domain[1])
            .on("change", function () {

                colorScale.domain([0, this.value]);

                rects.style("fill", function (d) {
                    return colorScale(d.frequency);
                })
                .style("stroke", function (d) {
                    return colorScale(d.frequency);
                });
        });


        function drawSubplot1(main, d) {
            main.node().innerHTML = "";

            var filtered_data = all_data.filter(function (d2) {
                return d2.age === d.age
            });

            var x_axis_label = "Points";
            var geom = {width: width_subplot1, height: height_subplot1};

            drawSubplot(main, filtered_data, "points", x_axis_label, geom);
        }

        function drawSubplot2(main, d) {
            main.node().innerHTML = "";

            var filtered_data = all_data.filter(function (d2) {
                return d2.points === d.points
            });

            var x_axis_label = "Age";

            var geom = {width: width_subplot2, height: height_subplot2};
            drawSubplot(main, filtered_data, "age", x_axis_label, geom)
        }

        function drawSubplot(main, filtered_data, x_axis_field, x_axis_label, geom) {

            // scales
            var x = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) {
                    return d[x_axis_field];
                })])
                .range([0, geom.width]);

            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) {
                    return d.frequency;
                })])
                .range([geom.height, 0]);


            main.append("g")
                .attr("transform", "translate(0," + geom.height + ")")
                .call(d3.axisBottom(x))
                .attr('class', 'main axis')
                .append("text")
                .attr("fill", "#000")
                .attr("y", 30)
                .attr("dy", "0.71em")
                .attr("x", (geom.width / 2).toString())
                .attr("text-anchor", "end")
                .text(x_axis_label);

            main.append("g")
                .call(d3.axisLeft(y))
                .attr('class', 'main axis')
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Proportion of drivers/1000");

            var g = main.append("svg:g");

            var div = d3.select("body").append("div")
                .attr("class", "tooltip")

                .style("opacity", 0);

            var male_data = filtered_data.filter(function(d){ return d.sex==="male"});
            plotData(male_data, blue);

            var female_data = filtered_data.filter(function(d){ return d.sex==="female"});
            plotData(female_data, pink);

            function plotData(filtered_data, color) {
                var group = g.append("g");

                // Line
                var line = d3.line()
                    .x(function (d) {
                        return x(d[x_axis_field]);
                    })
                    .y(function (d) {
                        return y(d.frequency);
                    });

                var curve = group.append("path")
                    .style("fill", "none")
                    .style("stroke", color)
                    .attr("stroke-width", 2)
                    .datum(filtered_data)
                    .attr("d", line);

                // Points
                var points = group.selectAll("scatter-dots")
                    .data(filtered_data)
                    .enter().append("svg:circle")
                    .attr("cx", function (d) {
                        return x(d[x_axis_field]);
                    })
                    .attr("cy", function (d) {
                        return y(d.frequency);
                    })
                    .attr("r", 4)
                    .on("mouseover", function (d) {
                        d3.select(this).style("fill", yellow);

                        div.transition()
                            .duration(200)
                            .style("opacity", .9);

                        div.html(to2dp(d.frequency) + "/1000 " + d.sex + " of age " + d.age + " have " + d.points + " points ")
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function () {
                        d3.select(this).style("fill", color);

                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                    .style("fill", color);
            }

        }


    })
}

