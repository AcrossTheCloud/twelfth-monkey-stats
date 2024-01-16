import './style.css';

import ApexCharts from 'apexcharts';

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
    type: 'datetime'
  },
  theme: {
    mode: 'dark' 
  },
  legend: {
    show: true,
    position: 'top'
  },
  markers: {
    size: 5,
  },
}


fetch('https://qyjbcjs0x7.execute-api.ap-southeast-2.amazonaws.com/dev/725c0cb7-cc43-4049-a908-e71e3679b547').then(res => res.json()).then(data => {

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
  options.series = series;
  var chart = new ApexCharts(document.querySelector("#chart"), options);

  chart.render();
});