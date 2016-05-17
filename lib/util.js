"use strict";

var Util = {

  filterByProperty: function filterByProperty(array, prop, value) {
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var obj = array[i][j];
        if (obj[prop] == value) {
          return obj;
        }
      }
    }
  },

  getHierarchy: function getHierarchy(array, toolid) {
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var obj = array[i][j];
        if (obj["id"] == toolid) {
          return i;
        }
      }
    }
  },

  getHierarchyByName: function getHierarchyByName(array, toolname) {
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var obj = array[i][j];
        if (obj["name"] == toolname) {
          return i;
        }
      }
    }
  },

  deleteById: function deleteById(array, id) {
    var toolid = id;
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var obj = array[i][j];
        if (obj["id"] == toolid) {
          array[i].splice(j, 1);
        }
      }
    }
  },

  hasPath: function hasPath(array, path) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].path == path) {
        return true;
      }
    }
    return false;
  }

};

module.exports = Util;