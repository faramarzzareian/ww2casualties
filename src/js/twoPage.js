var allArray = []; // casualty object Array
var country_Array = {};
var country_Array1 = [];
var colorNum = [];
var color = d3.scaleOrdinal(d3.schemeCategory20);
var z = d3.scaleSqrt()
    .domain([0, 33000000])
    .range([ 30, 145]);

//first csv file read
d3.csv("./cs.csv", function (data) {
    var array = {};
    //regionId
    array['regionId'] = data.regionId;
    //country
    array['country'] = data.country;
    //value
    var value = parseInt(data.value.replace(/ /gi, ""));
    if (!Number.isNaN(value)) {
        array['value'] = value;
    } else {
        array['value'] = 0;
    }
    //date
    var date = new Date(data.date);
    array['date'] = date;
    //year
    array['year'] = date.getFullYear();
    //month
    array['month'] = date.getMonth() + 1;
    //day
    array['day'] = date.getDate();
    allArray.push(array);

    if (!country_Array[array.country]) {
        //country_array
        var temp = {};
        temp['country'] = array.country;
        temp['value'] = array.value;
        country_Array[array.country] = temp;

        var tempColor = Math.random();
        if (colorNum.indexOf(tempColor) < 0) {
            colorNum.push(tempColor);
        }
        //one_page
        d3.select(".bubble1")
            .append('div')
            .style('background', color(tempColor))
            .style('width', '30px')
            .style('height', '15px')
            .style('float', 'left')
            .style('margin-top', '5px')
            
            .on('mouseover', function () {
                
                  
                
                //over_event
               
                 
                var country_name = $(this).next().text();
                var theNode = d3.selectAll(".node")
                    .filter(function (d) {
                        return d.data.country === country_name
                    });
                d3.selectAll(".node").style("opacity", "0.5");
               
              
         
                theNode.style("opacity", "1");
                
                //bar_chart
                var Temp = null;
                for (var i = 0; i < allArray.length; i++) {
                    for (var j = i + 1; j < allArray.length; j++) {
                        if (allArray[i].year > allArray[j].year) {
                            Temp = allArray[i];
                            allArray[i] = allArray[j];
                            allArray[j] = Temp;
                        }
                    }
                }
                var chart_data = [];
                for (var i in allArray) {
                    if (allArray[i].country === country_name) {
                        chart_data.push(allArray[i])
                    }
                }


                d3.select(".bubble3").html('');
                var svg = d3.select(".bubble3").append('svg').attr("width", 400)
                        .attr("height", 370),
                    margin = 150,
                    width = svg.attr("width") - margin,
                    height = svg.attr("height") - margin;

                svg.append("text")
                    .attr("transform", "translate(20,0)")
                    .attr("x", 50)
                    .attr("y", 80)
                    .attr("font-size", "30px")
                    .style('fill', color(tempColor))
                    .text(country_name);

                var xScale = d3.scaleBand().range([0, width]).padding(0.4),
                    yScale = d3.scaleLinear().range([height, 0]);

                var g = svg.append("g")
                    .attr("transform", "translate(" + 100 + "," + 100 + ")");
                xScale.domain(chart_data.map(function (d) {
                    return d.year;
                }));
                yScale.domain([0, d3.max(chart_data, function (d) {
                    return d.value;
                })]);

                g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(xScale))
                    .append("text")
                    .attr("y", height - 250)
                    .attr("x", width - 100)
                    .attr("text-anchor", "end")
                    .attr("stroke", "translate");

                g.append("g")
                    .call(d3.axisLeft(yScale).tickFormat(function (d) {
                        return d;
                    })
                        .ticks(10))
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "-5.1em")
                    .attr("text-anchor", "end")
                    .attr("stroke", "translate");

                g.selectAll(".bar")
                    .data(chart_data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("stroke", "translate")
                    .attr("fill", color(tempColor))
                    .attr("x", function (d) {
                        return xScale(d.year);
                    })
                    .attr("y", function (d) {
                        return yScale(d.value);
                    })
                    .attr("width", xScale.bandwidth())
                    .attr("height", function (d) {
                        return height - yScale(d.value);
                    });

                //pie_chart
                var all_result = 0;
                var result = 0;
                for (var i in allArray) {
                    all_result += allArray[i].value;
                }
                for (var i in allArray) {
                    if (allArray[i].country === country_name) {
                        result += allArray[i].value;
                    }
                }

                var salesData = [
                    {label: "World", value: all_result, color: "rgb(74, 74, 72)"},
                    {label: country_name, value: result, color: color(tempColor)}
                ];
                var svg = d3.select(".bubble3").append("svg").attr("width", 300).attr("height", 280);
                svg.append("g").attr("id", "salesDonut");
                Donut3D.draw("salesDonut", salesData, 150, 150, 130, 100, 30, 0.4);

                function randomData() {
                    return salesData.map(function (d) {
                        return {label: d.label, value: 1000 * Math.random(), color: d.color};
                    });
                }
            })

            .on("mouseout", function () {
                d3.select(this).style("opacity", "1");
            });
        d3.select(".bubble1").append('p').text(array.country);

    }
    else {
        country_Array[array.country].value += array.value;
    }
    
}).then(function () {
    //one_page
    
    var allArray1 = allArray;
    country_Array1 = [];
    for (var i in country_Array) {
        country_Array1.push(country_Array[i]);
    }
    var dataset = {'children': country_Array1};
    var diameter =700;
    var bubble = d3.pack(dataset).size([600, 600]).padding(149);
    var svg = d3.select(".bubble2").append("svg").attr("width", 750).attr("height",600).attr("class", "bubble");
    var nodes = d3.hierarchy(dataset).sum(function (d) {
        return d.value;
    });
    var node = svg.selectAll(".node").data(bubble(nodes).descendants()).enter()
        .filter(function (d) {
            return !d.children
        })
        .append("g").attr("class", "node").attr("transform", function (d) {
            return "translate(" + d.x  + "," + d.y + ")";
        })
        .style("opacity", "0.5");

    node.append("title")
        .text(function (d) {
            return d.data.country + ": " + d.value;
        });
        
    node.append("circle")
        .attr("r", d =>  z(d.value)/1.8  )
        .style("fill", function (d, i) {
            return color(colorNum[i]);
         
        });

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.data.country.substring(0, z(d.value)/5);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function (d) {
            return z(d.value)/6;
        })
        .attr("fill", "black");

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.data.value;
        })
        .attr("font-family", "Gill Sans", "Gill Sans MT")
        .attr("font-size", function (d) {
            return z(d.value) / 5;
        })
        .attr("fill", "black");

    d3.select(self.frameElement)
        .style("height", diameter + "px");


    //two_page Line_chart


    for (var i = 0; i < allArray1.length; i++) {
        for (var j = i + 1; j < allArray1.length; j++) {
            if (allArray1[i].date > allArray1[j].date) {
                var Temp = allArray1[i];
                allArray1[i] = allArray1[j];
                allArray1[j] = Temp;
            }
        }
    }

    var ddd1 = [];
    for (var i in allArray1) {
        var ddd = [];
        ddd['date'] = '  ' + allArray1[i].year;
        /*if(allArray1[i].value>40000){
            ddd['value'] = '' + allArray1[i].value/2;
        }else{*/
            ddd['value'] = '' + allArray1[i].value;
       /* }*/
        ddd['country'] = allArray1[i].country;
        ddd1.push(ddd);
    }


    var dateData = [];
    for (var i in allArray1) {
        var d = "  " + allArray1[i].year;
        if (dateData.indexOf(d) < 0) {
            dateData.push(d);
        }
        for (var j = 0; j < i; j++) {
            if (allArray1[i].value > allArray1[j].value) {
                var Temp = allArray1[i];
                allArray1[i] = allArray1[j];
                allArray1[j] = Temp;
            }
        }
    }

    var margin = {top: 50, right: 50, bottom: 100, left: 50},

        width = 500 - margin.left - margin.right,
        height = 580 - margin.top - margin.bottom;

    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var sumstat = d3.nest()
        .key(function (d) {
            return d.country;
        })
        .entries(ddd1);

    
});