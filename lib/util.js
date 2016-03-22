'use strict';

var Util = {

  filterByProperty: function (array, prop, value) {
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var obj = array[i][j];
        if (obj[prop] == value) {
          return obj;
        }
      }
    }
  },

  getHierarchy: function (array, toolid) {
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var obj = array[i][j];
        if (obj["id"] == toolid) {
          return i;
        }
      }
    }
  },

  deleteById: function (array, id) {
    var toolid = id;
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var obj = array[i][j];
        if (obj["id"] == toolid) {
          array[i].splice(j, 1);
        }
      }
    }
  }

};

module.exports = Util;