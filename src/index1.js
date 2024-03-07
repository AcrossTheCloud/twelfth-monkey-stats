import './style.css';
import ApexCharts from 'apexcharts';

const API_URL = 'https://qyjbcjs0x7.execute-api.ap-southeast-2.amazonaws.com/dev/';
const params = new URLSearchParams(window.location.search);
const id = params.get("id") || '9ff9bea3-2e05-412d-a5f9-1621fa4d03e9';
const legLength = 500; //this is the length of the leg in meters for the current event. will need to be updated once we include this is a variable in the event data. 
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
    datetimeFormatter: {
      year: 'yyyy',
      month: "MMM 'yy",
      day: 'dd MMM',
      hour: 'HH:mm'
    },
  },
  yaxis: {  
    max: 1000,
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

  annotations: {
    yaxis: [{
        y: 500,
        borderColor: '#00E396',
        strokeWidth: 10,
        label: {
            borderColor: '#00E396',
            style: {
                color: '#fff',
                background: '#00E396',
            },
            text: 'FINISH'
        }
    }],
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
          },

        },
          title: {
            text: 'Distance (m)',
            style: {

            fontSize: '30px',
            },
          },
          max: 1000,
          min: 0,
      },
      legend: {
        fontSize: '30px',
        
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
        y: 500,
        borderColor: '#00E396',
        strokeWidth: 10,
        label: {
            borderColor: '#00E396',
            style: {
                color: '#fff',
                background: '#00E396',
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
          text: 'Values'
      },
      max: 1000,
      min: 0,
  },
  
  fill: {
      opacity: 1
  },
  tooltip: {
      y: {
          formatter: function (val) {
              return val + " units"
          }
      }
  },
  responsive: [{
    breakpoint: 1000,
    options: {
     
      xaxis: {
        labels: {
          style: {
            fontSize: '30px',
            
          }
        },
      },
      yaxis: {
        max: 1000,
        min: 0,
        labels: {
          style: {
            fontSize: '30px'
          }
        },
          title: {
            text: 'Distance (m)',
            style: {

            fontSize: '30px',
            },
          },

      },
      max: 1000,
      min: 0,
      
      
      markers: {
        size: 10
      },
      legend: {
        fontSize: '30px',
        
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

console.log(options3)

});
