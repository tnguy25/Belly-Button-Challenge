// Using D3 library to read JSON and URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});
// Using initial function to display each key-value pair from the metadata JSON object somewhere on the page
function init(){
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then(function (data){
        sampleNames = data.names
        sampleNames.forEach((sample) => {
            dropdownMenu.append("option").text(sample).property("value", sample)
        })
        getMetadata(sampleNames[0])
        getBarChart(sampleNames[0])
        getBubbleChart(sampleNames[0])
    })
};
// Using function to display the sample metadata, an individual's demographic information.
function getMetadata(sample){
    d3.json(url).then(function(data){
        let metadata = data.metadata;
        let filteredData = metadata.filter(datasample => datasample.id == sample);
        let actual_data = filteredData[0];
        let panel = d3.select("#sample-metadata");
        panel.html("")
        Object.entries(actual_data).forEach(([key, value]) => {panel.append("h5").text(`${key}: ${value}`)})
    })
}
// Using function to create bar chart.
function getBarChart(sample){
    d3.json(url).then(function(data){
        let samples = data.samples;
        let filteredData = samples.filter(datasample => datasample.id == sample);
        let actual_data = filteredData[0];
        
        let sample_values = actual_data.sample_values;
        let otu_ids = actual_data.otu_ids;
        let otu_labels = actual_data.otu_labels;

        let xdata = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let ydata = sample_values.slice(0,10).reverse();
        let tlabels = otu_labels.slice(0,10).reverse();

        let tracedata = [{
            x: ydata,
            y: xdata,
            text: tlabels,
            type:"bar",
            orientation: "h"
        }]
        let layout = {
            title: "Top 10 OTUs",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        }
        Plotly.newPlot("bar", tracedata, layout)
    })
}
// Using function to create the bubble chart. 
function getBubbleChart(sample){
    d3.json(url).then(function(data){
        let samples = data.samples;
        let filteredData = samples.filter(datasample => datasample.id == sample);
        let actual_data = filteredData[0];
        
        let sample_values = actual_data.sample_values;
        let otu_ids = actual_data.otu_ids;
        let otu_labels = actual_data.otu_labels;

        let tracedata = [{
            x: otu_ids,
            y: sample_values,
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            },
            text: otu_labels,
            mode: "markers"
        }]

        let layout = {
            title: "OTU"
        }
        Plotly.newPlot("bubble", tracedata, layout)
    })
}
// Using to apply the option changed
function optionChanged(value){
    getMetadata(value)
    getBarChart(value)
    getBubbleChart(value)
}

init();