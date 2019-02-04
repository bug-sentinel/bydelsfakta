/**
 * Template for multi series multi-line chart.
 *
 * A details box appears when rendered with highlight parameter
 * defined in the options object.
 *
 * Change tabs by rendering with the series parameter defined
 * in the options object.
 */

import Base_Template from './baseTemplate';
import util from './template-utils';
import color from './colors';
import d3 from '@/assets/d3';
import positionLabels from '../positionLabels';

function Template(svg) {
  Base_Template.apply(this, arguments);

  this.padding = { top: 130, left: 60, right: 220, bottom: 10 };

  // Line generator
  let line = d3
    .line()
    .x(d => this.x(this.parseDate(d.date)))
    .y(d => this.y(d[this.method]));

  this.render = function(data, options = {}) {
    if (!this.commonRender(data, options)) return;

    this.data.data = this.data.data.sort((a, b) => {
      return (
        b.values[this.series][b.values[this.series].length - 1].value -
        a.values[this.series][a.values[this.series].length - 1].value
      );
    });

    this.heading.attr('y', 90).text(this.data.meta.heading[this.series]);
    this.height = 400;
    this.svg
      .transition()
      .duration(this.duration)
      .attr('height', this.padding.top + this.height + this.padding.bottom + this.sourceHeight)
      .attr('width', this.padding.left + this.width + this.padding.right);

    this.canvas
      .select('rect.bg')
      .attr('height', this.height)
      .attr('width', this.width)
      .on('click keyup', (d, i, j) => {
        if (d3.event && d3.event.type === 'click') j[i].blur();
        if (d3.event && d3.event.type === 'keyup' && d3.event.key !== 'Enter') return;
        this.render(this.data, { method: this.method, series: this.series, highlight: -1 });
      })
      .attr('tabindex', 0);

    this.setScales();
    this.drawAxis();
    this.drawLines();
    this.drawTabs();
    this.drawLabels();
    this.drawInfobox();
    this.drawSource('Statistisk sentralbyrå (test)');
  };

  // Creates elements for this template. Runs from base template along with init()
  this.created = function() {
    // Create tabs placeholder
    this.tabs = this.svg
      .insert('g')
      .attr('class', 'tabs')
      .attr('transform', 'translate(3, 23)');

    // stroke below tabs
    this.tabs.append('rect').attr('class', 'rule');

    // Background element allowing users to click to reset
    this.canvas
      .insert('rect')
      .attr('class', 'bg')
      .attr('fill', 'white');

    // Call method for creating info box elements
    this.createInfoBoxElements();
  };

  // Creates info box elements called from created()
  this.createInfoBoxElements = function() {
    // Create infobox placeholder
    this.infobox = this.svg.append('g').attr('class', 'infobox');
    this.infoboxBody = this.infobox.append('g').attr('class', 'infobox__body');
    this.infoboxBody.append('rect').attr('class', 'background');
    this.infoboxHead = this.infobox.append('g').attr('class', 'infobox__head');
    this.infoboxHead.append('rect').attr('class', 'background');
    this.infoboxTitle = this.infoboxHead.append('text');
    this.infoboxContent = this.infoboxBody.append('g').attr('class', 'infobox__content');
    this.infoboxHeading = this.infoboxContent.append('text').attr('class', 'infobox__heading');
    this.infoboxContent.append('rect').attr('class', 'infobox__rule');
    this.infoboxTable = this.infoboxContent.append('g').attr('class', 'infobox__table');
  };

  // Updtes the data in infobox
  this.drawInfobox = function() {
    if (this.highlight === -1) {
      this.infobox.attr('opacity', 0).style('display', 'none');
      return;
    }

    let year = d3.timeFormat('%Y');
    let data = this.data.data[this.highlight].values.filter((d, i) => i === this.series)[0];
    let geography = this.data.data[this.highlight].geography;
    let high = this.data.data.reduce((prev, curr) => (prev.value > curr.value ? prev : curr));
    let low = this.data.data.reduce((prev, curr) => (prev.value < curr.value ? prev : curr));

    this.infobox
      .attr('transform', `translate(${this.padding.left + this.width}, ${this.padding.top})`)
      .style('display', 'block')
      .transition()
      .duration(this.duration)
      .attr('opacity', 1);

    this.infoboxHead
      .select('rect.background')
      .attr('height', 30)
      .attr('width', this.padding.right - 22)
      .attr('x', 11)
      .attr('fill', color.purple);
    this.infoboxTitle
      .attr('y', 20)
      .attr('x', 21)
      .attr('font-size', 14)
      .attr('font-weight', 700)
      .text(util.truncate(geography, this.padding.right - 55, 14, 700))
      .attr('fill', color.blue);

    this.infoboxBody
      .select('rect.background')
      .attr('height', this.height - 40)
      .attr('y', 20)
      .attr('x', 4)
      .attr('width', this.padding.right - 8)
      .attr('fill', color.light_yellow)
      .attr('stroke', color.purple);

    this.infoboxContent.attr('transform', 'translate(20, 60)');
    this.infoboxHeading
      .attr('font-size', 12)
      .attr('font-weight', 700)
      .attr('text-transform', 'uppercase')
      .attr('fill', color.purple)
      .text(
        util
          .truncate(
            `${this.data.meta.series[this.series].heading} (${this.data.meta.series[this.series].subheading})`,
            this.padding.right - 90,
            12,
            700
          )
          .toUpperCase()
      );

    this.infoboxTable.selectAll('*').remove();

    this.infoboxTable
      .append('text')
      .attr('y', 50)
      .text('Utvikling');
    this.infoboxTable
      .append('text')
      .attr('y', 75)
      .text('Utvikling (p.p.)');
    this.infoboxTable
      .append('text')
      .attr('y', 100)
      .text(`Høyest (${year(this.parseDate(high.date))})`);
    this.infoboxTable
      .append('text')
      .attr('y', 125)
      .text(`Lavest (${year(this.parseDate(low.date))})`);

    this.infoboxTable
      .append('text')
      .attr('font-weight', 700)
      .attr('y', 50)
      .attr('x', this.padding.right - 40)
      .attr('text-anchor', 'end')
      .text(Math.round(((data[data.length - 1].value - data[0].value) / data[0].value) * 100) + '%');

    this.infoboxTable
      .append('text')
      .attr('font-weight', 700)
      .attr('y', 75)
      .attr('x', this.padding.right - 40)
      .attr('text-anchor', 'end')
      .text(Math.round((data[data.length - 1].ratio - data[0].ratio) * 10000) / 100);
    this.infoboxTable
      .append('text')
      .attr('font-weight', 700)
      .attr('y', 100)
      .attr('x', this.padding.right - 40)
      .attr('text-anchor', 'end')
      .text(Math.round(high.ratio * 10000) / 100 + '%');
    this.infoboxTable
      .append('text')
      .attr('font-weight', 700)
      .attr('y', 125)
      .attr('x', this.padding.right - 40)
      .attr('text-anchor', 'end')
      .text(Math.round(low.ratio * 10000) / 100 + '%');
  };

  // Highlights labels and lines on hover
  this.handleMouseover = function(index) {
    this.canvas
      .selectAll('g.label')
      .transition()
      .attr('opacity', 0.5);

    d3.selectAll('g.label')
      .select('text')
      .attr('font-weight', 400);

    d3.selectAll('g.label')
      .filter((d, i) => i === index)
      .transition()
      .attr('opacity', 1)
      .select('text')
      .attr('font-weight', 700);

    this.canvas
      .selectAll('path.row')
      .transition()
      .attr('stroke-opacity', 0.05)
      .attr('stroke-width', 2)
      .filter((d, i) => i == index)
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 4);
  };

  // Resets the hover state
  this.handleMouseleave = function() {
    this.canvas
      .selectAll('g.label')
      .transition()
      .attr('opacity', d => {
        if (d.avgRow || d.totalRow) return 1;
        return 0.45;
      });

    this.canvas
      .selectAll('g.label')
      .select('text')
      .attr('font-weight', d => {
        if (d.avgRow || d.totalRow) return 700;
        return 400;
      });

    this.canvas
      .selectAll('path.row')
      .transition()
      .attr('stroke-width', d => {
        if (d.avgRow) return 5;
        return 2;
      })
      .attr('stroke-opacity', (d, i) => {
        if (d.totalRow || d.avgRow) return 1;
        return 0.1;
      });
  };

  // Updates the tabs. Highlights the active series
  this.drawTabs = function() {
    this.tabs
      .select('rect.rule')
      .attr('height', 1)
      .attr('width', this.width + this.padding.left + this.padding.right)
      .attr('fill', color.purple)
      .attr('opacity', 0.2)
      .attr('y', 40);

    let tab = this.tabs.selectAll('g.tab').data(this.data.meta.series);
    let tabE = tab
      .enter()
      .append('g')
      .attr('class', 'tab');

    tabE
      .append('rect')
      .attr('class', 'bar')
      .attr('height', 4)
      .attr('width', this.tabWidth)
      .attr('y', 37)
      .attr('fill', color.blue);

    tabE
      .append('text')
      .attr('class', 'heading')
      .attr('font-size', 16)
      .attr('y', 5);
    tabE
      .append('text')
      .attr('class', 'subHeading')
      .attr('font-size', 12)
      .attr('y', 20);

    tabE
      .append('rect')
      .attr('class', 'tabOverlay')
      .attr('width', this.tabWidth)
      .attr('height', 60)
      .attr('opacity', 0)
      .attr('y', -20);

    tab.exit().remove();
    tab = tab.merge(tabE);

    tab.attr('transform', (d, i) => `translate(${i * (this.tabWidth + this.tabGap)}, 0)`);

    tab
      .select('text.heading')
      .attr('font-weight', (d, i) => (this.series === i ? '500' : '400'))
      .text(d => d.heading);
    tab
      .select('text.subHeading')
      .attr('font-weight', (d, i) => (this.series === i ? '500' : '400'))
      .text(d => d.subheading);

    tab
      .select('rect.tabOverlay')
      .on('click keyup', (d, i) => {
        if (d3.event && d3.event.type === 'keyup' && d3.event.key !== 'Enter') return;
        this.render(this.data, { method: this.method, series: i });
      })
      .attr('tabindex', 0);

    tab.select('rect.bar').attr('opacity', (d, i) => (this.series === i ? 1 : 0));
  };

  // Updates the labels
  this.drawLabels = function() {
    // Get y-position for each label calculated using
    // simple collision detection algorithm. Passing in
    // the original y-position and the available height in pixels
    let labelPositions = positionLabels(
      this.data.data.map(row => {
        row.y = this.y(row.values[this.series][row.values[this.series].length - 1].value);
        return row;
      }),
      this.height
    );

    let labels = this.canvas
      .selectAll('g.label')
      .data(labelPositions, d => d.geography)
      .join(enter => {
        let g = enter
          .append('g')
          .attr('class', 'label')
          .style('cursor', 'pointer');
        g.append('text').attr('x', this.width + 35);
        g.append('line')
          .attr('stroke-width', 9)
          .attr('x1', this.width + 22)
          .attr('x2', this.width + 31);
        g.append('title');
      })
      .attr('class', 'label');

    // Click label to render with highlight (infobox)
    labels
      .on('click keyup', (d, i, j) => {
        if (d3.event && d3.event.type === 'click') j[i].blur();
        if (d3.event && d3.event.type === 'keyup' && d3.event.key !== 'Enter') return;
        if (i === this.highlight) {
          this.render(this.data, {
            method: this.method,
            series: this.series,
            highlight: -1,
          });
        } else {
          this.render(this.data, {
            method: this.method,
            series: this.series,
            highlight: i,
          });
        }
      })
      .attr('tabindex', 0);

    // Style the color swatch for each label
    labels
      .select('line')
      .transition()
      .duration(this.duration)
      .attr('stroke', (d, i, j) => {
        if (d.totalRow) return 'black';
        if (d.avgRow) return color.purple;
        return d3.interpolateRainbow(i / j.length);
      })
      .style('stroke-dasharray', (d, i) => {
        if (d.totalRow) return '2,1';
      });

    // Style the text label element
    labels
      .select('text')
      .transition()
      .duration(this.duration)
      .text(d => util.truncate(d.geography, this.padding.right - 40))
      .attr('x', this.width + 35)
      .attr('y', 5)
      .attr('font-weight', d => {
        if (d.avgRow || d.totalRow) return 700;
        return 400;
      });

    // Style each label group (text and color swatch)
    labels
      .transition()
      .duration(this.duration)
      .attr('transform', (d, i) => `translate(0, ${labelPositions[i].start})`)
      .attr('opacity', d => {
        if (d.avgRow || d.totalRow) return 1;
        return 0.45;
      });

    // Call the handleMouseover method on mouseover
    labels.on('mouseover', (d, i) => {
      if (this.highlight === -1) {
        this.handleMouseover(i);
      }
    });

    // Call the handleMouseleave on mouseleave
    labels.on('mouseleave', (d, i, j) => {
      if (this.highlight === -1) {
        this.handleMouseleave();
      }
    });

    // Update content in the <title> element
    labels.select('title').html(d => d.geography);
  };

  this.drawLines = function() {
    let row = this.canvas
      .selectAll('path.row')
      .data(this.data.data, d => d.geography)
      .join('path')
      .attr('class', 'row');

    row
      .attr('stroke', (d, i, j) => {
        if (d.totalRow) return 'black';
        if (d.avgRow) return color.purple;
        return d3.interpolateRainbow(i / j.length);
      })
      .attr('stroke-width', (d, i) => {
        if (this.highlight === i) return 5;
        if (d.avgRow) return 5;
        return 2;
      })
      .attr('fill', 'none')
      .transition()
      .duration(this.duration)
      .attr('d', d => line(d.values[this.series]))
      .attr('stroke-opacity', (d, i) => {
        if (this.highlight >= 0 && this.highlight !== i) return 0.1;
        if (this.highlight >= 0 && this.highlight === i) return 1;
        if (d.totalRow || d.avgRow) return 1;
        return 0.1;
      })
      .style('stroke-dasharray', (d, i) => {
        if (d.totalRow) return '4,3';
      });

    row
      .on('mouseover', (d, i) => {
        if (this.highlight === -1) {
          this.handleMouseover(i);
        }
      })
      .on('mouseleave', () => {
        if (this.highlight === -1) {
          this.handleMouseleave();
        }
      });

    // Support click and to trigger a render() with a highlight argument
    row.on('click', (d, i, j) => {
      if (i === this.highlight) {
        this.render(this.data, {
          method: this.method,
          series: this.series,
          highlight: -1,
        });
      } else {
        this.render(this.data, {
          method: this.method,
          series: this.series,
          highlight: i,
        });
      }
    });
  };

  this.setScales = function() {
    this.y.max = d3.max(this.data.data.map(row => d3.max(row.values[this.series].map(d => d[this.method])))) * 1.05;
    this.y.min = d3.min(this.data.data.map(row => d3.min(row.values[this.series].map(d => d[this.method])))) / 1.05;

    this.x = d3
      .scaleTime()
      .domain([
        this.parseDate(this.data.data[0].values[0][0].date),
        this.parseDate(this.data.data[0].values[this.series][this.data.data[0].values[this.series].length - 1].date),
      ])
      .range([0, this.width]);

    this.y = d3
      .scaleLinear()
      .domain([this.y.min, this.y.max])
      .range([this.height, 0]);
  };

  this.drawAxis = function() {
    this.yAxis
      .transition()
      .duration(this.duration)
      .call(d3.axisLeft(this.y).ticks(this.height / 30));
    this.xAxis
      .attr('transform', `translate(0, ${this.height})`)
      .transition()
      .duration(this.duration)
      .call(d3.axisBottom(this.x).ticks(this.width / 110));
  };

  this.init(svg);
}

export default Template;