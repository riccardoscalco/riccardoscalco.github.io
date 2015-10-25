graph = window.fixtures[0]

getData = (graph) ->
  nodes = 
  {
    nodes: _.values graph.nodes
    links: _.values graph.edges
  }

getLinks = (graph) ->
  edges = _.values graph.edges
  edges.map (e) -> {"source": e.nodes[0], "target": e.nodes[1]}

viz = document.getElementById('viz')
width = 900
height = 900 / viz.offsetWidth * viz.offsetHeight
m =
  top: 10
  bottom: 10
  right: 10
  left: 10
w = width - m.left - m.right
h = height - m.top - m.bottom

force = d3.layout.force()
    .charge -20
    .gravity 0.3
    .size [width, height]
    .linkStrength 0.9
    .friction 0.5
    .theta 0.8
    .alpha 0.1

rScale = d3.scale.linear()
    .domain [0, 1]
    .range [0, 3]

linkScale = d3.scale.linear()
    .domain [0, 1]
    .range [10, 0]


svg = d3.select "#viz"
  .append "svg"
  .attr
    "viewBox": "0 0 " + width + " " + height
    "preserveAspectRatio": "xMidYMin slice"
    "width": "100%"
  .style
    "padding-bottom": (100 * height / width) + "%"
    "height": "1px"
    "overflow": "visible"
  .append "g"
  .attr "transform", "translate(" + m.left + "," + m.top + ")"

links = getLinks window.fixtures[0]
nodesByName = {}

nodeByName = (name) ->
    nodesByName[name] or nodesByName[name] = {name: name}

links.forEach (link) ->
    link.source = nodeByName link.source 
    link.target = nodeByName link.target
nodes = d3.values nodesByName

console.log nodes.length
console.log links.length


force
    .nodes nodes
    .links links
    .linkDistance (d) ->
      m = graph.edges[d.source.name + '-' + d.target.name].weight.metric
      linkScale m
    .start()

link = svg.selectAll ".link"
    .data links
  .enter().append "line"
    .attr "class", "link"

node = svg.selectAll ".node"
    .data nodes
  .enter().append "circle"
    .attr "class", "node"
    .attr "r", (d) ->
      try
        #rScale graph.nodes[d.name].neighbours.length
        console.log graph.nodes[d.name].type
        if graph.nodes[d.name].type == "topic"
          7
        else
          rScale graph.nodes[d.name].weight.metric
      catch error
        2
    .call force.drag

node.append("title")
    .text (d) -> d.name

force.on "tick", () ->
  link.attr "x1", (d) -> d.source.x
      .attr "y1", (d) -> d.source.y
      .attr "x2", (d) -> d.target.x
      .attr "y2", (d) -> d.target.y

  node.attr "cx", (d) -> d.x
      .attr "cy", (d) -> d.y

#svg.append "circle"
#  .attr
#    "cx": w / 2
#    "cy": h / 2
#    "r": w / 10
#  .style
#    "fill": "limegreen"
  