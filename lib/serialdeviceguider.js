var DeviceGuider = require('./deviceguider')
  , util = require('util')
  , _ = require('lodash');

/**
 * A serialdeviceguider emits 'plug' for new attached serial devices,
 * 'unplug' for removed serial devices, emits 'connect' for connected serial devices
 * and emits 'disconnect' for disconnected serial devices.
 * @param {SerialDeviceLoader} deviceLoader The deviceloader object.
 */
function SerialDeviceGuider(deviceLoader) {
    var self = this;

    // call super class
    DeviceGuider.call(this, deviceLoader);

    this.currentState.getDeviceByPort = function(port) {
        return _.find(self.currentState.plugged, function(d) {
            return d.get('portName') === port;
        });
    };
    
    this.currentState.getConnectedDeviceByPort = function(id) {
        return _.find(self.currentState.connected, function(dc) {
            return dc.get('portName') === port;
        });
    };
}

util.inherits(SerialDeviceGuider, DeviceGuider);

/**
 * It will connect that device and call the callback.
 * @param  {String}   port      The Com Port path or name for Windows.
 * @param  {Function} callback  The function, that will be called when the device is connected. [optional]
 *                              `function(err, connection){}` connection is a Connection object.
 */
SerialDeviceGuider.prototype.connect = function(port, callback) {
    this.connectDevice(new this.deviceLoader.Device(port), callback);
};

/**
 * It will connect that device and call the callback.
 * @param  {String}   port      The Com Port path or name for Windows.
 * @param  {Function} callback  The function, that will be called when the device is disconnected. [optional]
 *                              `function(err, connection){}` connection is a Connection object.
 */
SerialDeviceGuider.prototype.disconnect = function(port, callback) {
    var device = this.currentState.getConnectedDeviceByPort(port);
    this.disconnectDevice(device, callback);
};

module.exports = SerialDeviceGuider;