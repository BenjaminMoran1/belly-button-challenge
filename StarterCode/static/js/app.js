// Read the JSON data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {

  // make the bar chart, then bubble chart
  function createBarChart(sample) {
    let sampleData = data.samples.filter(function(obj) {
      return obj.id == sample;
    })[0];

    let barTrace = {
      x: sampleData.sample_values.slice(0, 10).reverse(),
      y: sampleData.otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
      text: sampleData.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    let barData = [barTrace];

    Plotly.newPlot("bar", barData);
  }

  function createBubbleChart(sample) {
    let sampleData = data.samples.filter(function(obj) {
      return obj.id == sample;
    })[0];

    let bubbleTrace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: "markers",
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: "Viridis"
      }};

    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
      xaxis: {title: "OTU IDs"}
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  }

  // make the dropdown menu
  function populateDropdown() {
    let dropdown = d3.select("#selDataset");

    data.names.forEach(function(sample) {
      dropdown.append("option").text(sample).property("value", sample);
    });
  }

  function optionChanged(sample) {
    displayMetadata(sample);
    createBarChart(sample);
    createBubbleChart(sample);
  }

  populateDropdown();
  let initialSample = data.names[0];
  displayMetadata(initialSample);
  createBarChart(initialSample);
  createBubbleChart(initialSample);

  d3.select("#selDataset").on("change", function() {
    let selectedSample = d3.select("#selDataset").property("value");
    optionChanged(selectedSample);
  });
  // display the sample data
  function displayMetadata(sample) {
    let metadata = data.metadata.filter(function(obj) {
      return obj.id == sample;
    })[0];
  
    let metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");
  
    Object.entries(metadata).forEach(function([key, value]) {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
}})

