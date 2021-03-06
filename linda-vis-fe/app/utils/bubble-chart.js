import util from "./util";
import exportVis from "./export-visualization";

/* global dimple */
/* global $ */
var bubblechart = function () {
    var seriesHeaders = [];
    var data = [];

    function draw(configuration, visualisationContainerID) {
        console.log("### INITIALIZE VISUALISATION - BUBBLE CHART");

        var container = $('#' + visualisationContainerID);
        container.empty();

        var xAxis = configuration['Horizontal Axis'];
        var yAxis = configuration['Vertical Axis'];
        var size = configuration['Size'];
        var label = configuration['Label'];
        var group = configuration['Groups'];

        if (!(configuration.dataModule && configuration.datasourceLocation && xAxis && yAxis && size && label && group)) {
            return $.Deferred().resolve().promise();
        }

        if (xAxis.length === 0 || yAxis.length === 0 || size.lenght === 0) {
            return $.Deferred().resolve().promise();
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;
        var graph = configuration.datasourceGraph;
        var gridlines = configuration.Gridlines;
        var tooltip = configuration.Tooltip;
        var hLabel = configuration["Horizontal Label"];
        var vLabel = configuration["Vertical Label"];

        var selection = {
            dimension: [],
            multidimension: label.concat(xAxis).concat(yAxis).concat(size).concat(group),
            gridlines: gridlines,
            tooltip: tooltip,
            hLabel: hLabel,
            vLabel: vLabel
        };

        console.log("VISUALIZATION SELECTION FOR BUBBLE CHART:");
        console.dir(selection);

        var svg = dimple.newSvg('#' + visualisationContainerID, container.width(), container.height());

        return dataModule.parse(location, graph, selection).then(function (inputData) {
            console.log("GENERATE INPUT DATA FORMAT FOR BUBBLE CHART - INPUT DATA");
            console.dir(inputData);
            seriesHeaders = inputData[0];
            data = util.createRows(inputData);

            if (label.length === 0) {
                seriesHeaders.splice(0, 0, "Number");
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    row["Number"] = i;
                }
            }

            console.log("GENERATE INPUT DATA FORMAT FOR BUBBLE CHART - OUTPUT DATA");
            console.dir(data);

            var chart = new dimple.chart(svg, data);

            var labelAxisName = seriesHeaders[0];
            var xAxisName = seriesHeaders[1];
            var yAxisName = seriesHeaders[2];

            var sizeAxisName;
            if (size.length > 0) {
                sizeAxisName = seriesHeaders[3];
            }

            var groupAxisName;
            if (group.length > 0) {
                groupAxisName = seriesHeaders[3 + size.length];
            }

            var x = chart.addMeasureAxis("x", xAxisName);
            var y = chart.addMeasureAxis("y", yAxisName);

            if (sizeAxisName) {
                chart.addMeasureAxis("z", sizeAxisName);
            }

            var series = [labelAxisName];

            if (groupAxisName) {
                series.push(groupAxisName);
            }

            console.log("SERIES:");
            console.dir(series);

            chart.addSeries(series, dimple.plot.bubble);
            chart.addLegend("50%", "10%", 500, 20, "right");

            //gridlines tuning
            //x.showGridlines = selection.gridlines;
            //y.showGridlines = selection.gridlines;
            //titles
            if (selection.hLabel ==="" || selection.hLabel ==="Label"){
                selection.hLabel = seriesHeaders[1];
            }
            if (selection.vLabel ==="" || selection.vLabel ==="Label"){
                selection.vLabel = seriesHeaders[2];
            }
            x.title = selection.hLabel;
            y.title = selection.vLabel;
            //ticks
            x.ticks = selection.gridlines;
            y.ticks = selection.gridlines;
            //tooltip
            if (selection.tooltip === false) {
                chart.addSeries(series, dimple.plot.bubble).addEventHandler("mouseover", function () {
                });
            }

            chart.draw();
        });
    }

    function export_as_PNG() {
        return exportVis.export_PNG();
    }

    function export_as_SVG() {
        return exportVis.export_SVG();
    }

    function get_SVG() {
        return exportVis.get_SVG();
    }

    return {
        export_as_PNG: export_as_PNG,
        export_as_SVG: export_as_SVG,
        get_SVG: get_SVG,
        draw: draw
    };
}();

export default bubblechart;
