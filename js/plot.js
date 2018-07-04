// HELPERS
function parseData(d) {
    var keys = _.keys(d[0]);
    return _.map(d, function (d) {
        var o = {};
        _.each(keys, function (k) {
            if (k == 'Participant')
                o[k] = d[k];
            else
                o[k] = parseFloat(d[k]);
        });
        return o;
    });
}

function getBounds(d, paddingFactor) {
    // Find min and maxes (for the scales)
    paddingFactor = typeof paddingFactor !== 'undefined' ? paddingFactor : 1;

    var keys = _.keys(d[0]),
        b = {};
    _.each(keys, function (k) {
        b[k] = {};
        _.each(d, function (d) {
            if (isNaN(d[k]))
                return;
            if (b[k].min === undefined || d[k] < b[k].min)
                b[k].min = d[k];
            if (b[k].max === undefined || d[k] > b[k].max)
                b[k].max = d[k];
        });
        b[k].max > 0 ? b[k].max *= paddingFactor : b[k].max /= paddingFactor;
        b[k].min > 0 ? b[k].min /= paddingFactor : b[k].min *= paddingFactor;
    });
    return b;
}

function getCorrelation(xArray, yArray) {
    function sum(m, v) {
        return m + v;
    }

    function sumSquares(m, v) {
        return m + v * v;
    }

    function filterNaN(m, v, i) {
        isNaN(v) ? null : m.push(i);
        return m;
    }

    // clean the data (because we know that some values are missing)
    var xNaN = _.reduce(xArray, filterNaN, []);
    var yNaN = _.reduce(yArray, filterNaN, []);
    var include = _.intersection(xNaN, yNaN);
    var fX = _.map(include, function (d) {
        return xArray[d];
    });
    var fY = _.map(include, function (d) {
        return yArray[d];
    });

    var sumX = _.reduce(fX, sum, 0);
    var sumY = _.reduce(fY, sum, 0);
    var sumX2 = _.reduce(fX, sumSquares, 0);
    var sumY2 = _.reduce(fY, sumSquares, 0);
    var sumXY = _.reduce(fX, function (m, v, i) {
        return m + v * fY[i];
    }, 0);

    var n = fX.length;
    var ntor = ((sumXY) - (sumX * sumY / n));
    var dtorX = sumX2 - (sumX * sumX / n);
    var dtorY = sumY2 - (sumY * sumY / n);

    var r = ntor / (Math.sqrt(dtorX * dtorY)); // Pearson ( http://www.stat.wmich.edu/s216/book/node122.html )
    var m = ntor / dtorX; // y = mx + b
    var b = (sumY - m * sumX) / n;

    // console.log(r, m, b);
    return {
        r: r,
        m: m,
        b: b
    };
}

//data is an Array of maps.
function loadChart(data) {

    var xAxisOptions = ["Participant",
        "Total points",
        "Total score predict matches",
        "Total winner predict matches",
        "Total predict lost matches",
        "Groupstage matchday1 points",
        "Groupstage matchday1 score predict matches",
        "Groupstage matchday1 winner predict matches",
        "Groupstage matchday1 predict lost matches",
        "Groupstage matchday2 points",
        "Groupstage matchday2 score predict matches",
        "Groupstage matchday2 winner predict matches",
        "Groupstage matchday2 predict lost matches",
        "Groupstage matchday3 points",
        "Groupstage matchday3 score predict matches",
        "Groupstage matchday3 winner predict matches",
        "Groupstage matchday3 predict lost matches",
        "Round16 points",
        "Round16 score predict matches",
        "Round16 winner predict matches",
        "Round16 predict lost matches",
        "Quarter final points",
        "Quarter final score predict matches",
        "Quarter final winner predict matches",
        "Quarter final predict lost matches",
        "Semi final points",
        "Semi final score predict matches",
        "Semi final winner presdict matches",
        "Semi final predict lost matches",
        "Final points",
        "Total number of matches"
    ];
    var descriptions = {
        "Participant": "",
        "Total points": "Total points",
        "Total score predict matches": "",
        "Total winner predict matches": "",
        "Total predict lost matches": "",
        "Groupstage matchday1 points": "",
        "Groupstage matchday1 score predict matches": "",
        "Groupstage matchday1 winner predict matches": "",
        "Groupstage matchday1 predict lost matches": "",
        "Groupstage matchday2 points": "",
        "Groupstage matchday2 score predict matches": "",
        "Groupstage matchday2 winner predict matches": "",
        "Groupstage matchday2 predict lost matches": "",
        "Groupstage matchday3 points": "",
        "Groupstage matchday3 score predict matches": "",
        "Groupstage matchday3 winner predict matches": "",
        "Groupstage matchday3 predict lost matches": "",
        "Round16 points": "",
        "Round16 score predict matches": "",
        "Round16 winner predict matches": "",
        "Round16 predict lost matches": "",
        "Quarter final points": "",
        "Quarter final score predict matches": "",
        "Quarter final winner predict matches": "",
        "Quarter final predict lost matches": "",
        "Semi final points": "",
        "Semi final score predict matches": "",
        "Semi final winner predict matches": "",
        "Semi final predict lost matches": "",
        "Final points": "",
        "Total number of matches": "Total number of matches"
    };

    var keys = _.keys(data[0]);
    var data = parseData(data);
    var bounds = getBounds(data, 1);

    // SVG AND D3 STUFF
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 640);

    svg.append('g')
        .classed('chart', true)
        .attr('transform', 'translate(80, -60)');

    var xAxis = 'Total number of matches',
        yAxis = 'Total points';

    // Build menus
    d3.select('#x-axis-menu')
        .selectAll('li')
        .data(xAxisOptions)
        .enter()
        .append('li')
        .text(function (d) {
            return d;
        })
        .classed('selected', function (d) {
            return d === xAxis;
        })
        .on('click', function (d) {
            xAxis = d;
            updateChart();
            updateMenus();
        });

    // Participant name
    d3.select('svg g.chart')
        .append('text')
        .attr({
            'id': 'participantLabel',
            'x': 0,
            'y': 170
        })
        .style({
            'font-size': '80px',
            'font-weight': 'bold',
            'fill': '#ddd'
        });

    // Best fit line (to appear behind points)
    //d3.select('svg g.chart')
    //    .append('line')
    //    .attr('id', 'bestfit');

    // Axis labels
    d3.select('svg g.chart')
        .append('text')
        .attr({
            'id': 'xLabel',
            'x': 400,
            'y': 670,
            'text-anchor': 'middle'
        })
        .text(descriptions[xAxis]);

    d3.select('svg g.chart')
        .append('text')
        .attr('transform', 'translate(-60, 330)rotate(-90)')
        .attr({
            'id': 'yLabel',
            'text-anchor': 'middle'
        })
        .text(descriptions[yAxis]);

    // Render points
    var xScale, yScale;
    updateScales(bounds, xAxis, yAxis);

    var pointColour = d3.scale.category20b();
    d3.select('svg g.chart')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
        })
        .attr('cy', function (d) {
            return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yScale(d[yAxis]);
        })
        .attr('fill', function (d, i) {
            return pointColour(i);
        })
        .style('cursor', 'pointer')
        .on('mouseover', function (d) {
            d3.select('svg g.chart #participantLabel')
                .text(d.Participant)
                .transition()
                .style('opacity', 1);
        })
        .on('mouseout', function (d) {
            d3.select('svg g.chart #participantLabel')
                .transition()
                .duration(1500)
                .style('opacity', 0);
        });

    updateChart(true);
    updateMenus();

    // Render axes
    d3.select('svg g.chart')
        .append("g")
        .attr('transform', 'translate(0, 630)')
        .attr('id', 'xAxis')
        .call(makeXAxis);

    d3.select('svg g.chart')
        .append("g")
        .attr('id', 'yAxis')
        .attr('transform', 'translate(-10, 0)')
        .call(makeYAxis);


    //// RENDERING FUNCTIONS
    function updateChart(init) {
        updateScales();

        d3.select('svg g.chart')
            .selectAll('circle')
            .transition()
            .duration(500)
            .ease('quad-out')
            .attr('cx', function (d) {
                return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
            })
            .attr('cy', function (d) {
                return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yScale(d[yAxis]);
            })
            .attr('r', function (d) {
                return isNaN(d[xAxis]) || isNaN(d[yAxis]) ? 0 : 12;
            });

        // Also update the axes
        d3.select('#xAxis')
            .transition()
            .call(makeXAxis);

        d3.select('#yAxis')
            .transition()
            .call(makeYAxis);

        // Update axis labels
        d3.select('#xLabel')
            .text(descriptions[xAxis]);
    }

    function updateScales() {
        xScale = d3.scale.linear()
            .domain([bounds[xAxis].min, bounds[xAxis].max])
            .range([20, 780]);

        yScale = d3.scale.linear()
            .domain([bounds[yAxis].min, bounds[yAxis].max])
            .range([600, 100]);
    }

    function makeXAxis(s) {
        s.call(d3.svg.axis()
            .scale(xScale)
            .orient("bottom"));
    }

    function makeYAxis(s) {
        s.call(d3.svg.axis()
            .scale(yScale)
            .orient("left"));
    }

    function updateMenus() {
        d3.select('#x-axis-menu')
            .selectAll('li')
            .classed('selected', function (d) {
                return d === xAxis;
            });
        d3.select('#y-axis-menu')
            .selectAll('li')
            .classed('selected', function (d) {
                return d === yAxis;
            });
    }
}