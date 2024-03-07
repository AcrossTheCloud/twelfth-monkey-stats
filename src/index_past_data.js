import './style.css';
import ApexCharts from 'apexcharts';
import Papa from 'papaparse'; // Make sure you import Papa Parse

const legLength = 500; // This is the length of the leg in meters for the current event.
const start_date = new Date('2024-02-01');


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
    max: 250000,
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
          max: 250000,
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


// Function to process CSV data
function processData(data) {
  console.log('data')
console.log(data)
  const teamNames = new Set(); 
  let distanceDataByTeam = {};
  

  
  data.forEach(event => {
    teamNames.add(event.team);
    distanceDataByTeam[event.team] = distanceDataByTeam[event.team] || [];
    const lastDistanceIndex = distanceDataByTeam[event.team].length - 1;
    const lastDistance = lastDistanceIndex >= 0 ? distanceDataByTeam[event.team][lastDistanceIndex][1] : 0;
    const cumulativeDistance = lastDistance + legLength;

    let excelDateString = event.timestamp; // Assuming DD-MM-YYYY HH:mm format
    let parts = excelDateString.split(/[/ :]/);
    // Assuming parts = ["31", "01", "2020", "15", "00"]

    let date = new Date(Date.UTC(parts[2], parts[0] - 1, parts[1], parts[3], parts[4]));
    let isoDateString = date.toISOString();

    distanceDataByTeam[event.team].push([isoDateString, cumulativeDistance]);
  });

  const line_series = Array.from(teamNames).map(team => ({
    name: team,
    data: distanceDataByTeam[team]
  }));

  console.log('distanceDataByTeam', distanceDataByTeam)

  let totalDistanceByTeam = {};
  for (let team in distanceDataByTeam) {
    const lastEntry = distanceDataByTeam[team][distanceDataByTeam[team].length - 1];
    totalDistanceByTeam[team] = lastEntry[1];
  }

  const bar_series = Array.from(teamNames).map(team => ({
    name: team,
    data: [totalDistanceByTeam[team]]
  }));

  // Update options with the series data

  console.log('line_series', line_series)
  options.series = line_series;

  // Initialize and render the charts
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
  
  // Update the bar chart series data and re-render
  var options3 = {
    // Your existing bar chart configuration
    series: bar_series, // Update the series data for the bar chart
  };

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
  series: bar_series,
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
      max: 250000,
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
        max: 250000,
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

  var chart3 = new ApexCharts(document.querySelector("#chart3"), options3);
  chart3.render();
}

// Parse CSV data using Papa Parse
// Papa.parse("/CSVs/DIII.csv", {
//   download: true,
//   header: true,
//   complete: function (results) {
//     console.log(results);
//     processData(results.data); // Call processData with the parsed data
//   }
// });
