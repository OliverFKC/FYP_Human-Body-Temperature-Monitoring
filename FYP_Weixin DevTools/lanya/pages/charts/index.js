// charts.js
import * as echarts from '../../ec-canvas/echarts';
let ambient, obj;
try {
  const value = wx.getStorageSync('ambient');
  if (value) {
    ambient = value;
  } else {
    ambient = [];
  }
} catch (e) {
  console.log(e);
  ambient = [];
}

try {
  const value = wx.getStorageSync('obj')
  if (value) {
    obj = value;
  } else {
    obj = [];
  }
} catch (e) {
  console.log(e);
  obj = [];
}
console.log('ambient' ,ambient);
console.log('objects', obj);
let chartLine;

Page({
  data: {
      ecLine: {
          onInit: function (canvas, width, height){
              // Initialize the echarts element and bind it to a global variable to facilitate data changes
              chartLine = echarts.init(canvas, null, {
                  width: width,
                  height: height,
                  devicePixelRatio: getPixelRatio()
              });
              canvas.setChart(chartLine);

              // No need to setOption first, wait for the data to be loaded and assign the value.
              // But that did not setOption before, echats element is a blank, experience is not good, all I set first.
              var option = getOption();
              chartLine.setOption(option);
              return chartLine;
          }
      },
      timer: 0,
      ambients: ambient.map(x => x.datas).pop(),
      objects: obj.map(x => x.datas).pop(),
  },

    onLoad: function(option) {   
    const _this = this;
    this.setData({                    // Refresh every one second
        timer: setInterval(function () {
          try {
            const value = wx.getStorageSync('ambient');
            if (value) {
              ambient = value;
            } else {
              ambient = [];
            }
          } catch (e) {
            console.log(e);
            ambient = [];
          }
          
          try {
            const value = wx.getStorageSync('obj')
            if (value) {
              obj = value;
            } else {
              obj = [];
            }
          } catch (e) {
            console.log(e);
            obj = [];
          }
        // console.log(ambient)
        const option = getOption();
        chartLine.setOption(option);
        _this.setData({
          ambients: ambient.map(x => x.datas).pop() || 0,
          objects: obj.map(x => x.datas).pop() || 0
        })
      }, 1000)
    })
  },

  onUnload: function(option) {
    clearInterval(timer);
  }
})

function getOption() {
  var option = {
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: 'Temperature: {c}°\nTime: {b}',
    },
    legend: {
        data: ['Object Temperature', 'Ambient Temperature']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    dataZoom:[{
        type: 'slider',// Telescoping bar below the chart
        show : true, // Whether to display
      　realtime : true, // Whether the view of the series is updated in real time when dragging
      　start : 0, // Retractable bar start position (1-100), can be changed at any time
      　end : 100, // Retractable bar end position (1-100), can be changed at any time
    }],    
    xAxis: {
        name: 'Time',
        type: 'category',
        boundaryGap: true,
        data: obj.map(x => x.dates),
        axisLabel: {
          formatter: function(value, index) {
            return index;
          }
        }
    },
    yAxis: {
        type: 'value',
        min: 24,
        max: 40,
    },
    series: [
        {
            name: 'Object Temperature',
            type: 'line',
            data: obj.map(x => x.datas)
        },
        {
            name: 'Ambient Temperature',
            type: 'line',
            data: ambient.map(x => x.datas)
        },
    ]
  };
  return option;
}

const getPixelRatio = () => {
  let pixelRatio = 0
  wx.getSystemInfo({
    success: function (res) {
      pixelRatio = res.pixelRatio
    },
    fail: function () {
      pixelRatio = 0
    }
  })
  return pixelRatio
}