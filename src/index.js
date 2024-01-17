import './style.css';

import ApexCharts from 'apexcharts';

const API_URL = 'https://qyjbcjs0x7.execute-api.ap-southeast-2.amazonaws.com/dev/';

const params = new URLSearchParams(window.location.search);
const id = params.get("id") || '725c0cb7-cc43-4049-a908-e71e3679b547';

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


fetch(`${API_URL}${id}`).then(res => res.json()).then(data => {

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
    distanceDataByTeam[event.team].push([new Date(event.start_date).getTime(), event.distance]);
  });

  const series = [];
  teamNames.forEach(team => {
    series.push({
      name: team,
      data: distanceDataByTeam[team]
    });
  });
  const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
  if (width < 1000) {
    options.tooltip.style.fontSize = '30px';
  }
  options.series = series;
  var chart = new ApexCharts(document.querySelector("#chart"), options);

  chart.render();
});