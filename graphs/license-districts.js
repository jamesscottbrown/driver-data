function drawLicenseDistricts(divName, map) {


    d3.csv("../data/licence-districts.csv", function (data) {

        data = data.map(function (d) {
            d.provisional_male = parseFloat(d.provisional_male);
            d.provisional_female = parseFloat(d.provisional_female);
            d.provisional_total = parseFloat(d.provisional_total);
            d.full_male = parseFloat(d.full_male);
            d.full_female = parseFloat(d.full_female);
            d.full_total = parseFloat(d.full_total);

            return d;
        });

        var margin = {top: 20, right: 15, bottom: 60, left: 60}
            , width = 800 - margin.left - margin.right
            , height = 800 - margin.top - margin.bottom;


        var x = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return Math.max(parseFloat(d.provisional_total), parseFloat(d.full_total));
            })])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return Math.max(parseFloat(d.provisional_total), parseFloat(d.full_total))
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
            .text("Number of Provisional Licenses");

        main.append("g")
            .call(d3.axisLeft(y))
            .attr('class', 'main axis date')
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Number of Full Licenses");


        var g = main.append("svg:g");

        var div = d3.select("body").append("div")
            .style("height", "50px")
            .attr("class", "tooltip")
            .style("opacity", 0);


        g.selectAll("scatter-dots")
            .data(data)
            .enter().append("svg:circle")
            .attr("class", "scatter-dots")
            .attr("cx", function (d) {
                return x(parseFloat(d.provisional_total));
            })
            .attr("cy", function (d) {
                return y(parseFloat(d.full_total));
            })
            .attr("r", 4)
            .style("opacity", 0.5)
            .style("stroke", "grey")

            .on("mouseover", function (d) {

                div.transition()
                    .duration(200)
                    .style("opacity", .9);

                var ratio = parseFloat(d.provisional_total) / (parseFloat(d.provisional_total) + parseFloat(d.full_total));
                var percentage = to2dp(ratio * 100);
                div.html("<b> " + percentage + "%<br /> of licenses are provisional in <b>" + d.district + "</b> (" + d.provisional_total + " provisional, " + d.full_total + " full)")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {

                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .style("stroke-width", "1px");


        main.append("text")
            .attr("x", x(70000))
            .attr("y", y(5000))
            .text("Highest proportion of provisional licenses")

                main.append("text")
            .attr("x", x(5000))
            .attr("y", y(75000))
            .text("Lowest proportion of provisional licenses")

        // Dragging ratio line
        var ratioLine = g.append("line")
            .attr("x1", 0)
            .attr("y1", height)
            .attr("x2", width)
            .attr("y2", 0)
            .style("stroke-thickness", "1px")
            .style("stroke", "black")
            .style("opacity", 0.5);

        var ratioCircle = g.append("circle")
            .attr("cy", 0)
            .attr("cx", width)
            .attr("r", 4)
            .style("fill", "black")
            .call(d3.drag()
                    .on("drag", dragged)
            );

        function dragged(d) {
            d3.select(this).attr("cx", Math.min(d3.event.x, width)).attr("cy", Math.max(0,d3.event.y));
            updateHighlighting();
        }

        function updateHighlighting(){
            var cx = parseFloat(ratioCircle.attr("cx"));
            var cy = parseFloat(ratioCircle.attr("cy"));
            var gradient = (height - cy) / cx;

            if (gradient > 1) {
                ratioLine.attr("y2", 0).attr("x2", height / gradient);
            } else {
                ratioLine.attr("x2", width).attr("y2", height - width * gradient);
            }

            var ratio = x.invert(cx) / y.invert(cy);

            var selected_districts = [];
            main.selectAll(".scatter-dots").style("fill", function(d){
                if ((d.provisional_total / d.full_total) > ratio){
                    selected_districts.push(d.district);
                    return yellow;
                }
                return "steelblue";
            });


            map.selectAll(".feature")
                .style("fill", function(d){
                    var district_name = d.properties.name;
                    var alt_name = district_name;

                    if (district_name.length == 3){
                        alt_name = district_name[0] + district_name[1] + "0" + district_name[2];
                    } else if (district_name.length == 2){
                        alt_name = district_name[0] + "0" + district_name[1];
                    }


                    if (selected_districts.indexOf(district_name) === -1  && selected_districts.indexOf(alt_name) === -1 ){
                        return "steelblue";
                    }
                    return yellow;
                    //return selected_districts.indexOf(district_name) === -1 ? "Steelblue" : yellow;
                })

        }

            updateHighlighting();

    });


}



