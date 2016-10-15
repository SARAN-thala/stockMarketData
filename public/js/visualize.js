const DATA = '../data/Price-volume-data-TCSEQN.csv';

const parseQuote = function (quote) {
    quote['Date'] = new Date(quote['Date']);
    quote['Close Price'] = +quote['Close Price'];
    return quote;
};

const WIDTH = 1420;
const HEIGHT = 650;
const MARGIN = 50;

const INNER_WIDTH = WIDTH - (2 * MARGIN);
const INNER_HEIGHT = HEIGHT - (2 * MARGIN);

const loadChart = function (quotes) {

    let svg = d3.select('.container').append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT);

    let dateRange = d3.extent(quotes, quote => (quote['Date']));
    let priceRange = d3.extent(quotes, quote => (quote['Close Price']));

    priceRange[0] -= 5;
    priceRange[1] += 5;

    dateRange[0].setDate(dateRange[0].getDate() - 2);
    dateRange[1].setDate(dateRange[1].getDate() + 2);


    let xScale = d3.scaleTime()
        .domain(dateRange)
        .range([0, INNER_WIDTH]);

    let yScale = d3.scaleLinear()
        .domain(priceRange)
        .range([INNER_HEIGHT, 0]);

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale).ticks(10);

    let g = svg.append('g')
        .attr('transform', `translate(${MARGIN}, ${MARGIN})`);

    svg.append('g')
        .attr('transform', `translate(${MARGIN - 10}, ${HEIGHT - MARGIN})`)
        .call(xAxis)
        .classed('xAxis', true);

    svg.selectAll('.xAxis .tick')
        .append('line')
        .attr('x1', 0.5)
        .attr('y1', 0)
        .attr('x2', 0.5)
        .attr('y2', -INNER_HEIGHT)
        .classed('grid', true);

    svg.append('g')
        .attr('transform', `translate(${MARGIN - 10}, ${MARGIN})`)
        .call(yAxis)
        .classed('yAxis', true);

    svg.selectAll('.yAxis .tick')
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0.5)
        .attr('x2', INNER_WIDTH)
        .attr('y2', 0.5)
        .classed('grid', true);

    //--line--
    // let path = g.append('path');

    let line = d3.line()
        .x(q => (xScale(q['Date'])))
        .y(q => (yScale(q['Close Price'])));

    g.append('path')
        .classed('closed-price', true)
        .attr('d', line(quotes));

    //--circle---
    g.selectAll('circle').data(quotes)
        .enter().append('circle')
        .attr('r', 2)
        .append('title').text(q => (`Date: ${q['Date'].toISOString().split('T')[0]},
Price: ${q['Close Price']}`));

    let circles = g.selectAll('circle');

    circles.attr('cx', q => (xScale(q['Date'])))
        .attr('cy', q => (yScale(q['Close Price'])));

    g.selectAll('circle').exit().remove();
};

d3.csv(DATA, parseQuote, loadChart);