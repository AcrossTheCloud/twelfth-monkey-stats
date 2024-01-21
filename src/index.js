import './style.css';

import ApexCharts from 'apexcharts';

import Papa from 'papaparse';

const API_URL = 'https://qyjbcjs0x7.execute-api.ap-southeast-2.amazonaws.com/dev/';

const params = new URLSearchParams(window.location.search);
const id = params.get("id") || '31c38fdc-43df-4b1d-a9f6-93c32968667b';

let options = {
  chart: {
    type: 'line',
    animations: {
      enabled: false
    },
    zoom: {
      enabled: false // disable zooming because of Safari bug
    }
  },
  xaxis: {
    type: 'datetime',
    datetimeFormatter: {
      year: 'yyyy',
      month: "MMM 'yy",
      day: 'dd MMM',
      hour: 'HH:mm'
    },
  },
  theme: {
    mode: 'dark'
  },
  legend: {
    show: true,
    position: 'top',
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy'
    },
    y: {
      formatter: function (value) {
        return value.toFixed(2) + ' km';
      }
    },
    style: {
      fontSize: '11px'
    }
  },
  markers: {
    size: 5,
  },
  responsive: [{
    breakpoint: 1000,
    options: {
      xaxis: {
        labels: {
          style: {
            fontSize: '30px'
          }
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '30px'
          }
        },
      },
      legend: {
        fontSize: '30px'
      },
      markers: {
        size: 10.
      }
    }
  }]
}


fetch(`${API_URL}${id}`).then(res => res.json()).then(async (data) => {
  
  const teamNames = new Set(); 
  let distanceDataByTeam ={};
  
  // sort data by (new Date(event.start_date).getTime())
  data.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()).forEach(event => {
    teamNames.add(event.team);
    distanceDataByTeam[event.team] = distanceDataByTeam[event.team] || []
    // calculate cumulative distance
    if (distanceDataByTeam[event.team].length > 0) {
      event.distance += distanceDataByTeam[event.team][distanceDataByTeam[event.team].length - 1][1];
    }
    console.log('datetime', new Date(event.start_date).getTime());
    distanceDataByTeam[event.team].push([new Date(event.start_date).getTime(), event.distance]);
  });

  const series = [];

  teamNames.forEach(team => {
    series.push({
      name: team,
      data: distanceDataByTeam[team]
    });
  });
  

  // find the minimum timestamp in the series
  const minTimestamp = Math.min(...series.map(s => s.data[0][0]));

  // find the maximum datetime in the series
  const maxTimestamp = Math.max(...series.map(s => s.data[s.data.length - 1][0]));

  await Papa.parse("/CSVs/2020_results.csv", {
    download: true,
    header: true,
    complete: function(results) {
      console.log(results);

      // prepend each object.team with `'20 `
      results.data.forEach(r => {
        r.team = `'20 ${r.team}`;
      });
      
      console.log(results.data);

      // convert each object.timestamp to a Unix timestamp in the results array
      results.data.forEach(r => {
        r.timestamp = new Date(r.timestamp).getTime();
      }); 

      // convert each object.distance to a number in the results array
      results.data.forEach(r => {
        r.distance = parseFloat(r.distance);
      });


      console.log(results.data);

      // find the minimum timestamp in the results array
      const prevMinTimestamp = Math.min(...results.data.map(r => r.timestamp));

      // calculate the difference between minTimestamp and minDate
      const diff = minTimestamp - prevMinTimestamp;

      // add diff to each timestamp in the results array
      results.data.forEach(r => {
        r.timestamp += diff;
      });


      //console.log(results.data);

      // remove all data from the results where the timestamp is greater than maxTimestamp
      results.data = results.data.filter(r => r.timestamp <= maxTimestamp);

      // sort the results by timestamp
      results.data.sort((a, b) => a.timestamp - b.timestamp);

      const prevTeamNames = new Set(); 
      let prevDistanceDataByTeam ={};

      results.data.forEach(event => {
        prevTeamNames.add(event.team);
        prevDistanceDataByTeam[event.team] = prevDistanceDataByTeam[event.team] || []
        // calculate cumulative distance
        if (prevDistanceDataByTeam[event.team].length > 0) {
          event.distance += prevDistanceDataByTeam[event.team][prevDistanceDataByTeam[event.team].length - 1][1];
        }
        prevDistanceDataByTeam[event.team].push([event.timestamp, event.distance]);
      });

      prevTeamNames.forEach(team => {
        series.push({
          name: team,
          data: prevDistanceDataByTeam[team]
        });
      });

      options.series = series;
      chart.render();

    }
  });

  const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
  if (width < 1000) {
    options.tooltip.style.fontSize = '30px';
  }

  options.series = series

  var chart = new ApexCharts(document.querySelector("#chart"), options);

});