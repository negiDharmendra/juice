function getJuiceData(selectedDay) {
    var days = ['Mon','Tue','Wed','Thu','Fri'];
    var days1 = ['Monday','Tuesday','Wednesday','Thursday','Friday']
     d3.json('/consumptionPerDrinkPerDay.json', function(err, json) {
        days.forEach(function(day,index){
             var total = json[day].reduce(function(x,y){x.quantity = x.quantity+y.quantity;return x},{quantity:0})
            displayAllJuiceData(json[day],total.quantity,day,days1[index]);
        })
    })
}


function displayAllJuiceData(data,totalDrink,divname,day) {
    $('.'+divname+'chart').empty()
     $('.'+divname+'chart').html("<h3>"+day+' Drinks: '+totalDrink+"</h3>")
    var width = 280;
    var height = 220;
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, 400], .1)
    x.domain(data.map(function(d) {
        return d.drink;
    }));
    var x1 = d3.scale.ordinal().rangeRoundBands([0, 400], .1)
    x1.domain(data.map(function(d,i) {
        return i+1;
    }));
    var y = d3.scale.linear()
        .range([0, height]);

    var xAxis = d3.svg.axis()
        .scale(x1).ticks(9).tickSize(1);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(12).tickSize(1);

    y.domain([d3.max(data.map(function(d) {
        return d.quantity
    }))+100, -10]);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Drink:</strong> <span style='color:red'>"+d.drink +"</span>"+
            "</br><strong>Quantity:</strong> <span style='color:red'>"+d.quantity +"</span>"+
            "</br><strong>Percentage:</strong> <span style='color:red'>"+String((d.quantity/totalDrink)*100).slice(0,4) +"%</span>";;
        })

    var svg = d3.select('.'+divname+'chart').append("svg")
        .attr("width", width + margin.left + margin.right + 170)
        .attr("height", height + margin.top + margin.bottom + 40)
        .append("g")
        .attr("transform", "translate(" + 30 + "," + 20 + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 10)
        .attr("x", 1)
        .attr("dy", ".1em")
        .style("font-size", "8px")
        .style("text-anchor", "middle")

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("y", -15)
        .attr("x", 15)
        .style("font-size", "8px")
        .attr("dy", ".1em")
        .style("text-anchor", "end")
        .text("Quantity");


    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.drink) + 5;
        })
        .attr("width", 5)
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



$(window).load(function() {
    // $('button.displayGraph').click(function(e) {
        // var day = $(".selectDay>#listOfDays>option:selected").val();
        getJuiceData()
    // })
})
