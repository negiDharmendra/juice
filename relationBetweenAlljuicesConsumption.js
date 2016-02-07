function getJuiceData(selectedDay) {

    d3.json('/juice_orders.json', function(err, json) {
        var drinks = json.filter(function(x) {
            return x.isFruit == false
        }).map(function(x) {
            return x.drinkName
        });
        var days = ["Fri ", "Thu ", "Mon ", "Tue ", "Wed "];
        $('body').html(JSON.stringify(day))
        drinks = drinks.filter(function(x) {
            return x.toUpperCase() != 'CTL' && x != "Register User";
        })
        drinks = _.unique(drinks);
        var juicePerDay = {};
            console.log("helllo", days)
        for (var day in days) {
            var data = [];
            for (var index in drinks) {
                var juice = 0;
                for (var j in json) {
                    var date = String(new Date(json[j].date));
                    if (json[j].drinkName == drinks[index] && date.slice(0, 4) == days[day])
                        juice++;
                }
                data.push({
                    drink: drinks[index],
                    quantity: juice
                });
            }
            juicePerDay[days[day]] = data;
        }
        displayAllJuiceData(juicePerDay[selectedDay], drinks.length)
    })
}


function displayAllJuiceData(data, total) {
    $('.chart').empty()
     $(".chart").html("<h3>"+$(".selectDay>#listOfDays>option:selected").text()+"</h3>")
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
    })), -100]);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Drink:</strong> <span style='color:red'>"+d.drink +"</span>"+"</br><strong>Quantity:</strong> <span style='color:red'>"+d.quantity +"</span>";
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



$(window).load(function() {
    $('button.displayGraph').click(function(e) {
        var day = $(".selectDay>#listOfDays>option:selected").val();
       
        getJuiceData(day)
    })
})
