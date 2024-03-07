import './style.css';
import ApexCharts from 'apexcharts';
import Papa from 'papaparse'

const API_URL = 'https://stats-api.twelfth-monkey.com/';
const params = new URLSearchParams(window.location.search);
const id = params.get("id") || 'be04e65d-6977-4f28-8145-2618dd7e8d84';
const legLength = .5; //this is the length of the leg in meters for the current event. will need to be updated once we include this is a variable in the event data. 
const finishDistance = 25 // this is the overall length of the race for the whole team in kms. 




console.log(id);

// OPTIONS FOR LINE CHART
let options = {
  chart: {
    type: 'line',
    animations: {
      enabled: false
    },
    zoom: {
      enabled: false // disable zooming because of Safari bug
    },
    background: 'black',
  },
  grid: {
    padding: {
      top: 20,
      right: 70,
      bottom: 20,
      left: 20
    }
  },
  xaxis: {
    type: 'datetime',
      labels: {
        format: 'dd/MM/yyyy',
        // Optionally, specify the formatter function for more complex scenarios
      },
      // Additional xaxis configurations...
    },
    yaxis: {
      title: {
          text: 'Kms'
      },
      max: finishDistance,
      min: 0,
  },
  
  theme: {
    mode: 'dark'
  },
  legend: {
    show: true, 
    position: 'bottom',
  },
  tooltip: {
    x: {
      format: 'dd MM yyyy'
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

  annotations: {
    yaxis: [{
        y: finishDistance,
        borderColor: 'red',
        strokeWidth: 10,
        label: {
            borderColor: 'red',
            style: {
                color: 'white',
                background: 'red',
            },
            text: 'FINISH'
        }
    }],
    zIndex: 3, // This will draw the annotations on top of the grid lines

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
            fontSize: '20px'
          },

        },
          title: {
            text: 'Distance (km)',
            style: {

            fontSize: '20px',
            },
          },
          max: finishDistance,
          min: 0,
      },
      legend: {
        fontSize: '20px',
        
      },
      markers: {
        size: 10
      }
    }
  }]
};

fetch(`${API_URL}${id}`).then(res => res.json()).then(data => {
  const teamNames = new Set(); 
  let distanceDataByTeam = {};
  
  // // Sort data by event start date and calculate cumulative distances
  // data.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()).forEach(event => {
  //   teamNames.add(event.team);
  //   distanceDataByTeam[event.team] = distanceDataByTeam[event.team] || [];
  //   if (distanceDataByTeam[event.team].length > 0) {
  //     event.distance += distanceDataByTeam[event.team][distanceDataByTeam[event.team].length - 1][1];
  //   }
  //   distanceDataByTeam[event.team].push([new Date(event.start_date).getTime(), event.distance]);
  // });

  data.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()).forEach(event => {
    teamNames.add(event.team);
    distanceDataByTeam[event.team] = distanceDataByTeam[event.team] || [];
    // Calculate cumulative distance by adding 10m to the last event's distance
    const lastDistanceIndex = distanceDataByTeam[event.team].length - 1;
    const lastDistance = lastDistanceIndex >= 0 ? distanceDataByTeam[event.team][lastDistanceIndex][1] : 0;
    const cumulativeDistance = lastDistance + legLength;
    distanceDataByTeam[event.team].push([new Date(event.start_date).getTime(), cumulativeDistance]);
  });
  

  // data.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()).forEach(event => {
  //   teamNames.add(event.team);
  //   distanceDataByTeam[event.team] = distanceDataByTeam[event.team] || [];
  //   // Set each event's distance to 10m directly without cumulative addition
  //   distanceDataByTeam[event.team].push([new Date(event.start_date).getTime(), 10]);
  // });
  console.log('distanceDataByTeam');
  console.log(distanceDataByTeam);
  

  const line_series = Array.from(teamNames).map(team => ({
    name: team,
    data: distanceDataByTeam[team]
  }));

  console.log('line_series'); 
  console.log(line_series);


  let totalDistanceByTeam = {};

  // Iterate over each team in 'distanceDataByTeam'
  // for (let team in distanceDataByTeam) {
  //     // Sum the distances for the current team
  //     let sum = distanceDataByTeam[team].reduce((acc, item) => acc + item[1], 0);
      
  //     // Assign the sum to the corresponding team in the new object
  //     totalDistanceByTeam[team] = sum;
  // }
  
  for (let team in distanceDataByTeam) {
    // Get the last entry for the current team
    const lastEntry = distanceDataByTeam[team][distanceDataByTeam[team].length - 1];

    // Assign the last distance value to the corresponding team in the new object
    totalDistanceByTeam[team] = lastEntry[1]; // Assuming the distance is the second element in the entry
}
console.log('totalDistanceByTeam');
console.log(totalDistanceByTeam);

  const bar_series = Array.from(teamNames).map(team => ({
    name: team,
    // Sum the distance values for the team and wrap it in an array to conform to the expected data structure
    data: [totalDistanceByTeam[team]]
}));
  console.log('bar_series');
  console.log(bar_series);

  // Update options with the series data
  options.series = line_series;

 console.log(line_series);




var seriesData = bar_series;

// Chart options
var options3 = {
  chart: {
      type: 'bar',
      background: 'black',

  },
  grid: {
    padding: {
      top: 20,
      right: 70,
      bottom: 20,
      left: 20
    }
  },
  series: seriesData,
  plotOptions: {
      bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
      },
  },
  theme: {
    mode: 'dark'
  },
  annotations: {
    yaxis: [{
        y: finishDistance,
        borderColor: 'red',
        strokeWidth: 10,
        label: {
            borderColor: 'red',
            style: {
                color: 'white',
                background: 'red',
            },
            text: 'FINISH'
        }
    }],
  },
  dataLabels: {
      enabled: false
  },
  stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
  },
  xaxis: {
      categories: ['Teams'], // Adjust based on your data or requirements
  },
  yaxis: {
      title: {
          text: 'Kms'
      },
      max: finishDistance,
      min: 0,
  },
  
  fill: {
      opacity: 1
  },
  tooltip: {
      y: {
          formatter: function (val) {
              return val + " kms"
          }
      }
  },
  responsive: [{
    breakpoint: 1000,
    options: {
     
      xaxis: {
        labels: {
          style: {
            fontSize: '20px',
            
          }
        },
      },
      yaxis: {
        max: finishDistance,
        min: 0,
        labels: {
          style: {
            fontSize: '20px'
          }
        },
          title: {
            text: 'Distance (km)',
            style: {

            fontSize: '20px',
            },
          },

      },
      max: 1000,
      min: 0,
      
      
      markers: {
        size: 10
      },
      legend: {
        fontSize: '20px',
        
      },
    },
   
    }]
  
  };

  // Initialize chart
  var chart3 = new ApexCharts(document.querySelector("#chart3"), options3);
  chart3.render();
  // Render the line chart
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();


});
