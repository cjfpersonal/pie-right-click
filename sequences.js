// Dimensions of sunburst.
var width = 600;
var height = 600;
var radius = 187; // 图的整体半径
var contentRadius = 50; // 内部空白半径
var outsideRadius = 100;
var size = 1

const visitSequences = [
  ["全路径-作为起点", size],
  ["全路径-作为终点", size],
  ["最短路径-作为起点", size],
  ["最短路径-作为终点", size],
  ["实体展开", size*2],
  ["图内路径", size*2],
  ["折叠", size*2],
  ["锁定", size*2],
  ["隐藏", size*2]
];
// Mapping of step names to colors.
var colors = "#E96161";

var vis = d3
  .select("#chart")
  .append("svg:svg")
  .attr("width", width)
  .attr("height", height)
  .append("svg:g")
  .attr("id", "container")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.partition().size([2 * Math.PI, radius * radius]);

var getPie = function(dep) {
	var arc = d3
  .arc()
  .startAngle(function(d) {
    return d.x0;
  })
  .endAngle(function(d) {
    return d.x1;
  })
  .innerRadius(function(d) {
		// if(d.depth !== dep) return;
		if(d.depth) {
			return contentRadius + outsideRadius * (d.depth - 1)
		} else {
			return contentRadius
		}
		// return d.depth === dep && contentRadius
  })
  .outerRadius(function(d) {
		// if(d.depth !== dep) return;
		return contentRadius + outsideRadius * (d.depth)
		// return d.depth === dep && (contentRadius + outsideRadius)
	});
	return arc
}

	
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
    .attr("id", (d, i) => {
      return "path" + i;
    })
    .attr("d", getPie(1))
    .style("fill", colors)
    .style("opacity", 0.3)
    .on("mouseover", mouseover);

		//文字展示
  vis
		.data([json])
		.selectAll('g')
    .data(nodes)
    .enter()
		.append('text')
		.style('fill', 'blue')
		.attr("font-size", 12)
		.attr("transform", 'translate(' +0+ ',' + 0 + ')')

		.append("textPath")
		// .attr('startOffset', '10%')
    .attr("href", function(d, i) {
      return "#path" + i;
    })
    .text(function(d, i) {
			if(!i) return ''
      return d.data.name;
		})
}

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {
	var sequenceArray;
	// for depth 2 operation
	if(d.depth > 1) {
		var parent = d.ancestors().reverse()
		parent.shift()
		sequenceArray = parent[0].descendants()
	} else {
		sequenceArray = d.descendants().reverse();
	}
	console.log(d, sequenceArray)
	d3.selectAll("path")
	.style("opacity", 0.3)
	.attr('display', (node) => {
		if(node.depth > 1 && sequenceArray.indexOf(node) < 0) {
			return 'none'
		}
	});

  vis
		.selectAll("path")
    .filter(function(node) {
      return sequenceArray.indexOf(node) >= 0;
		})
		.attr('display', null)
    .style('opacity', (node) => {
			if(node.depth < d.depth
				|| [d].indexOf(node) > -1) {
				return 0.7
			} else {
				return 0.3
			}
		});
}

function buildHierarchy(csv) {
  var root = { name: "root", children: [] };
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) {
      // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
        var foundChild = false;
        for (var k = 0; k < children.length; k++) {
          if (children[k]["name"] == nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = { name: nodeName, children: [] };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = { name: nodeName, size: size };
        children.push(childNode);
      }
    }
  }
  return root;
}

var json = buildHierarchy(visitSequences);
createVisualization(json);
