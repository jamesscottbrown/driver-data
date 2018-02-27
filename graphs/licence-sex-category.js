function drawScatterplotSexCategory(divName) {


    d3.csv("../data/entitlement-class.csv", function (data) {

        var margin = {top: 20, right: 15, bottom: 60, left: 60}
            , width = 800 - margin.left - margin.right
            , height = 800 - margin.top - margin.bottom;


        var x = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return Math.max(parseFloat(d.Male), parseFloat(d.Female));
            })])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return Math.max(parseFloat(d.Male), parseFloat(d.Female))
            })])
            .range([height, 0]);


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
            //.select(".domain")
            //.remove()
            .append("text")
            .attr("fill", "#000")
            .attr("y", 30)
            .attr("dy", "0.71em")
            .attr("x", (width / 2).toString())
            .attr("text-anchor", "end")
            .text("Men");

        main.append("g")
            .call(d3.axisLeft(y))
            .attr('class', 'main axis date')
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Women");


        var g = main.append("svg:g");

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        g.selectAll("scatter-dots")
            .data(data)
            .enter().append("svg:circle")
            .attr("cx", function (d) {
                return x(parseFloat(d.Male));
            })
            .attr("cy", function (d) {
                return y(parseFloat(d.Female));
            })
            .attr("r", 4)
            .style("opacity", 0.5)
            .style("stroke", "grey")
            //.attr("title", function(d){return parseFloat(d.Male)/parseFloat(d.Female) + "% male"});

            .on("mouseover", function (d) {

                d3.select(this).style("fill", yellow);

                div.transition()
                    .duration(200)
                    .style("opacity", .9);

                var ratio = parseFloat(d.Male) / (parseFloat(d.Male) + parseFloat(d.Female));
                var percentage = to2dp(ratio * 100);
                div.html("<b>Class " + d.Class + "</b>, " + percentage + "% male<br />(" + d.Male + " male, " + d.Female + " female)")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {

                var sex_color = (parseFloat(d.Male) > parseFloat(d.Female)) ? blue : pink;
                var color = d.Class.indexOf("prov") == -1 ? sex_color : "none"
                d3.select(this).style("fill", color);


                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .style("fill", function (d) {
                var sex_color = (parseFloat(d.Male) > parseFloat(d.Female)) ? blue : pink;
                return d.Class.indexOf("prov") == -1 ? sex_color : "none"
            })
            .style("stroke-width", "1px")
            .style("stroke", function (d) {
                // return black
                return (parseFloat(d.Male) > parseFloat(d.Female)) ? blue : pink;
            });


        g.append("line")
            .attr("x1", 0)
            .attr("y1", height)
            .attr("x2", width)
            .attr("y2", 0)
            .style("stroke-thickness", "1px")
            .style("stroke", "black")
            .style("opacity", 0.5)
    })


}
