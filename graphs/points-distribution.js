function drawPointsDistribution(divName) {
    d3.csv("../data/points-distribution.csv", function (data) {

        data = data.map(function (d) {
            d.Points = parseFloat(d.Points);
            d.Count = parseFloat(d.Count);
            return d;
        });

        var margin = {top: 20, right: 15, bottom: 60, left: 60}
            , width = 960 - margin.left - margin.right
            , height = 500 - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return d.Points;
            })])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return d.Count;
            })])
            .range([height, 0]);

        d3.select('#' + divName).append("div").attr("id", "controls");

        var chart = d3.select('#' + divName)
            .append('svg:svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
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
            .text("Number of points");

        drawYAxis();

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        var color = black;

        var g = main.append("svg:g");

        // Line
        var line = d3.line()
            .x(function (d) {
                return x(d.Points);
            })
            .y(function (d) {
                return y(d.Count);
            });

        var curve = g.append("path")
            .style("fill", "none")
            .style("stroke", color)
            .attr("stroke-width", 1.5)
            .datum(data)
            .attr("d", line);

        // Points
        var points = g.selectAll("scatter-dots")
            .data(data)
            .enter().append("svg:circle")
            .attr("cx", function (d) {
                return x(d.Points);
            })
            .attr("cy", function (d) {
                return y(d.Count);
            })
            .attr("r", 4)
            .on("mouseover", function (d) {

                d3.select(this).style("fill", yellow);

                div.transition()
                    .duration(200)
                    .style("opacity", .9);

                div.html(d.Count + " people have " + d.Points + " points")
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

        d3.select('#controls')
            .append("label")
            .attr("for", "points-yaxis-slider")
            .text("Truncate y-axis at ");

        var slider = d3.select('#controls')
            .append("input")
            .attr("id", "points-yaxis-slider")
            .attr("type", "input")
            .attr("value", y.domain()[1])
            .on("change", function () {

                y.domain([0, this.value]);

                points.attr("cy", function (d) {
                    return y(d.Count);
                });

                line.y(function (d) {
                    return y(d.Count);
                });

                curve
                    .datum(data)
                    .attr("d", line);

                drawYAxis();

            });

        slider.node().value = y.domain()[1];

        function drawYAxis() {
            d3.select("#yAxis").remove();

            main.append("g")
                .attr("id", "yAxis")
                .call(d3.axisLeft(y))
                .attr('class', 'main axis')
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("People");

        }
    })
}
