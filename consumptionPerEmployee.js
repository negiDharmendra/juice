function getJuiceData(employee) {
     d3.json('/consumptionPerEmployee.json', function(err, json) {
        var total = json[employee].reduce(function(x,y){x.quantity = x.quantity+y.quantity;return x},{quantity:0})
        displayAllJuiceData(json[employee],total.quantity)
    })
}


function displayAllJuiceData(data,totalDrink) {
    $('.chart').empty()
     $(".chart").html("<h3>"+$(".selectEmployee>#listOfEmployeeId>option:selected").text()+"</h3>")
    var width = 500;
    var height = 450;
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, 850], .1)
    x.domain(data.map(function(d) {
        return d.drink;
    }));
    var y = d3.scale.linear()
        .range([0, height]);

    var xAxis = d3.svg.axis()
        .scale(x).ticks(9).tickSize(1);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10).tickSize(1);

    y.domain([d3.max(data.map(function(d) {
        return d.quantity
    })), 0]);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Drink:</strong> <span style='color:red'>"+d.drink +"</span>"+
            "</br><strong>Quantity:</strong> <span style='color:red'>"+d.quantity +"</span>"+
            "</br><strong>Percentage:</strong> <span style='color:red'>"+String((d.quantity/totalDrink)*100).slice(0,4) +"%</span>";;
        })

    var svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right + 800)
        .attr("height", height + margin.top + margin.bottom + 100)
        .append("g")
        .attr("transform", "translate(" + 50 + "," + 20 + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", -15)
        .attr("x", 10)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start")

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 2)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Quantity");


    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.drink) + 20;
        })
        .attr("width", 10)
        .attr("y", function(d) {
            return y(d.quantity);
        })
        .attr("height", function(d) {
            return height - y(d.quantity);
        })

    d3.selectAll(".bar").call(tip)
    .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

}

$(window).load(function(){
    d3.json('/consumptionPerEmployee.json', function(err, json) {
        var employeesId = Object.keys(json);
        for(var employeeId in employeesId){
            $('#listOfEmployeeId').append( '<option value='+employeesId[employeeId] +'>'+employeesId[employeeId]+'</option>')
        }
    })
})

$(window).load(function() {

    $('button.displayGraph').click(function(e) {
        var employee = $(".selectEmployee>#listOfEmployeeId>option:selected").val();
        getJuiceData(employee)
    })
})
