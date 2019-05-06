// Dimensions of sunburst.
var width = 600;
var height = 600;
var radius = 187; // 图的整体半径
var contentRadius = 50; // 内部空白半径
var outsideRadius = 100;

// Mapping of step names to colors.
var colors = "#5C6273";

var vis = d3
  .select("#chart")
  .append("svg:svg")
  .attr("width", width)
  .attr("height", height)
  .append("svg:g")
  .attr("id", "container")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.partition().size([2 * Math.PI, radius * radius]);

var arc = d3
  .arc()
  .startAngle(function(d) {
    return d.x0;
	})
	.padAngle(.01)
  .endAngle(function(d) {
    return d.x1;
	})
  .innerRadius(function(d) {
    if (d.depth) {
      return contentRadius + outsideRadius * (d.depth - 1);
    } else {
      return contentRadius;
    }
	})
  .outerRadius(function(d) {
    return contentRadius + outsideRadius * d.depth;
  });

// 画图
function createVisualization(json) {
  var root = d3
    .hierarchy(json)
    .sum(function(d) {
      return d.size;
    })
    .sort(function(a, b) {
      return b.value - a.value;
    });

  var nodes = partition(root)
    .descendants()
    .filter(function(d) {
      return d.x1 - d.x0 > 0.005;
    });

  vis
    .data([json])
    .selectAll("path")
    .data(nodes)
    .enter()

    .append("svg:path")
    .attr("display", function(d) {
      return d.depth == 1 ? null : "none";
		})
		
    .attr("d", arc)
    .style("fill", colors)
    .style("opacity", 0.3)
    .on("mouseover", mouseover)
    .on("mousedown", mouseDown);
}

// 画文字
function createFontLogo(json) {
  var root = d3
    .hierarchy(json)
    .sum(function(d) {
      return d.size;
    })
    .sort(function(a, b) {
      return b.value - a.value;
    });

  var nodes = partition(root)
    .descendants()
    .filter(function(d) {
      return d.x1 - d.x0 > 0.005;
		});
		
  // 增加g包住circle和text
  vis
    .data([json])
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
		.attr("class",'node')
		.attr("display", function(d) {
      return d.depth == 1 ? null : "none";
		})
		.attr("transform",function(d){
			return "translate(" + arc.centroid(d) + ")"
		})
		.on("mousedown", mouseDown)
		.append("image")
		.attr('x', -20)
		.attr('y', -(outsideRadius)/4)
    .attr("href", function(d, i) {
      if (!i) return "";
      return "./d3.svg"
    });

  vis
    .selectAll("g")
    .append("text")
    .attr("font-size", 12)
		.attr("text-anchor", "middle")
		.attr('fill', '#fff')
		.attr('y', outsideRadius/4)
    .append("tspan")
    .text(function(d, i) {
      if (!i) return "";
      return d.data.name;
    });
}
// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {
	var sequenceArray;
	var sequenceParent = [];
  // for depth 2 operation
  if (d.depth > 1) {
		sequenceParent = d.ancestors().reverse();
    var parent = d.ancestors().reverse();
    parent.shift();
    sequenceArray = parent[0].descendants();
  } else {
    sequenceArray = d.descendants().reverse();
	}
	// 文字和logo对应的g是否展示
	d3.
	selectAll('.node')
	.attr('display', (node) => {
		sequenceArray.forEach((value) => {
			if(node.depth > 1 && value.data.key !== node.data.key) {
				return 'none'
			} else {
				return 'null'
			}
		})
	})
	
	// 背景隐藏、以及颜色加深
  d3.selectAll("path")
    .style("opacity", 0.3)
    .attr("display", node => {
      if (node.depth > 1 && sequenceArray.indexOf(node) < 0) {
        return "none";
      }
		});
		
  vis
    .selectAll("path")
    .filter(function(node) {
      return sequenceArray.indexOf(node) >= 0;
    })
    .attr("display", null)
    .style("opacity", node => {
			if ((node.depth < d.depth && sequenceParent.indexOf(node) >= 0) || 
			[d].indexOf(node) > -1) {
        return 0.7;
      } else {
        return 0.3;
      }
    });
}

// 触发点击事件
function mouseDown(d) {
	console.log(d.data)
  alert(d.data.name);
}

createVisualization(json);
createFontLogo(json);
