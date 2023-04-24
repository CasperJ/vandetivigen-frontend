import React, { Component } from 'react';
import * as d3 from "d3";
import { Record } from './Record';

interface ChartState {
}
interface ChartProps {
  records: Record[];
}
class Chart extends Component<ChartProps, ChartState> {
  private data: Record[] = this.props.records.sort((a, b) => a.RecordedOn.getTime() - b.RecordedOn.getTime());

  componentDidMount() {
    this.renderChart();
    window.addEventListener("resize",
      this.renderChart.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener("resize",
      this.renderChart.bind(this));
  }
  renderChart() {
    if (document == null) return;
    const chart = document.getElementById("chart");
    if (chart == null) return;

    const width = chart.clientWidth, height = 400;
    d3.selectAll("#chart > *").remove();

    var svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(0,0)");


    const data = this.data;

    // Add X axis --> it is a date format
    var xDomain = d3.extent(data, function (d) { return d.RecordedOn; }) as [Date, Date];
    var x = d3.scaleTime().domain(xDomain).range([0, width]);

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 35])
      .range([height, 0]);
    // svg.append("g")
    //   .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // Add brushing
    var brush = d3.brushX<Record[]>()                   // Add the brush feature using the d3.brush function
      .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the area variable: where both the area and the brush take place
    var area = svg.append('g')
      .attr("clip-path", "url(#clip)")

    const xAxis = svg.append("g")
      .attr("transform", "translate(0," + (height - 20) + ")")
      .attr("class", "x-axis")
      .style("display", "none")
      .call(d3.axisBottom(x));

    var focus = svg.append('g').style('display', 'none');

    focus.append('circle')
      .attr('id', 'focusCircle')
      .attr('r', 3)
      .attr("fill", "#FFF")
      .attr('class', 'circle focusCircle');

    focus.append('text')
      .attr('id', 'focusTextDeg')
      .attr('font-weight', '300')
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFF');
    focus.append('text')
      .attr('id', 'focusTextTime')
      .attr('font-size', '8px')
      .attr('font-weight', '300')
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFF');

    const resetZoomContainer = svg.append("g")
      .attr("id", "resetZoom")
      .attr("transform", "translate(" + (width - 34) + "," + (height - 40) + ")")
      .attr("width", 24)
      .attr("height", 24)
      .attr("cursor", "pointer")
      .on("click tap", function () { clearZoom.bind(this)(); hideTooltip.bind(this)() });
    resetZoomContainer.append("rect")
      .attr("width", 24)
      .attr("height", 24)
      .attr("fill", "transparent");

    resetZoomContainer.append("path")
      //.attr("stroke", "#253A57")
      .attr("stroke", "#FFF")
      .attr("fill-rule", "evenodd")
      .attr("clip-rule", "evenodd")
      .attr("d", 'M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5zm-4.5 8h9v1h-9v-1z')
      .attr("transform", "translate(0 0)")
      ;



    var bisectDate = d3.bisector<Record, Date>(function (a) { return a.RecordedOn; }).left;
    function showTooltip(this: any) {
      var mousex = d3.mouse(this)[0];
      var invertedx = x.invert(mousex);
      var i = bisectDate(data, invertedx);

      var d0 = data[i - 1]
      var d1 = data[i];

      if (invertedx === undefined || d0 === undefined || d1 === undefined) return;
      // work out which date value is closest to the mouse
      var dx = invertedx.getTime() - d0.RecordedOn.getTime() > d1.RecordedOn.getTime() - invertedx.getTime() ? d1 : d0;
      var cx = x(dx.RecordedOn) as number;
      var cy = y(dx.Temperature) as number;

      focus.style('display', null);
      focus.select('#focusCircle')
        .attr('cx', cx)
        .attr('cy', cy);
      focus.select('#focusTextDeg')
        .attr('x', cx)
        .attr('y', cy - 15)
        .html(`${dx.Temperature}&deg;C`);
      focus.select('#focusTextTime')
        .attr('x', cx)
        .attr('y', cy - 7)
        .html(d3.timeFormat("%_d. %b %Y kl. %H")(dx.RecordedOn));
    }
    function hideTooltip() { focus.style('display', 'none') };
    function clearZoom() {
      x.domain(d3.extent(data, function (d) { return d.RecordedOn; }) as [Date, Date]);
      xAxis.transition().call(d3.axisBottom(x))
      area
        .select('.myArea')
        .datum(data)
        .transition()
        .attr("d", areaGenerator)
    }

    svg
      .on('mouseover', function () { focus.style('display', null); })
      .on('mouseout', hideTooltip)
      .on("mousemove", showTooltip)
      .on("tap", showTooltip)
      .on("dblclick", clearZoom);


    // Create an area generator
    var areaGenerator = d3.area<any>()
      .x(function (d) { return x(d.RecordedOn) as number })
      .y0(y(0) as number)
      .y1(function (d) { return y(d.Temperature) as number }).curve(d3.curveBasis)


    // Add the area
    area.append("path")
      .datum(data)
      .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
      .attr("fill", "#253A57")
      .attr("d", areaGenerator)

    // Add the brushing
    area
      .append("g")
      .datum(data)
      .attr("class", "brush")
      .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout : NodeJS.Timeout | null;
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart() {

      // What are the selected boundaries?
      const extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([4, 8])
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])])
        //area.select(".brush").datum(data).call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        focus.style('display', 'none');
      }

      // Update axis and area position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      area
        .select('.myArea')
        .datum(data)
        .transition()
        .duration(1000)
        .attr("d", areaGenerator)
    }
  }
  render() {
    return (<div id="chart"></div>);
  }



}

export default Chart;
