numberOfTopics = 7

topics = ("topic " + i for i in [1..numberOfTopics])
entities = ("entity " + i for i in [1..numberOfTopics * 100])
keywords = ("keyword " + i for i in [1..numberOfTopics * 100])

randomFloat = () -> Math.random()

dist =  () -> Math.random() * Math.random()

randomChoice = (array) -> 
  array[Math.floor(Math.random() * array.length)]

randomBoolean = () ->
  a = (false for i in [0..7])
  a.push true
  randomChoice a

randomSourcesList = () ->
  ({"name": "Source " + i, "degree": randomFloat()} for i in [1..4])

getType = (list) -> list[0].split(" ")[0]

nodeObject = (n, type, isnew, m) ->
  {
    "name": n
    "type": type
    "weight": {
      "metric": dist()
    }
    "emergence": {
      "new": isnew
      "metric": dist()
      "outlier": randomBoolean()
    }
    "source": randomSourcesList()
    "neighbours": [m]
  }

edgeObject = (n, m, isnew) ->
  {
    "nodes": [n, m]
    "weight": {
      "metric": dist()
    }
    "emergence": {
      "new": isnew
      "metric": dist()
    }
    "source": randomSourcesList()
  }

setNode = (graph, n, type, isnew, m) ->
  if not graph.nodes[n]
    graph.nodes[n] = nodeObject n, type, isnew, m
  else
    graph.nodes[n].neighbours.push m

randomEdges = (list1, list2, graph, iterations = 100) ->
  l1 = list1.length
  l2 = list2.length
  for i in [0..Math.floor(iterations)]
    n1 = randomChoice list1
    n2 = randomChoice list2
    if n1 != n2 and not graph.edges[n1 + '-' + n2]
      isnew = randomBoolean()
      graph.edges[n1 + '-' + n2] = edgeObject n1, n2
      setNode graph, n1, getType(list1), isnew, n2
      setNode graph, n2, getType(list2), false, n1

firstGraphObject = (date) ->
  result = {
    "meta" : {}
    "date" : date
    "nodes" : {}
    "edges" : {}
  }
  # Add edges (t,k) at random
  randomEdges topics, keywords, result, 200
  # Add edges (t,e) at random
  randomEdges topics, entities, result, 200
  # Add edges (k,k) at random
  randomEdges keywords, keywords, result, 100
  # Add edges (e,k) at random
  randomEdges entities, keywords, result, 100
  # Add edges (e,e) at random
  randomEdges entities, entities, result, 100
  window.fixtures.push result

deleteEdge = (n, m, graph) ->
  edge = graph.edges[n + '-' + m]
  if edge
    delete graph.edges[n + '-' + m]
  edge

# Delete node n from the neighbours of m
deleteNeighbour = (n, m, graph) ->
  i = _.indexOf graph.nodes[m].neighbours, n
  graph.nodes[m].neighbours.splice(i, 1) 

deleteNode = (n, graph) ->
  node = graph.nodes[n]
  if node
    for m in node.neighbours
      deleteEdge n, m, graph
      deleteNeighbour n, m, graph
    delete graph.nodes[n]

vary = (x) ->
  x + (Math.random() * 2 - 1) / 10

resetGraph = (graph) ->
  for node in graph.nodes
    node.weight.metric = vary node.weight.metric
    node.emergence.metric = vary node.emergence.metric
    node.emergence.new = false
    node.emergence.oulier = randomBoolean()
  for edge in graph.edges
    edge.weight.metric = vary edge.weight.metric
    edge.emergence.metric = vary edge.emergence.metric
    edge.emergence.new = false

modifyGraph = (graph) ->
  r = 5
  # delete some entities
  for i in [0..r]
    n = randomChoice entities
    deleteNode n, graph
  # delete some keywords
  for i in [0..r]
    n = randomChoice keywords
    deleteNode n, graph
  # add some new edges
  # Add edges (t,k) at random
  randomEdges topics, keywords, graph, r
  # Add edges (t,e) at random
  randomEdges topics, entities, graph, r
  # Add edges (k,k) at random
  randomEdges keywords, keywords, graph, r
  # Add edges (e,k) at random
  randomEdges entities, keywords, graph, r
  # Add edges (e,e) at random
  randomEdges entities, entities, graph, r

####################################################

# global object
window.fixtures = []

# create the first graph
firstGraphObject undefined

# graph evolution
for i in [1..10]
  newGraph = _.extendOwn {}, window.fixtures[i-1]
  modifyGraph newGraph
  window.fixtures.push newGraph





