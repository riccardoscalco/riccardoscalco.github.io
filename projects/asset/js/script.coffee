# data is refered to a disease
copertures = (data, country, year1="2007", year2="2013") ->
  try
    res = data.filter (e) ->
      (e.areas == country) and (+year1 <= +e["Reference year(s)"] <= +year2)
  catch error
    console.log error
    undefined

# data is data[0]
modality = (data, country, disease) ->
  try
    res = data.filter (e) -> (e.Country == country) and (e.Disease == disease)
    res = res.map (e) -> e["Modality"]
    res
  catch error
    console.log error
    undefined

modalitySet = (data, countries, disease) ->
  res = countries.map (c) -> modality data[0], c, disease
  _.uniq _.flatten res

countries = (data) ->
  _.uniq data.map (e) -> e.Country

fix = (country) ->  
  fixNames = {
    "United Kingdom": "United Kingdom of Great Britain and Northern Ireland"
    "The Netherlands": "Netherlands"
  }
  if fixNames[country]? then fixNames[country] else country

inverseFix = (country) ->
  fixNames = {
    "United Kingdom of Great Britain and Northern Ireland": "United Kingdom"
    "Netherlands": "The Netherlands"
  }
  if fixNames[country]? then fixNames[country] else country

nameDis = (dis) ->
  o = {
    "DTP3 (%)": "Pertussis"
    "MCV2 (%)": "Measles-mumps-rubella"
    "Pol3 (%)": "Polio"
  }
  o[dis]

isOdd = (num) -> num % 2

# data is refered to a disease
averageCop = (data, countries, disease="") ->
  res = (copertures(data, fix(country)) for country in countries)
  res = _.zip.apply(_, res)
  res = res.map (a) -> (d3.mean a, (d) -> +d[disease])

# data is refered to a disease
minCop = (data, countries, disease="") ->
  res = data.filter (e) -> inverseFix(e.areas) in countries
  d3.min res, (e) -> +e[disease]

# data is refered to a disease
maxCop = (data, countries, disease="") ->
  res = data.filter (e) -> inverseFix(e.areas) in countries
  d3.max res, (e) -> +e[disease]


drawViz = (error, data) ->

  modData = data[0]

  # select Countries
  countries = countries data[0]
  
  # calculate average
  av1 = averageCop data[1], countries, "DTP3 (%)"
  av2 = averageCop data[2], countries, "MCV2 (%)"
  av3 = averageCop data[3], countries, "Pol3 (%)"

  width = 900
  height = 5050
  m = {top: 0, right: 0, bottom: 0, left: 0}

  svg = d3.select "#viz"
    .append "svg"
    .attr
      "viewBox": "0 0 " + width + " " + height
      "preserveAspectRatio": "xMidYMin slice"
      "width": width
      "height": height
    # .style
    #   "padding-bottom": (100 * height / width) + "%"
    #   "height": "1px"
    #   "overflow": "visible"

    ra = textures.circles()
      .thicker()
      .lighter()
      .fill "#ccc"
    svg.call ra

    ma = textures.circles()
      .thicker()
      .lighter()
      .fill "#da2647"
    svg.call ma

  mainG = svg.append "g"
    .attr "transform", "translate(" + 200 + "," + 100 + ")"

  widthCell = 150
  heightCell = 150

  yScale = d3.scale.linear()
    .domain [0,100]
    .range [heightCell, 0]

  yAxis = d3.svg.axis()
    .scale yScale
    .ticks 4
    .tickValues [25, 50, 75]
    .orient "right"

  # data is refered to a disease
  cell = (data, country, disease, average, dx=0, dy=0, showAxis=false) ->
    cellG = mainG.append "g"
        .attr "class", "cell"
        .attr "transform", "translate(" + dx + "," + dy + ")"
    if showAxis
      cellG.append "g"
        .attr "class", "y axis"
        .attr "transform", "translate(" + (widthCell + 10) + ",0)"
        .call yAxis
    mod = do () ->
      m = modality modData, country, nameDis(disease)
      if ("MA" in m) or ("MR" in m)
        return ma.url()
      if "RA" in m
        return ra.url()
        #return "white"
    cellG.append "rect"
        .attr 
          "x": 0
          "y": 0
          "width": widthCell
          "height": heightCell
        .style
          "height": ""
          "width": ""
          "shape-rendering": "crispEdges"
          "fill": mod
          "stroke-width": 0
    w = (widthCell - 0) / average.length
    dw = 0
    bars = cellG.append "g"
      .attr "transform", "translate(" + 0 + "," + 0 + ")"
    bar = bars.selectAll "rect"
        .data copertures data, fix(country)
      .enter()
        .append "rect"
        .attr 
          "x": (d, i) -> w * i + dw
          "y": (d, i) ->
            v = +d[disease]
            yScale d3.max [v, average[i]]
          "width": w - dw * 2
          "height": (d, i) ->
            v = +d[disease]
            Math.abs(yScale(v) - yScale(average[i]))
        .style
          "height": ""
          "width": ""
          "shape-rendering": "crispEdges"
          "stroke-width": 0
          "fill-opacity": (d, i) ->
            if isOdd(i) then 0.4 else 0.5
          "fill": (d, i) ->
            v = +d[disease]
            if v - average[i] > 0 then "#44d7a8" else "#da2647"
    lineBar = bars.selectAll ".valuelines"
        .data copertures data, fix(country)
      .enter()
        .append "line"
        .attr
          "x1": (d, i) -> w * i + dw
          "x2": (d, i) -> w * (i + 1) - dw
          "y1": (d) ->
            v = +d[disease]
            yScale v
          "y2": (d) ->
            v = +d[disease]
            yScale v
          "class": "averageLine"
        .style
          "stroke": (d, i) ->
            v = +d[disease]
            if v - average[i] > 0 then "#44d7a8" else "#da2647"
    avBar = bars.selectAll "lines"
        .data average
      .enter()
        .append "line"
        .attr
          "x1": (d, i) -> w * i + dw
          "x2": (d, i) -> w * (i + 1) - dw
          "y1": (d) -> yScale d
          "y2": (d) -> yScale d
          "class": "averageLine"
    # avCirc = bars.selectAll "circles"
    #     .data average
    #   .enter()
    #     .append "circle"
    #     .attr
    #       "cx": (d, i) -> w * i + dw
    #       "cy": (d) -> yScale d
    #       "r": 2
    #     .style
    #       "fill": "#131313"
    #       "stroke-width": 0


  dw = 20
  dh = 20

  for country, index in countries
    cell data[1], country, "DTP3 (%)", av1, 0, index * (heightCell + dh)

  for country, index in countries
    cell data[3], country, "Pol3 (%)", av3, widthCell + dw, index * (heightCell + dh)

  for country, index in countries
    cell data[2], country, "MCV2 (%)", av2, (widthCell + dw) * 2, index * (heightCell + dh), true

  yLabels = svg.append "g"
    .attr "transform", "translate(180, 180)"
  yLabels.selectAll "text"
      .data countries
    .enter()
      .append "text"
      .text (d) -> d
      .attr "class", "labels ylabels"
      .attr "transform", (d, i) -> "translate(0," + i * (heightCell + dh) + ")"

  xLabels = svg.append "g"
    .attr "transform", "translate(180, 80)"
  xLabels.selectAll "text"
      .data ["Pertosse","Polio","Morbillo"]
    .enter()
      .append "text"
      .text (d) -> d
      .attr "class", "labels"
      .attr "transform", (d, i) -> "translate(" + (widthCell / 2 + (widthCell + dw) * i) + ",0)"

# ------------------------------------------------------------------------------

__dirname = "./data/viz1/"
queue()
    .defer d3.csv, __dirname + "obblibo_vaccini_europa.csv"
    .defer d3.csv, __dirname + "dtp3.csv"
    .defer d3.csv, __dirname + "mcv2.csv"
    .defer d3.csv, __dirname + "pol3.csv"
    .awaitAll drawViz
