function drawPointsMap(divName) {


    d3.csv("data//points-districts.csv", function (data) {

        var proportions = [];
        for (var i = 0; i < data.length; i++) {
            proportions[data[i].district] = parseFloat(data[i].proportion_with_points);
        }

        function getProportion(district_name) {
            if (proportions[district_name]) {
                return proportions[district_name];
            } else if (district_name.length === 3) {
                district_name = district_name[0] + district_name[1] + "0" + district_name[2];
            } else if (district_name.length === 2) {
                district_name = district_name[0] + "0" + district_name[1];
            }

            if (proportions[district_name]) {
                return proportions[district_name];
            }
        }


        var colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain([0, 0.25]);


        var sf = 1;
        var width = 960 / sf,
            height = 1160 / sf;

        var projection = d3.geoAlbers()
            .center([0, 55.4])
            .rotate([4.4, 0])
            .parallels([50, 60])
            .scale(1200 * 5 / sf)
            .translate([width / 2, height / 2]);

        var path = d3.geoPath()
            .projection(projection);

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        function getColor(d) {
            return colorScale((getProportion(d.properties.name)));
        }

        var districts;
        d3.json("data//Districts.json", function (error, uk) {

            districts = svg.selectAll(".subunit")
                .data(topojson.feature(uk, uk.objects['Districts']).features)
                .enter().append("path")
                .attr("class", "feature")
                .attr("d", path)
                .style("stroke-width", "0px")
                .style("fill", function (d) {
                    return getColor(d);
                })
                .on("mouseover", function (d) {

                    d3.select(this).style("fill", yellow);

                    div.transition()
                        .duration(200)
                        .style("opacity", .9);

                    var percentage = to2dp(getProportion(d.properties.name) * 100);
                    div.html("In " + d.properties.name + ", " + percentage + "% of people have one or more points")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    d3.select(this).style("fill", getColor(d));

                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
            ;
        });

        d3.selectAll(".district")
            .on("mouseover", function (d) {
                var district_name = this.innerHTML;
                var alt_name = district_name;

                if (district_name.length === 3) {
                    alt_name = district_name[0] + district_name[1] + "0" + district_name[2];
                } else if (district_name.length === 2) {
                    alt_name = district_name[0] + "0" + district_name[1];
                }

                console.log("LOOKING")
                districts.style("fill", function (d2) {
                    if (d2.properties.name === district_name || d2.properties.name === alt_name) {
                        console.log("FOUND")
                        return yellow;
                    } else {
                        return "grey";
                    }
                });


            })
            .on("mousout", function (d) {
                districts.style("fill", function (d) {
                    return getColor(d);
                });
            })


    })


}

