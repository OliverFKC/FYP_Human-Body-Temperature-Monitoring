// pages/lanyatest/lanyatest.js   // servicesUUID:"0000FF00-0000-1000-8000-00805F9B34FB",
// Get temperature data from the cache
let ambient, obj;
const objTag = "65,63,74,3a,20";
const ambientTag = "41,6d,62,69,65,6e,74,3a,20";
try {
  const value = wx.getStorageSync('obj');
  if (value) {
    obj = value;
  } else {
    obj = [];
  }
} catch (e) {
  console.log(e);
  obj = [];
}

try {
  const value = wx.getStorageSync('ambient')
  if (value) {
    ambient = value;
  } else {
    ambient = [];
  }
} catch (e) {
  console.log(e);
  v = [];
}

// Introduction of time handling methods
const { formatTime } = require('../../utils/util');

Page
({
  data: 
  {
    info:"",                // Display Box
    devices:"",             // All searched Bluetooth devices
    connectedDeviceId:"",   // ID of the connected device
    services: "" ,          // Services of the connected device
    notifyCharacteristicsId: "0000FEE1-0000-1000-8000-00805F9B34FB", // Notifying UUID, obtained according to the Bluetooth module
    writeCharacteristicsId:  "0000FEE2-0000-1000-8000-00805F9B34FB", // Writing UUID, obtained according to the Bluetooth module
  },
 
  
  /****************1. Initialize the Bluetooth adapter**************/
  BLEInit(event)
  {
      var that = this;
      wx.openBluetoothAdapter
      ({
          success: function (res) 
          {
            console.log('succeed in initializing the Bluetooth Adapter.')
            that.setData
            ({
              info: 'succeed in initializing the Bluetooth Adapter.'
            })
          },
          fail: function (res) 
          {
            console.log('Please turn on the positioning.')
            that.setData
            ({
              info: 'Please turn on the positioning.'
            })
          }
      })
  },

  /****************2. Get Bluetooth adaption status***************/
  BLEState(event)
  {
    var that = this;
    wx.getBluetoothAdapterState
    ({
        success: function (res) 
        {
          // Print related information
          console.log(JSON.stringify(res.errMsg) + "\nIf the Bluetooth is ready：" + res.available);
          that.setData
          ({
              info: JSON.stringify(res.errMsg) +"\nIf the Bluetooth is ready：" + res.available
          })
        },

        fail: function (res) 
        {
          // Print related information
          console.log(JSON.stringify(res.errMsg) + "\nIf the Bluetooth is ready：" + res.available);
          that.setData
          ({
              info: JSON.stringify(res.errMsg) + "\nIf the Bluetooth is ready：" + res.available
          })
        }
    })
  },

  /****************3. Search for Bluetooth devices**************/
  BLESearch(event)
  {
    var that = this;
    wx.startBluetoothDevicesDiscovery
    ({
      // services: ['0000180A-0000-1000-8000-00805F9B34FB'],  
        services: ['0000FFE0-0000-1000-8000-00805F9B34FB'], // only the device with this specific service can be found
        success: function (res) 
        {
          that.setData
          ({
              info: "Search for peripherals" + JSON.stringify(res),
          })
          console.log('Search for peripherals and return' + JSON.stringify(res))
        }
    })
  },

  /****************4. Get Bluetooth devices***************/
  BLEGetDevices(event)
  {
    var that = this;
    wx.getBluetoothDevices
    ({
        success: function (res) 
        {
          that.setData
          ({
            info: "Peripherals list\n" + JSON.stringify(res.devices),
            devices: res.devices
          })

          console.log('Number of peripherals：' + res.devices.length)
          console.log('Information of peripherals：\n' + JSON.stringify(res.devices)+"\n")
        }
    })
  },

   /****************5. Connect Bluetooth device***************/
  BLEConnect(event)
  {
    var that = this;
    wx.createBLEConnection
    ({
      deviceId: event.target.id,
      success: function (res) 
      {
        console.log('Debugging information：' + res.errMsg);
        that.setData
        ({
          connectedDeviceId: event.currentTarget.id,
          info: "MAC address：" + event.currentTarget.id  + '  Debugging information：' + res.errMsg,
        })
        console.log('ok connected with '+event.currentTarget.id);
      },
      fail: function () 
      {
        console.log("connection lost");
      },
    })
  },

  /****************6. Stop searching Bluetooth devices***************/
  BLESearchStop(event)
  {
    var that = this;
    wx.stopBluetoothDevicesDiscovery
    ({
      success: function (res) 
      {
        console.log("stop searching" + JSON.stringify(res.errMsg));
        that.setData
        ({
          info: "stop searching"  + JSON.stringify(res.errMsg),
        })
      }
    })
  },

  /****************7.Get Bluetooth device service***************/
  BLEGetservice(event)
  {
    var that = this;
    wx.getBLEDeviceServices
    ({
      // The deviceId should be obtained in the getBluetoothDevices or onBluetoothDeviceFound interface above.
      deviceId: that.data.connectedDeviceId,
      success: function (res) 
      {
        console.log('services UUID:\n', JSON.stringify(res.services));
        var myserviceid;
        for (var i = 0; i < res.services.length; i++) 
        {
          console.log("number " + (i+1) + " UUID: " + res.services[i].uuid+"\n")
          if (res.services[i].uuid == '0000FFE0-0000-1000-8000-00805F9B34FB') {
            console.log("use service "+res.services[i].uuid);
            myserviceid = res.services[i].uuid;
          }
        }
        that.setData
        ({
          services: res.services,
          info: JSON.stringify(res.services),
          servicesUUID: myserviceid,
        })
      }
    })
  },
 
/****************8. Get Bluetooth Device Chracteristics***************/
BLEGetCharacteristics(event)
{
  var that = this;
  var myUUID = that.data.servicesUUID;// Service uuid with read, write, notification, and attributes
  console.log('UUID' + myUUID)
  wx.getBLEDeviceCharacteristics
  ({
    // The deviceId here needs to be retrieved from getBluetoothDevices above
    deviceId: that.data.connectedDeviceId,
    // The serviceId here is obtained in the getBLEDeviceServices interface above
    serviceId: myUUID,
    success: function (res)
    {
      console.log("%c getBLEDeviceCharacteristics", "color:red;");

      for (var i = 0; i < res.characteristics.length; i++) 
      {
        console.log('Characteristics：' + res.characteristics[i].uuid)
        if (res.characteristics[i].properties.notify) 
        {
          console.log("Take the ServicweId with notify enabled：", myUUID);  
          console.log("Take the CharacteristicsId with notify enabled：", res.characteristics[i].uuid);
          that.setData({
            notifyServicweId: myUUID,
            notifyCharacteristicsId: res.characteristics[i].uuid,
            //notifyCharacteristicsId: "0000FF01-0000-1000-8000-00805F9B34FB",
          })
          //console.log("print notifyCharacteristicsId")
          //console.log(that.data.notifyCharacteristicsId)
        }

        if (res.characteristics[i].properties.write)
        {
            console.log("Take the ServicweId with write enabled: ", myUUID);
            console.log("Take the CharacteristicsId with write enabled:: ", res.characteristics[i].uuid);
            that.setData({
              writeServicweId: myUUID,
              writeCharacteristicsId: res.characteristics[i].uuid,
              //writeCharacteristicsId: "0000FF02-0000-1000-8000-00805F9B34FB", 
            })
        }
        else if (res.characteristics[i].properties.read)
        {
          console.log("Take the ServicweId with read enabled: ", myUUID);
          console.log("Take the CharacteristicsId with read enabled: ", res.characteristics[i].uuid);
          that.setData({
            readServicweId: myUUID,
            readCharacteristicsId: res.characteristics[i].uuid,
          })
        }
        //console.log('device getBLEDeviceCharacteristics:', JSON.stringify(res.characteristics));
       }
      console.log('device getBLEDeviceCharacteristics:', res.characteristics);
      that.setData({
        msg: JSON.stringify(res.characteristics),
      })
    },
    fail: function () 
    {
      console.log("Get characteristics failure. ");
    },

    complete: function()
    {
      console.log("Get characteristics done. ");
    }
  })
},


  /****************9. Notify characteristics change***************/
  BLECharacteristicValueChange(event)
  {
    var that = this;
    var notifyServicweId = that.data.servicesUUID;  // Service uuid with write, notification attributes
    var notifyCharacteristicsId = that.data.notifyCharacteristicsId;
    console.log("Take the ServicweId with notify enabled：", notifyServicweId);
    console.log("Take the CharacteristicsId with notify enabled：", notifyCharacteristicsId);

    // console.log("NotifyCharacteristicsId enabled", that.data.notifyCharacteristicsId);
     wx.notifyBLECharacteristicValueChange
    ({
      state: true,
      deviceId: that.data.connectedDeviceId,
      serviceId: notifyServicweId,
      //serviceId: that.data.services[0].uuid,
      characteristicId: that.data.notifyCharacteristicsId,
      success: function (res) 
      {
        console.log('notifyBLECharacteristicValueChange success', res.errMsg)
        var msg = 'notify enabled: ' + res.errMsg
        that.setData({
          info: msg
        })
      },
      fail: function () 
      {
        console.log('notify enabled: ' + res.errMsg);
      },
      
    })
  },


  /****************10. Received data***************/
  BLEDataRecieve(event)
  {
    var that = this;
    console.log("Start to receive data ");


    console.log('ambientNow' ,ambient);
    console.log('objectNow', obj);

    wx.onBLECharacteristicValueChange
    (
      function (res) 
      {
        //console.log("characteristicId：" + res.characteristicId)
        //console.log("serviceId:" + res.serviceId)
        //console.log("deviceId" + res.deviceId)
        console.log('res', res);
        console.log("Length:" + res.value.byteLength)
        console.log(res.value)
        console.log("hexvalue:" + ab2hex(res.value))
        const hexvalue = ab2hex(res.value);
        // Store data
        if(hexvalue.includes(objTag)) {
          let objT = hexvalue.split(',');
          if (objT.length === 15) {
            objT = Number(objT.slice(8,13).map(x => hexCharCodeToStr(x)).join(''));
          } else if (objT.length === 14) {
            objT = Number(objT.slice(7,12).map(x => hexCharCodeToStr(x)).join(''));
          }

          if (objT > 35.5) {
            wx.showToast({
              title: '35.5 °C Warning',
              icon: 'error',
              duration: 1000,
              mask:true
            })
          }

          const newData = {
            datas: objT,
            dates: formatTime(new Date()),
          }
          obj.push(newData);
          try {
            wx.setStorageSync('obj', obj);
          } catch (e) { }
        } else if(hexvalue.includes(ambientTag)) {
          const ambientT = Number(hexvalue.split(',').slice(11,16).map(x => hexCharCodeToStr(x)).join(''));
          const newData = {
            datas: ambientT,
            dates: formatTime(new Date()),
          }
          ambient.push(newData);
          try {
            wx.setStorageSync('ambient', ambient);
          } catch (e) { }
        }

        console.log('ambient', ambient);
        console.log('object', obj);



        that.setData
        ({
          info: that.data.info + ab2hex(res.value)
        })
      }
    )
  },

/****************11. Bluetooth sends data***************/
  //BLEDataSend(event)
  //{
  //  var that = this
   // var hex = that.data.sendmsg  // Information needs to be sent

   // console.log('The information needs to be sent：'+hex)

   // var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
   //   return parseInt(h, 16)
  //  }))

   // console.log(typedArray)

  //  var buffer1 = typedArray.buffer

   // wx.writeBLECharacteristicValue
   // ({
    //  deviceId: that.data.connectedDeviceId,
    //  serviceId: that.data.services[0].uuid,
    //  characteristicId: that.data.writeCharacteristicsId,

    // The value here is of type ArrayBuffer
    //  value: buffer1,

    //  success: function (res) 
   //   {
     //   console.log('write success', res.errMsg)
    //  },
    //  fail(res)
    //  {
     //   console.log('write fail', res.errMsg)
   //   }
  //  })
 // },

  /****************Visualization page***************/
  jumpToCharts (options) {
    wx.navigateTo({
      url: '../charts/index',
    })
  },
 
  /****************12. Disconnect Bluetooth connection***************/
  BLEDisconnect(event)
  {
    var that = this;
    wx.closeBLEConnection
    ({
        deviceId: that.data.connectedDeviceId,
        success: function (res) 
        {
          that.setData
          ({
            connectedDeviceId: "",
          })
          console.log('Disconnect success：' + res.errMsg)
        },
        fail:function(res)
        {
          console.log('Disconnect fail：' + res.errMsg)
        }
    })
  },


  /****************13. clear storage data***************/
clearStorage(){
  try{
    wx.setStorageSync('ambient', []);
  } catch (e) {}
  try{
    wx.setStorageSync('obj', []);
  } catch (e) {}
  wx.showToast({
    title: 'succeed clearing',
    icon: 'success',
    duration: 1000,
    mask:true
  })
 },

  // enter the value
   getmsg(event){
    this.setData({
      sendmsg:event.detail.value
    })
  },
})


// ArrayBuffer to hexadecimal 
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join(',');
}

// hexadecimal to ASCII
function hexCharCodeToStr(hexCharCodeStr) {
  var trimedStr = hexCharCodeStr.trim();
  var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
      alert("Presnece of illegal charaters!");
      return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16);
      resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}
