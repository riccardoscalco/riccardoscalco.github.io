save = (node, filename) ->
  window.xx = node
  a = document.createElement "a"
  document.body.appendChild a
  a.style = "display: none"
  blob = new Blob([node], { "type" : "text\/html" })
  url = window.URL.createObjectURL blob
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL url


# variables
session = {}
session.graph = window.fixtures[0]
session.cutoff = 0.85

# random string
rand = () ->
  "#{Math.random().toString(36)}00000000000000000"
    .replace /[^a-z]+/g, ""
    .slice 0, 5

# random integer
randomInt = (max,min=0) ->
  Math.floor(Math.random() * (max - min) + min)

# Box–Muller transform
gaussianDist = (mu, sigma, alpha=1) ->
  x = Math.random()
  y = Math.random()
  z = alpha * Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * y)
  z * sigma + mu

# Rectangular distribution
rectDist = (x, dx) ->
  min = x - dx
  max = x + dx
  Math.random() * (max - min) + min

getNodes = (graph) -> d3.values(graph.nodes).filter((e) -> e.type != "topic")
session.nodes = getNodes session.graph

getTopics = (nodes) ->
  res = nodes.map (e) -> d3.keys(e.topics)
  res = [].concat.apply([], res)
  _.uniq res
session.topics = getTopics session.nodes

topicPoints = (topics) ->
  res = {}
  for i in [1..topics.length]
    res[topics[i-1]] = i * session.dw
  res

mainTopic = (topics) ->
  zip = ([k, v] for k, v of topics)
  zip.sort (a, b) -> - a[1] + b[1]
  zip[0][0]

yCoords = (mu, sigma, alpha) ->
  y = gaussianDist mu, sigma, alpha

xCoords = (n) ->
  x = rectDist session.topicPoints[mainTopic(n.topics)], session.dw

# ------------------------------------------------------------------------------

viz = document.getElementById('viz')
width = 900
height = 900 / viz.offsetWidth * viz.offsetHeight
height1 = 600 / viz.offsetWidth * viz.offsetHeight
m =
  top: 10
  bottom: 10
  right: 0
  left: 0
w = width - m.left - m.right
h = height - m.top - m.bottom

session.dw = w / (session.topics.length + 1)
session.topicPoints = topicPoints session.topics

rScale =  d3.scale.sqrt()
    .domain([0, 1])
    .range([0.3, 4])

whiteScale = d3.scale.linear()
    .domain [0, 1]
    .range [0.5, 1]

isNew = (n) ->
  if n.emergence.new then " new" else ""

isOutlier = (n) ->
  if n.emergence.outlier then " outlier" else ""

isEmergent = (n) ->
  if n.emergence.metric > session.cutoff then " emergent" else ""

setOpacity = (n) ->
  #em = n.emergence
  #if em.new or em.outlier or em.emergence > 0.9
  #  return 1
  #else
  #  return em.metric
  if isEmergent n then 1 else n.emergence.metric / 2

radius = (n) ->
  try
    if n.type == "topic"
      0
    else
      rScale n.weight.metric
  catch error
    0

ring = (r) ->
  d3.max [r * 1.5, 3]

svg = d3.select "#viz"
  .append "svg"
  .attr "id", "vizsvg"
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

filter = d3.select "#vizsvg"
  .append "filter"
    .attr
      "id": "blurMe"
      "x": "-50%"
      "y": "-50%"
      "width": "200%"
      "height": "200%"
filter.append "feGaussianBlur"
    .attr "stdDeviation", 1.5

svgBack = d3.select "#vizBack"
  .append "svg"
  .attr "id", "nebulasSVG"
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

nebulas = svgBack.append "svg:g"
  .attr "id", "nebulas"
  .style "opacity", 0.4

focus = svg.append "svg:g"
    .attr "class", "focus"
    .style "opacity", 1

focusCircle = focus.append "svg:circle"
    .attr "r", "6"
    .style
      "fill-opacity": 0.1
      "stroke": "red"

clips = svg.append "svg:g"
  .attr "id", "node-clips"

nodes = svg.append "svg:g"
  .attr "id", "nodes"

paths = svg.append "svg:g"
  .attr "id", "nodes-paths"

nodeG = nodes.selectAll ".node"
    .data session.nodes
  .enter().append "svg:g"
    .attr "id", (d, i) -> "node-" + i
    .attr "class", (d) ->
      n = session.graph.nodes[d.name]
      "node" + isEmergent(n) + isNew(n) + isOutlier(n)
    .attr "transform", (d) ->
      d.x = xCoords session.graph.nodes[d.name]
      d.y = yCoords height / 2, 40, 1
      "translate (" + d.x + "," + d.y + ")"

nodeG.append "svg:circle"
    .attr "r", (d) ->
      n = session.graph.nodes[d.name]
      radius n
    .style "fill-opacity", (d) ->
      n = session.graph.nodes[d.name]
      setOpacity(n)

nodes.selectAll ".emergent"
  .insert "svg:circle", ":first-child"
    .attr "r", (d) ->
      n = session.graph.nodes[d.name]
      ring radius n
    .style
      "stroke-width": 0
      "filter": "url(#blurMe)"

pulse = () ->
  circle = d3.select(this)
  r = ring circle.attr "r"
  (repeat = () -> 
    circle = circle.transition()
    #.delay 1000 * Math.random()
    .duration(1500 + 1000 * Math.random())
    .attr "r", r
    #.style "stroke-width", 0
    .transition()
    .duration(1500)
    .attr "r", 0
    #.style "stroke-width", 2
    .each("end", repeat)
    )()

nodes.selectAll ".outlier"
  .append "circle"
    .attr "class", "pulse"
    .attr "r", (d) ->
      n = session.graph.nodes[d.name]
      radius n
    #.attr "class", "node"
    .each(pulse)



# ---- focus on mousemove ------------------------------------------------------
# based on http://bl.ocks.org/njvack/1405439

vertices = session.nodes.map (d) -> [d.x, d.y]

clips.selectAll "clipPath"
    .data session.nodes
  .enter().append "svg:clipPath"
    .attr "id", (d, i) -> "clip-" + i
  .append "svg:circle"
    .attr 'cx', (d) -> d.x
    .attr 'cy', (d) -> d.y
    .attr 'r', 7

paths.selectAll "path"
    .data d3.geom.voronoi(vertices)
  .enter().append "svg:path"
    .attr "d", (d) -> "M" + d.join(",") + "Z"
    .attr "id", (d, i) -> "path-" + i
    .attr "clip-path", (d, i) -> "url(#clip-" + i + ")"
    .style("fill", d3.rgb(230, 230, 230))
    .style('fill-opacity', 0.01)
    .style("stroke-width", 1)
    .style("stroke", "red")
    .style("stroke-opacity", 0)
  
paths.selectAll "path"
  #.on "click", (d,i) ->
  #  nodes.select('circle#node-'+i)
  #    .style("fill", "red")
  .on "mouseover", (d, i) ->
    #d3.select this
    #  .style('stroke-opacity', 1)
    f = nodes.select('g#node-'+i)
    focusCircle
      .attr "transform", f.attr "transform"
    #focus.style "opacity", 1
      #.style('fill', "red")
      #.classed "focus", 1
  #.on "mouseout", (d, i) ->
    #d3.select(this)
    #  .style('stroke-opacity', 0)
    #nodes.select('circle#node-'+i)
    #  .style('fill', 'white')
      #.classed "focus", 0

# ---- nebula effect -----------------------------------------------------------
# based on http://codepen.io/riccardoscalco/pen/KpRxNy

nebulaLine = d3.svg.line()
    .tension 0  # Catmull–Rom
    .interpolate "basis"

nebulaPoints = (nodes, topic, n) ->
  points = nodes
    #.filter (d) -> (mainTopic(d.topics) == topic) and (height / 2 - 50 < d.y < height / 2 + 50)
    .filter (d) -> (mainTopic(d.topics) == topic)
    .map (d) -> [d.x, d.y]
  points[0..n]
  #res = points.filter (e) -> height / 2 - 30 < e[1] < height / 2 + 30
  #res[0..n]

createFilter = (w, h, color) ->

  baseFrequency = "0.02"
  numOctaves = "8"
  seed = randomInt(100) + ""
  stdDeviation = randomInt(6,4) + ""
  scale = "100"
  
  filterid = rand()

  filter = d3.select "#nebulasSVG"
    .append "filter"
    .attr
      "id": filterid
      "width": "200%"
      "height": "200%"
      "x": "-50%"
      "y": "-50%"

  filter
    .append "feFlood"
    .attr
      "flood-color": color
      "result": "element"

  filter
    .append "feTurbulence"
    .attr
      "baseFrequency": baseFrequency
      "type": "fractalNoise"
      "numOctaves": numOctaves
      "seed": seed
      "result": "element_1"
  #ok
  filter
    .append "feGaussianBlur"
    .attr
      "stdDeviation": stdDeviation
      "in": "SourceAlpha"
      "result": "element_2"

  filter
    .append "feDisplacementMap"
    .attr
      "scale": "100"
      "in": "element_2"
      "in2": "element_1"
      "result": "element_3"

  filter
    .append "feComposite"
    .attr
      "operator": "in"
      "in": "element"
      "in2": "element_3"
      "result": "element_4"

  #filter
  #  .append "feMerge"
  #  .append "feMergeNode"
  #  .attr
  #    "in": "element_4"

  filterid

drawNebula = (index, topic) ->
  nebulaColors = _.shuffle [
    "#5fbed7",
    "#fd7c6e",
    "#e88e5a",
    "#4f86f7",
    "#ffff99",
    "#ff5470",
    "#ffff38",
    "#aaf0d1",
    "#ef98aa",
    "#fd5240",
    "#9d81ba",
    "#76ff7a",
    "#ff3855",
    "#80daeb",
    "#ff404c",
    "#ffa089",
    "#a2add0",
    "#ebc7df",
    "#a0e6ff",
    "#c5e384",
    "#ffb653"
  ]

  topicColors = do () ->
    res = {}
    for i in [0..session.topics.length]
      res[session.topics[i]] = nebulaColors[i]
    res

  w = session.dw
  h = height / 4

  filterid = createFilter w, h, topicColors[topic]
  points = nebulaPoints session.nodes, topic, 1000

  s = nebulas.append "g"
    .datum points

  s.append "path"
    .attr
      "d": nebulaLine
    .style
      "filter": "url(#" + filterid + ")"
      "stroke": topicColors[topic]
      "fill": "transparent"
        
for t, i in session.topics
  drawNebula i, t

# ---------------------------------------------------

# popup = svg.append "rect"
#   .style
#     "fill": "red"
#   .attr
#     "id": "popup"
#     "x": 0
#     "y": 0
#     "height": 10
#     "width": 10
#   .attr "transform", "translate(100, 200)"

# test = svg.append "circle"
#   #.attr "class", "pulse"
#   .attr
#     "cx": width / 2
#     "cy": height / 2
#     "r": 5
#   .style
#     "fill": "yellow"
#   #.each(pulse)
#   .on "click", () ->
#     d3.select "#popup"
#       .transition().duration(2000)
#       .attr "transform", "translate(800, 200)"
#     #sel = d3.select "#vizBack"
#     #save sel.node().innerHTML, "snap.svg"
