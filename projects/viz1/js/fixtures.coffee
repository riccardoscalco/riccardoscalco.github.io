numberOfTopics = 7

topics = ("topic " + i for i in [1..numberOfTopics])
entities = ("entity " + i for i in [1..numberOfTopics * 100])
keywords = ("keyword " + i for i in [1..numberOfTopics * 100])

arrayIntersect_ = (arg1, arg2) ->
    retVal = []
    hashMap = {}
    for l in arg1
        hashMap[l] = 1
    for l in arg2
        if hashMap[l] and ((hashMap[l] += 1) == 2)
            retVal.push(l) 
    return retVal

arrayIntersect = (arg1, arg2) ->
    ## init iterate menggunakan list yang lebih kecil
    if arg1.length <= arg2.length
        return arrayIntersect_(arg1, arg2)
    return arrayIntersect_(arg2, arg1)

randomFloat = () -> Math.random()

dist =  () -> Math.random() * Math.random()

randomChoice = (array) -> 
  array[Math.floor(Math.random() * array.length)]

randomBoolean = (em=0) ->
  if em > 0.9
    a = (false for i in [0..0])
  else
    a = (false for i in [0..20])
  a.push true
  randomChoice a

randomBooleanOutlier = () ->
  a = (false for i in [0..130])
  a.push true
  randomChoice a


randomSourcesList = () ->
  ({"name": "Source " + i, "degree": randomFloat()} for i in [1..4])

getType = (list) -> list[0].split(" ")[0]

choose = (p) ->
  n = Math.random()
  for state, prob of p
    if n < prob
      return state
    else
      n = n - prob
  return state

topics = {
  "topic 1": 0.3
  "topic 2": 0.2
  "topic 3": 0.1
  "topic 4": 0.1
  "topic 5": 0.1
  "topic 6": 0.1
  "topic 7": 0.1
  "topic U": 0.0
}

isTopic = (n) ->
  n.split(" ")[0] == "topic"

# return true if edge does not exists
edgeNotExists = (n1, n2, graph) ->
  not (graph.edges[n1 + '-' + n2]? or graph.edges[n2 + '-' + n1]?)

nodeExists = (n, graph) ->
  graph.nodes[n]?

addEdge = (t, n, graph) ->
  if edgeNotExists t, n, graph
    graph.edges[t + '-' + n] = edgeObject t, n
    updateNode t, n, graph
    updateNode n, t, graph

updateNeighboursAndTopics = (s, t, graph) ->
  node = graph.nodes[s]
  node.neighbours.push t
  if isTopic(t)
    node.topics[t] = 1

updateNode = (s, t, graph) ->
  if nodeExists s, graph
    updateNeighboursAndTopics s, t, graph
  else
    type = s.split(" ")[0]
    graph.nodes[s] = nodeObject s, type, false
    updateNeighboursAndTopics s, t, graph

linkToTopic = (n, graph) ->
  t = choose topics
  addEdge t, n, graph

randEdge = (l1, l2, graph) ->
  e = randomChoice l1
  k = randomChoice l2
  intersect =  arrayIntersect(d3.keys(graph.nodes[e].topics), d3.keys(graph.nodes[k].topics)).length > 0
  if edgeNotExists e, k, graph
    if intersect
      if Math.random() > 0.1 # less rare
        addEdge e, k, graph
    else
      if Math.random() > 0.9 # more rare
        addEdge e, k, graph

nodeObject = (n, type, isnew) ->
  em = dist()
  setNew = randomBoolean em
  {
    "name": n
    "topics": {}
    "type": type
    "weight": {
      "metric": dist()
    }
    "emergence": {
      "new": setNew
      "metric": em
      "outlier": if setNew then false else randomBooleanOutlier()
    }
    "source": randomSourcesList()
    "neighbours": []
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
  # create some links (e,e), (e, k), (k, k)
  for i in [0..r]
    randEdge keywords, entities, graph
    randEdge entities, entities, graph
    randEdge keywords, keywords, graph

firstGraphObject = (date) ->
  result = {
    "meta" : {}
    "date" : date
    "nodes" : {}
    "edges" : {}
  }

  # link every keyword and every entity to a topic
  for k in keywords
    linkToTopic k, result
  for e in entities
    linkToTopic e, result

  # create some links (e,e), (e, k), (k, k)
  for i in [1..1000]
    randEdge keywords, entities, result
    randEdge entities, entities, result
    randEdge keywords, keywords, result

  window.fixtures[0] = result

# setNode = (graph, n, type, isnew, m, topic=undefined) ->
#   if not graph.nodes[n]
#     graph.nodes[n] = nodeObject n, type, isnew, m
#   else
#     graph.nodes[n].neighbours.push m

# randomEdges = (list1, list2, graph, iterations = 100) ->
#   l1 = list1.length
#   l2 = list2.length
#   for i in [0..Math.floor(iterations)]
#     n1 = randomChoice list1
#     n2 = randomChoice list2
#     if n1 != n2 and not graph.edges[n1 + '-' + n2]
#       isnew = randomBoolean()
#       graph.edges[n1 + '-' + n2] = edgeObject n1, n2
#       setNode graph, n1, getType(list1), isnew, n2
#       setNode graph, n2, getType(list2), false, n1

####################################################

# global object
window.fixtures = []

# create the first graph
firstGraphObject undefined

# graph evolution
#for i in [1..10]
#  newGraph = _.extendOwn {}, window.fixtures[i-1]
#  modifyGraph newGraph
#  window.fixtures.push newGraph





