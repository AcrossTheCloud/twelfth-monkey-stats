import './style.css';

import ApexCharts from 'apexcharts';

import Papa from 'papaparse';



const API_URL = 'https://qyjbcjs0x7.execute-api.ap-southeast-2.amazonaws.com/dev/';

const params = new URLSearchParams(window.location.search);
const id = params.get("id") || 'abb8199e-0ff0-4972-8335-1c20704caf24';

//OPTIONS FOR LINE CHART
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


// Create a new chart instance

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

  const line_series = [];
  const bar_series = [];

  teamNames.forEach(team => {
    line_series.push({
      name: team,
      data: distanceDataByTeam[team]
    });
    bar_series.push({
      name: team,
      data: distanceDataByTeam[team].map(item => item[1]) // only include the distance values
    });
  });


  

  // find the minimum timestamp in the series
  const minTimestamp = Math.min(...line_series.map(s => s.data[0][0]));

  // find the maximum datetime in the series
  const maxTimestamp = Math.max(...line_series.map(s => s.data[s.data.length - 1][0]));
  let results = [];


  /*
  await Papa.parse("/CSVs/2020_results.csv", {
    download: true,
    header: true,
    complete: function(results) {
      console.log(results);


      // Extract team names and final distances from results.data
    let teamNames = [...new Set(results.data.map(r => r.team))];
    let finalDistances = teamNames.map(team => {
      let teamData = results.data.filter(r => r.team === team);
      return teamData[teamData.length - 1].distance; // get the last distance
    });


 */





//END OF NEW BAR CHART CODE
/*
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
      */

      // find the minimum timestamp in the results array
     // const prevMinTimestamp = Math.min(...results.data.map(r => r.timestamp));

      // calculate the difference between minTimestamp and minDate
      //const diff = minTimestamp - prevMinTimestamp;

      /*
      // add diff to each timestamp in the results array
      results.data.forEach(r => {
        r.timestamp += diff;
      });
      */

/*
      //console.log(results.data);

      // remove all data from the results where the timestamp is greater than maxTimestamp
      results.data = results.data.filter(r => r.timestamp <= maxTimestamp);

      // sort the results by timestamp
      results.data.sort((a, b) => a.timestamp - b.timestamp);
      */

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
        line_series.push({
          name: team,
          data: prevDistanceDataByTeam[team]
        });
        console.log('prevDistanceDataByTeam[team]');
        console.log(prevDistanceDataByTeam[team]);

        bar_series.push({
          name: team,
          data: prevDistanceDataByTeam[team].map(item => item[1]) // only include the distance values
        });
      });
      console.log('linedata');
      console.log(line_series);
      console.log('bardata');
      console.log(bar_series);
      chart.render();

      //OPTIONS FOR BAR CHART

let categories = bar_series.map(item => item.name);
console.log('categories'); // print the categories array to the console


console.log(bar_series); // print the bar_series array to the console

console.log('categories_delayed'); // print the categories array to the console

setTimeout(() => {
  let categories = bar_series.map(item => item.name);
  console.log('categories_delayed',categories); // print the categories array to the console
}, 1000); // delay of 1 second


let options2 = {
  chart: {
    type: 'bar', // change to 'bar' for horizontal bar chart
    animations: {
      enabled: false
    },
    zoom: {
      enabled: false // disable zooming because of Safari bug
    }
  },
  plotOptions: {
    bar: {
      horizontal: false, // this makes the bar chart horizontal
    },
  },
  
  series: bar_series, 
  
  xaxis: {
    type: 'category',
    categories: bar_series.map(item => item.name), // extract the team names from your data
    labels: {
      style: {
        fontSize: '8px'
      }
    }
  },
  theme: {
    mode: 'dark'
  },
  legend: {
    show: true,
    position: 'top',
  },
  tooltip: {
    y: {
      formatter: function (value) {
        return value.toFixed(2) + ' km';
      }
    },
    style: {
      fontSize: '8px'
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '50%', // adjust as needed
    },
  },
  responsive: [{
    breakpoint: 1000,
    options: {
      xaxis: {
        labels: {
          style: {
            fontSize: '8px'
          }
        },
      },
      
    }
  }]
};

options2.series = bar_series

    let chartBAR = new ApexCharts(document.querySelector("#barChart"), options2);
    chartBAR.render();


  

  const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
  if (width < 1000) {
    options.tooltip.style.fontSize = '30px';
  }



  options.series = line_series
  console.log('bar_series')
  console.log(bar_series)
  var chart = new ApexCharts(document.querySelector("#chart"), options);









// Render the chart




}); 