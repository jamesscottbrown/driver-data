function drawPointsAgeHeatmap(divName) {

    d3.csv("../data/points.csv", function (data) {

        data = data.filter(function (d) {
            return d.sex === "male"
        });
        data = data.map(function (d) {
            d.age = parseFloat(d.age);
            d.points = parseFloat(d.points);
            return d;
        });

        var margin = {top: 20, right: 15, bottom: 60, left: 60}
            , width = 800 - margin.left - margin.right
            , height = 800 - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .domain([0, 37])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([14, 100])
            .range([height, 0]);

        var colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain([0, d3.max(data, function (d) {
                return parseFloat(d.frequency);
            })]);

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
            .attr('class', 'main axis date')
            .append("text")
            .attr("fill", "#000")
            .attr("y", 30)
            .attr("dy", "0.71em")
            .attr("x", (width / 2).toString())
            .attr("text-anchor", "end")
            .text("Points");

        main.append("g")
            .call(d3.axisLeft(y))
            .attr('class', 'main axis date')
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

        rects.on("mouseover", function (d) {


            d3.select(this).style("stroke", black);

            div.transition()
                .duration(200)
                .style("opacity", .9);

            div.html(to2dp(d.frequency) + "/1000 people of age " + d.age + " have " + d.points + " points ")
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
            });


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
        })
    })
}
