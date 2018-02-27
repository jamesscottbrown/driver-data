        function drawLicenseAgePlot(divName) {


            d3.csv("../data/licence-age.csv", function (data) {

                var margin = {top: 20, right: 15, bottom: 60, left: 60}
                    , width = 960 - margin.left - margin.right
                    , height = 500 - margin.top - margin.bottom;

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
                main.append("line")
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
                main.append("line")
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
                        .attr("d", line);

                    // Points
                    g.selectAll("scatter-dots")
                        .data(data)
                        .enter().append("svg:circle")
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
                        .style("opacity", provisional ? "0.5" : "1.0");

                    /*
                     .style("stroke", color)
                 .style("fill", function (d) {
                     return provisional ?  "none" : color
                 });
                 */


                }
            })


        }