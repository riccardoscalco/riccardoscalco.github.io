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
    .charge -300
    .chargeDistance 1
    .gravity 0
    .size [width, height]
    .linkStrength 0.1
    .friction 0.01
    .theta 0.8
    .alpha 0.1

rScale = d3.scale.linear()
    .domain [0, 1]
    .range [0.1, 3]

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
    .attr "class", (d) ->
      try
        t = graph.nodes[d.name].topics
        "node q" + t[0].split(" ")[1]
      catch error
        "node"
    #.attr "class", "node"
    .attr "r", (d) ->
      try
        #rScale graph.nodes[d.name].neighbours.length
        if graph.nodes[d.name].type == "topic"
          0
        else
          rScale graph.nodes[d.name].weight.metric
      catch error
        2
    .call force.drag

node.append("title")
    .text (d) -> d.name

epsilon = (h) ->
  h / 20 * Math.random()

interGaussian = (x, y) ->
  dx = width / 2
  dy = height / 2
  alpha = 25000
  sigma = Math.sqrt 90000
  mu = dx
  g = alpha * 1 / sigma * Math.exp( - ((x - mu)**2) / (2 * sigma**2) )
  Math.min(dy + g, Math.max(dy - g, y))

dd = height / 3

force.on "tick", () ->

  node
      .attr "cx", (d) -> d.x = Math.max(0, Math.min(width, d.x))
      #.attr "cy", (d) -> d.y = interGaussian d.x, d.y
      .attr "cy", (d) -> d.y = Math.max(dd, Math.min(height - dd, d.y))
      #.attr "cx", (d) -> d.x
      #.attr "cy", (d) -> d.y


  link
      .attr "x1", (d) -> d.source.x
      .attr "y1", (d) -> d.source.y
      .attr "x2", (d) -> d.target.x
      .attr "y2", (d) -> d.target.y


#svg.append "circle"
#  .attr
#    "cx": w / 2
#    "cy": h / 2
#    "r": w / 10
#  .style
#    "fill": "limegreen"
  