function drawLicenseAgePlot(divName) {


    d3.csv("../data/licence-age.csv", function (data) {

        var margin = {top: 20, right: 15, bottom: 60, left: 60}
            , width = 960 - margin.left - margin.right
            , height = 500 - margin.top - margin.bottom;

        var provisionalOpacity = 0.5;

        var x = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return parseFloat(d.age);
            })])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) {
                return parseFloat(d.full_total)
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
            .text("Age");

        main.append("g")
            .call(d3.axisLeft(y))
            .attr('class', 'main axis date')
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Number of licence holders");

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        addLine("provisional_male", blue, "men");
        addLine("provisional_female", pink, "women");
        addLine("provisional_total", black, "people");
        addLine("full_male", blue, "men");
        addLine("full_female", pink, "women");
        addLine("full_total", black, "people");

        // 70 year old annotation
       var line_70 =  main.append("line")
            .attr("x1", x(70))
            .attr("x2", x(70))
            .attr("y1", y(0))
            .attr("y2", y.range()[1])
            .style("stroke-dasharray", "5,5")
            .style("stroke", "black");

        main.append("text")
            .attr("x", x(71))
            .attr("y", y(800000))
            .text("License renewal required every 3 years");

        /*
        main.append("line")
            .attr("x1", x(15))
            .attr("x2", x(15))
            .attr("y1", y(0))
            .attr("y2", y.range()[1])
            .style("stroke-dasharray", "5,5")
            .style("stroke", "black");

        main.append("text")
            .attr("x", x(0))
            .attr("y", y(800000))
            .text("Moped provisional license available");
*/

        // 17 year old annotation
        var line_17 = main.append("line")
            .attr("x1", x(17))
            .attr("x2", x(17))
            .attr("y1", y(0))
            .attr("y2", y.range()[1])
            .style("stroke-dasharray", "5,5")
            .style("stroke", "black");

        main.append("text")
            .attr("x", x(18))
            .attr("y", y(800000))
            .text("Eligible for provisional car license");


        // Scale
        var legend_data = [
            {color: black, label: "Total full licenses", opacity: 1, field_name: "full_total"},
            {color: blue, label: "Male full licenses", opacity: 1, field_name: "full_male"},
            {color: pink, label: "Female full licenses", opacity: 1, field_name: "full_female"},
            {color: black, label: "Total provisional licenses", opacity: provisionalOpacity, field_name: "provisional_total"},
            {color: blue, label: "Male provisional licenses", opacity: provisionalOpacity, field_name: "provisional_male"},
            {color: pink, label: "Female provisional licenses", opacity: provisionalOpacity, field_name: "provisional_female" }];

        var legend = main.append("g").attr("id", "legend");
        legend.selectAll("circle").data(legend_data)
            .enter()
            .append("circle")
            .attr("cx", x(90))
            .attr("cy", function (d, i) {
                return y(600000) + 20 * i
            })
            .attr("r", 4)
            .style("opacity", function (d) {
                return d.opacity;
            })
            .style("fill", function (d) {
                return d.color
            })
            .on("mouseover", function (d) {
                selectLine(d.field_name);
            })
            .on("mouseout", function (d) {
                deselectLine(d.field_name);
            });


        legend.selectAll("text").data(legend_data)
            .enter()
            .append("text")
            .attr("x", x(92))
            .attr("y", function (d, i) {
                return y(600000) + 20 * i + 2
            })
            .text(function (d) {
                return d.label
            })
            .on("mouseover", function (d) {
                selectLine(d.field_name);
            })
            .on("mouseout", function (d) {
                deselectLine(d.field_name);
            });


        function selectLine(field_name) {
            d3.select("#line_" + field_name)
                .style("stroke", yellow)
                .style("stroke-width", "3px")
        }

        function deselectLine(field_name) {
            d3.select("#line_" + field_name)
                .style("stroke", "grey")
                .style("stroke-width", "1px")
        }


        function addLine(field_name, color, sex) {

            var provisional = field_name.startsWith("provisional");

            var g = main.append("svg:g");

            // Line
            var line = d3.line()
                .x(function (d) {
                    return x(d.age);
                })
                .y(function (d) {
                    return y(d[field_name]);
                });

            g.append("path")
                .style("fill", "none")
                .style("stroke", color)
                .attr("stroke-width", 1.5)

                .datum(data)
                .attr("d", line)
                .attr("id", function (d) {
                    return "line_" + field_name
                });

            // Points
            g.selectAll("scatter-dots")
                .data(data)
                .enter().append("svg:circle")
                .attr("class", "scatter-dots")
                .attr("cx", function (d) {
                    return x(parseFloat(d.age));
                })
                .attr("cy", function (d) {
                    return y(parseFloat(d[field_name]));
                })
                .attr("r", 4)
                .on("mouseover", function (d) {

                    d3.select(this).style("fill", yellow);

                    div.transition()
                        .duration(200)
                        .style("opacity", .9);

                    var type = provisional ? "provisional" : " full";
                    div.html(d[field_name] + " " + d.age + " year old <b>" + sex + "</b> have a <b> " + type + "  license</b>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    d3.select(this).style("fill", color);

                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .style("fill", color)
                .style("opacity", provisional ? provisionalOpacity : "1.0");

            /*
             .style("stroke", color)
         .style("fill", function (d) {
             return provisional ?  "none" : color
         });
         */


        }

        d3.select("#age-17").on("mouseover", function () {
            line_17.style("stroke", yellow).style("stroke-width", "3px");
        }).on("mouseout", function () {
            line_17.style("stroke", black).style("stroke-width", "1px")
        });

        d3.select("#age-70").on("mouseover", function () {
            line_70.style("stroke", yellow).style("stroke-width", "3px");
        }).on("mouseout", function () {
            line_70.style("stroke", black).style("stroke-width", "1px")
        })

    });

}