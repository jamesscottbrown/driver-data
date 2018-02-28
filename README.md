# Driver Data Visualization

This repository contains interactive data visualizations of the [Driving Licence Data](https://data.gov.uk/dataset/driving-licence-data) from ``data.gov.uk``.

[Open the visualizations](https://jamesscottbrown.github.io/driver-data/).

The ``raw_data/`` directory contains the original ``.xlsx`` data file, and a R script that generates several ``.csv`` files from it.

The ``docs/`` directory contains interactive visualizations created using [D3](http://d3js.org/).

The PO district shapefiles were obtained [from Open Door Logistics](http://www.opendoorlogistics.com/downloads/), and converted from ``.shp/.shx`` to [TopoJSON](https://github.com/topojson/topojson) using [mapshaper.org](http://mapshaper.org).
