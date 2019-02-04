/**
 * Template for dot plot for mean age and box plot for median age
 * (the dots are rendered as lines)
 */

import Base_Template from './baseTemplate';
import util from './template-utils';
import color from './colors';
import d3 from '@/assets/d3';

function Template(svg) {
  Base_Template.apply(this, arguments);

  this.padding = { top: 90, left: 240, right: 20, bottom: 1 };
  this.gapX = 80;

  this.width = this.parentWidth() - this.padding.left - this.padding.right;
  this.width1 = (this.width - this.gapX) / 2;
  this.width2 = (this.width - this.gapX) / 2;

  this.x = d3.scaleLinear();
  this.x2 = d3.scaleLinear();

  this.render = function(data, options = {}) {
    if (!this.commonRender(data, options)) return;

    // Find quartiles, mean and median for each geography
    data.data = data.data.map(bydel => {
      if (bydel.low) return bydel;
      let ages = [];
      bydel.values.forEach((val, age) => {
        for (let i = 0; i < val.value; i++) {
          ages.push(age);
        }
      });
      bydel.low = d3.quantile(ages, 0.25);
      bydel.median = d3.quantile(ages, 0.5);
      bydel.high = d3.quantile(ages, 0.75);
      bydel.mean = Math.round(d3.mean(ages) * 100) / 100;

      return bydel;
    });

    this.svg
      .attr('height', this.padding.top + this.height + this.padding.bottom + this.sourceHeight)
      .attr('width', this.width + this.padding.left + this.padding.right);

    this.width1 = (this.width - this.gapX) / 2;
    this.width2 = (this.width - this.gapX) / 2;
    this.x2.range([0, this.width2]).domain([0, 70]);
    this.x2Axis
      .transition()
      .duration(this.duration)
      .call(
        d3
          .axisTop(this.x2)
          .tickFormat(d => `${d} år`)
          .ticks(this.width2 / 60)
      )
      .attr('transform', `translate(${this.width1 + this.gapX})`);

    this.x
      .range([0, this.width1])
      .domain([d3.min(this.data.data.map(d => d.mean)) / 1.05, d3.max(this.data.data.map(d => d.mean)) * 1.05]);
    this.xAxis
      .transition()
      .duration(this.duration)
      .call(
        d3
          .axisTop(this.x)
          .tickFormat(d => `${d} år`)
          .ticks(this.width2 / 60)
      );

    this.canvas
      .select('text.label-median')
      .transition()
      .duration(this.duration)
      .attr('x', this.width1 + this.gapX + this.width2 / 2);
    this.canvas
      .select('text.label-mean')
      .transition()
      .duration(this.duration)
      .attr('x', this.width1 / 2);

    this.drawRows();
    this.drawSource('Statistisk sentralbyrå (test)');
  };

  this.created = function() {
    this.canvas
      .append('text')
      .attr('class', 'label-median')
      .attr('font-size', 13)
      .attr('y', -40)
      .attr('x', this.width1 + this.gapX + this.width2 / 2)
      .attr('text-anchor', 'middle')
      .text('Aldersfordeling og medianalder');

    this.canvas
      .append('text')
      .attr('class', 'label-mean')
      .attr('font-size', 13)
      .attr('y', -40)
      .attr('x', this.width1 / 2)
      .attr('text-anchor', 'middle')
      .text('Gjennomsnittsalder');
  };

  this.initRowElements = function(rowsE) {
    rowsE.attr('transform', (d, i) => `translate(0, ${i * this.rowHeight})`);

    // Row fill
    rowsE
      .append('rect')
      .attr('class', 'rowFill')
      .attr('fill', color.purple)
      .attr('height', this.rowHeight)
      .attr('x', -this.padding.left)
      .attr('width', this.width + this.padding.left + this.padding.right);

    // Row divider
    rowsE
      .append('rect')
      .attr('class', 'divider')
      .attr('fill', color.purple)
      .attr('x', -this.padding.left)
      .attr('width', this.width + this.padding.left + this.padding.right)
      .attr('height', 1)
      .attr('y', this.rowHeight);

    // Row Geography
    rowsE
      .append('text')
      .attr('class', 'geography')
      .attr('fill', color.purple)
      .attr('y', this.rowHeight / 2 + 6)
      .attr('x', -this.padding.left + 10);

    // Box
    rowsE
      .append('rect')
      .attr('class', 'box')
      .attr('fill', color.purple)
      .attr('stroke', color.purple)
      .attr('stroke-width', 1)
      .attr('fill-opacity', 0.2)
      .attr('rx', 2)
      .attr('shape-rendering', 'geometricPrecision')
      .attr('height', this.barHeight)
      .attr('x', d => this.gapX + this.width1 + this.x2(d.low))
      .attr('y', (this.rowHeight - this.barHeight) / 2);

    // Median Age
    rowsE
      .append('text')
      .attr('class', 'median-value')
      .attr('text-anchor', 'start')
      .attr('font-size', 12)
      .attr('font-weight', 700)
      .attr('y', this.rowHeight / 2 + 5);

    // Median stroke
    rowsE
      .append('rect')
      .attr('class', 'median-stroke')
      .attr('fill', color.purple)
      .attr('height', this.rowHeight)
      .attr('width', 3)
      .attr('shape-rendering', 'geometricPrecision')
      .attr('transform', `translate(-1.5, 0)`)
      .attr('y', 0)
      .attr('x', this.gapX + this.width1);

    // Mean Age
    rowsE
      .append('text')
      .attr('class', 'mean-value')
      .attr('text-anchor', 'start')
      .attr('font-size', 12)
      .attr('font-weight', 700)
      .attr('y', this.rowHeight / 2 + 5);

    // Mean Stroke
    rowsE
      .append('rect')
      .attr('class', 'mean-stroke')
      .attr('fill', color.purple)
      .attr('height', this.rowHeight)
      .attr('width', 3)
      .attr('shape-rendering', 'geometricPrecision')
      .attr('transform', `translate(-1.5, 0)`)
      .attr('y', 0);
  };

  this.drawRows = function() {
    let rows = this.canvas.selectAll('g.row').data(this.data.data);
    let rowsE = rows
      .enter()
      .append('g')
      .attr('class', 'row');
    rows.exit().remove();
    rows = rows.merge(rowsE);

    // Create elements on each row that's created on enter
    this.initRowElements(rowsE);

    // Update row geography, style and position
    rows.select('text.geography').attr('font-weight', d => (d.avgRow || d.totalRow ? 700 : 400));
    rows.select('rect.rowFill').attr('fill-opacity', d => (d.avgRow || d.totalRow ? 0.05 : 0));
    rows.select('rect.divider').attr('fill-opacity', d => (d.avgRow || d.totalRow ? 0.5 : 0.2));
    rows
      .transition()
      .duration(this.duration)
      .attr('transform', (d, i) => `translate(0, ${i * this.rowHeight})`);
    rows.select('text.geography').text(d => util.truncate(d.geography, this.padding.left));

    rows
      .select('text.median-value')
      .text(d => d.median)
      .transition()
      .duration(this.duration)
      .attr('x', d => this.gapX + this.width1 + this.x2(d.median) + 6);

    rows
      .select('text.mean-value')
      .text(d => d.mean)
      .transition()
      .duration(this.duration)
      .attr('x', d => this.x(d.mean) + 6);

    rows
      .select('rect.mean-stroke')
      .transition()
      .duration(this.duration)
      .attr('x', d => this.x(d.mean));
    rows
      .select('rect.median-stroke')
      .transition()
      .duration(this.duration)
      .attr('x', d => this.gapX + this.width1 + this.x2(d.median));
    rows
      .select('rect.box')
      .transition()
      .duration(this.duration)
      .attr('x', d => this.gapX + this.width1 + this.x2(d.low))
      .attr('width', d => this.x2(d.high) - this.x2(d.low));

    rows
      .select('rect.rowFill')
      .transition()
      .duration(this.duration)
      .attr('width', this.width + this.padding.left + this.padding.right);
    rows
      .select('rect.divider')
      .transition()
      .duration(this.duration)
      .attr('width', this.width + this.padding.left + this.padding.right);
  };

  this.init(svg);
}

export default Template;