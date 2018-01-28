'use strict';

const makeJson = (suites) => suites.map(({ name, benchmarks }) => 

  benchmarks.reduce((set,{name,hz})=> Object.assign(set,{[name]:hz}),{name})
);

const JsonData = makeJson(rawData.suites);

const charts = JsonData.map((data,i) => { 
  c3.generate({
    bindto: '#chart-' + i,
    data: {
      json: [data],
      type: 'bar',
      keys: {
        x: 'name',
        value: Object.keys(data).slice(1)
      },
    },
    axis: {
        x: {
            type: 'category'
        }
    }
  });
});


c3.generate({
  bindto: '#chart',
  data: {
    json: JsonData,
    type: 'bar',
    keys: {
      x: 'name',
      value: Object.keys(JsonData[0]).slice(1)
    },
  },
  axis: {
      x: {
          type: 'category'
      }
  }
});