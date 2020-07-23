var height=600;
var width=600;
var minYear=d3.min(birthData,function(d){
    return d.year;
})
var maxYear=d3.max(birthData,(d)=>{return d.year});
var padding=10;
var numBars=12;
var barWidth=width/numBars-padding;
var tooltip = d3.select("body")
                .append("div")
                .classed("tooltip",true)                
var maxBirths=d3.max(birthData,(d)=>{return d.births})
var yScale=d3.scaleLinear()
            .domain([0,maxBirths])
            .range([height,0])

var input=d3.select("input")
    input.property("min",minYear)
    input.property("max",maxYear)
    input.property("value",minYear)
d3.select("svg")
    .append("text")
    .classed("year",true)
    .attr("x",width/2)
    .attr("y",20)
    .attr("text-anchor","middle")
    .attr("font-size","1.6em")
d3.select("svg")
        .attr("width",width)
        .attr("height",height)
    .selectAll("rect")
    .data(birthData.filter(function(d){
        return d.year===minYear
    }))
    .enter()
    .append("rect")
    .attr("width",barWidth)
    .attr("height",(d)=>{return height-yScale(d.births)})
    .attr("y",function(d){
        return yScale(d.births);
    })
    .attr("x",(d,i)=>{return (barWidth+padding)*i})
    .attr("fill","purple")
    .on("mousemove",function(d){
        tooltip
            .style("opacity",1)
            .style("left",d3.event.x-(tooltip.node().offsetWidth/2)+"px")
            .style("top",d3.event.y+25+"px")
            .html(`
            <p>Month: ${d.month}</p>
            <p>Births:${d.births}</p>
         `)
    })
    .on("mouseout",function(d){
        tooltip 
            .style("opacity",0)
    })
   

d3.select("input")
    .on("input",function(){
        var year=+d3.event.target.value;
        d3.selectAll("rect")
        .data(birthData.filter(d=>{return d.year===year}))
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .delay((d,i)=>i*250)
        .on('start',function(){
            d3.select(".year")
                .text("Updating to "+year+" data ...")
        })
        .on("end",function(d,i,nodes){
            if(i===nodes.length-1){
                d3.select(".year")
                    .text("Birth data in "+year)
            }
        })
       
        .on("interrupt",function(){
            console.log("Transition is interrupted");
        })
        .attr("height",(d)=>{return height-yScale(d.births)})
        .attr("y",(d)=>{return yScale(d.births)})
        
    })