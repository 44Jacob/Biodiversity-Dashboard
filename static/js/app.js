const optionChanged = id => {
    console.log(id);

    d3.json("samples.json").then(({metadata, samples}) => {
        let meta = metadata.find(dict => dict.id == id);
        
        let {otu_ids, sample_values, otu_labels} = samples.find(dict => dict.id == id);

        // Demographic
        d3.select("#sample-metadata").html("");
        Object.entries(meta).forEach(([key,val]) => {
            d3.select('#sample-metadata').append('h5').text(`${key.toUpperCase()}: ${val}`);
        });
        
        // Bar Chart
        var data = [
            {
              x: sample_values.slice(0,10).reverse(),
              y: otu_ids.slice(0,10).reverse().map(x => `OTU ${x}`),
              text: otu_labels.slice(0,10).reverse(),
              type: 'bar',
              orientation: 'h'
            }
          ];
          
          Plotly.newPlot('bar', data);

        //  Bubble Chart
        var trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels, 
            mode: 'markers',
            marker: {
              size: sample_values, 
              color: otu_ids,
              colorscale: "Earth"
            }
          };
          
          var data = [trace1];
          
          Plotly.newPlot('bubble', data);

        //  Gauge
        var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: meta.wfreq,
              title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week " },
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 400 },
              gauge: { axis: { range: [null, 10] } }
            }
          ];
          
          var layout = { width: 600, height: 400 };
          Plotly.newPlot('gauge', data);


        console.log(otu_ids,sample_values,otu_labels);
    })
};

d3.json('samples.json').then(({names}) => {
    names.forEach(id => {
        d3.select('select').append('option').text(id);
    });

    optionChanged(names[0])
})