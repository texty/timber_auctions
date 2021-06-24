
d3.csv("data/fig_3.csv").then(function(input){

    input.forEach(function(d){
        d.timber_volume = +d.timber_volume;
        d.usable_wood_volume = +d.usable_wood_volume;       
    });

    var regions =  [...new Set(input.map(function (d) { return d.region; })) ];
    var default_region = "Волинська";
    var bar_height = 36;

    d3.select("#select-list-2").select("ul")
        .selectAll("li.auto-added")
        .data(regions)
        .enter()
        .append("li")
        .attr("class", "auto-added")
        .text(function(d){ return d });


    d3.select("#select-list-2").on("click", function () {
        let dropdown = d3.select(this.parentNode).select("ul.dropdown");
        dropdown.classed("hidden", !dropdown.classed("hidden"));
    });


    d3.select("#select-list-2").selectAll('li.auto-added').on("click", function () {
        let clicked_region = d3.select(this).text();
        d3.select("span#selected-region-2").text(clicked_region);
        default_region = clicked_region;
        draw_stacked_2(clicked_region);
    });


    const margin = {top: 40, right: 10, bottom: 50, left: 150},
        width = d3.select("#chart-3").node().getBoundingClientRect().width - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;


    const svg = d3.select("#chart-3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");

    var xScale = d3
        .scaleLinear();


    var yScale = d3
        .scaleBand()
        .paddingInner(0.25);

    svg
        .append("g")
        .attr("class", "x-axis");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");

    var color = d3.scaleOrdinal()
        .domain(["plans", "budget"])
        .range(["#AA2B8E", "#AA2B8E66"]);


    draw_stacked_2(default_region);

    window.addEventListener("resize", function() {
        draw_stacked_2(default_region);
    });


    function draw_stacked_2(region) {

        var df = input.filter(function (d) {
            return d.region === region
        });

        df = df.sort(function(a,b){
            return a.usable_wood_volume - b.usable_wood_volume;
        });


        var y_domain = [...new Set(df.map(function (d) { return d.user_company; })) ];


        const real_groups = ["dif", "complete"];
        const desired_groups = ["Всього аукціонів", "Успішних аукціонів"];


        var new_width = d3.select("#chart-3").node().getBoundingClientRect().width - margin.left - margin.right;
        var new_height = df.length * bar_height;

        d3.select("#chart-3").select("svg")
            .attr("width", new_width + margin.left + margin.right)
            .attr("height", new_height + margin.top);

        xScale
            .rangeRound([0, new_width])
            .domain([0, d3.max(df, function (d) {
                return (Math.max(d.usable_wood_volume, d.timber_volume))
            })]);

        yScale
            .rangeRound([df.length * bar_height, 0])
            .domain(y_domain);


        svg.select(".y-axis")
            .transition()
            .duration(500)
            .call(d3.axisLeft(yScale)
                .tickFormat(function (d) {
                    return d.substring(0, 15) + "...";
                })
            );

        svg.select(".x-axis")
            .transition()
            .duration(500)
            .attr("transform", "translate(0," + (new_height + 5) + ")")
            .call(d3.axisBottom(xScale)
                    .ticks(4)
                // .tickFormat(function (d) {
                //     return nFormatter(d)
                // })
            );





        var bars_1 = svg.selectAll("rect.auctions")
            .data(df);

        bars_1.exit().remove();

        bars_1.enter()
            .append("rect")
            .attr("class", "auctions tip")
            .attr("width", function (d) {
                return xScale(d.usable_wood_volume)
            })
            .attr("y", function (d) {
                return xScale(d.user_company)
            })
            .attr("x", function () {
                return xScale(0);
            })
            .attr("height", yScale.bandwidth()/2)
            .attr("rx", yScale.bandwidth() / 4)
            .attr("ry", yScale.bandwidth() / 4)
            .style("fill", "#529963")
            //.style("opacity", 0.5)
            .merge(bars_1)
            .attr("y", function (d) {
                return yScale(d.user_company);
            })
            .attr("x", function (d) {
                return xScale(0);
            })
            .transition().duration(500)
            .attr("width", function (d) {
                return xScale(d.usable_wood_volume)
            })

        ;


        var bars_2 = svg.selectAll("rect.complete")
            .data(df);

        bars_2.exit().remove();

        bars_2.enter()
            .append("rect")
            .attr("class", "complete tip")
            .attr("width", function (d) { return xScale(d.timber_volume) })
            .attr("y", function (d) { return yScale(d.user_company) + yScale.bandwidth()/2})
            .attr("x", function (d) { return xScale(0); })
            .attr("height", yScale.bandwidth()/2)
            .attr("rx", yScale.bandwidth() / 4)
            .attr("ry", yScale.bandwidth() / 4)
            .style("fill", "#316944" )
            //.style("opacity", 0.5)
            .merge(bars_2)
            .attr("y", function (d) { return yScale(d.user_company) + yScale.bandwidth()/2})
            .attr("x", function (d) { return xScale(0);   })
            .transition().duration(500)
            .attr("width", function (d) { return xScale(d.timber_volume) });

    }

});


