let dataset;
const w = 800;
const h = 400;
const padding= 50;

xhr = new XMLHttpRequest();
xhr.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
xhr.send();
xhr.onload=function() {
	json=JSON.parse(xhr.responseText);
	dataset = json.data;
	console.log(dataset[0][0]);
	const xScale = d3.scaleTime()
		.domain([d3.min(dataset, (d) => new Date(d[0])), d3.max(dataset, (d) => new Date(d[0]))])
		.range([padding, w - padding]);

	const yScale = d3.scaleLinear()
		.domain([0, d3.max(dataset, (d) => d[1])])
		.range([h - padding, padding]);

	const svg = d3.select("body")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

	svg.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("width", (w - 2 * padding)/dataset.length)
		.attr("height", (d) => h - yScale(d[1]) - padding)
		.attr("x", (d, i) => xScale(new Date(d[0])))
		.attr("y", (d) => yScale(d[1]))
		.attr("class", "bar")
		.attr("data-date", (d) => d[0])
		.attr("data-gdp", (d) => d[1])
		.on('mouseover', function(d) {
			d3.select("#tooltip")
			.style("display", "inline-block")
			.style("left", (event.pageX - 85 + "px"))
			.style("top", event.pageY -70 + "px")
			.attr("data-date", d[0])
			.attr("data-gdp", d[1])
			.select("#date")
			.text(this.dataset.date.match(/^\d\d\d\d/) + " " + this.dataset.date.replace(/(\d\d\d\d\-)(\d+)(\-\d+)/, function(match, p1, p2){
				if (p2 < 4) {
					return "Q1"
				}else if(p2 < 7) {
					return "Q2"
				}else if (p2 < 10){
					return "Q3";
				}else{
					return "Q4";
				};	
			}));
			d3.select("#gdp")
			.text("$" + this.dataset.gdp + " billion")
			;

		})
		.on('mouseout', function() {
			d3.select("#tooltip")
				.style("display", "none")
		})

	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	svg.append("g")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.attr("id", "x-axis")
		.call(xAxis);

	svg.append("g")
		.attr("transform", "translate(" + (padding) + ", 0)")
		.attr("id", "y-axis")
		.call(yAxis);
};
