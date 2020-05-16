const svg = d3.select("svg");

svg.attr("viewBox", "0 0 960 720");

let inputX = document.querySelector("select[name=valueX]");
let inputY = document.querySelector("select[name=valueY]");

const axisXGroup = svg
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0, 620)");
const axisYGroup = svg
  .append("g")
  .attr("class", "y-axis")
  .attr("transform", "translate(100,0)");

const axisXText = svg
  .append("text")
  .attr("class", "x-text")
  .attr("transform", "translate(480,670)")
  .text("x axis");

const axisYText = svg
  .append("text")
  .attr("class", "y-text")
  .attr("transform", "translate(30,360) rotate(-90)")
  .text("y axis");

const placeCities = function() {
  let valueX = inputX.value;
  let valueY = inputY.value;

  axisXText.text(inputX.options[inputX.selectedIndex].innerHTML);
  axisYText.text(inputY.options[inputY.selectedIndex].innerHTML);

  const scaleX = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d, i) => d[valueX])])
    .range([100, 860]);

  const scaleY = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d, i) => d[valueY])])
    .range([620, 100]);

  const scaleR = d3
    .scaleSqrt()
    .domain([0, d3.max(data, (d, i) => d.population)])
    .range([0, 30]);

  const axisX = d3
    .axisBottom(scaleX)
    .tickSizeInner(-520)
    .tickSizeOuter(0)
    .tickPadding(10)
    .ticks(10, "$,f");
  const axisY = d3
    .axisLeft(scaleY)
    .tickSizeInner(-760)
    .tickSizeOuter(0)
    .tickPadding(10)
    .ticks(10, "$,f");

  axisXGroup.call(axisX);
  axisYGroup.call(axisY);

  const cities = svg
    .selectAll("g.city")
    .data(data, (d, i) => d.city)
    .enter()
    .append("g")
    .attr("class", "city")
    .attr("transform", (d, i) => {
      const x = scaleX(d[valueX]);
      const y = scaleY(d[valueY]);
      return `translate(${x}, ${y})`;
    });

  cities
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 0)
    .transition()
    .duration(1000)
    .attr("r", (d, i) => scaleR(d.population));

  cities
    .append("rect")
    .attr("x", -60)
    .attr("y", (d, i) => -scaleR(d.population) - 35)
    .attr("width", 120)
    .attr("height", 30);

  cities
    .append("text")
    .attr("x", 0)
    .attr("y", (d, i) => -scaleR(d.population) - 15)
    .text((d, i) => d.city);

  svg
    .selectAll("g.city")
    .transition()
    .duration(500)
    .attr("transform", (d, i) => {
      const x = scaleX(d[valueX]);
      const y = scaleY(d[valueY]);
      return `translate(${x}, ${y})`;
    });

  svg.selectAll("g.city").on("mouseover", function() {
    d3.select(this).raise();
  });
};

placeCities();

const selectTags = document.querySelectorAll("select");

selectTags.forEach(tag => {
  tag.addEventListener("change", function() {
    placeCities();
  });
});
