var Util = {

  filterByProperty: function (array, prop, value) {
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var obj = array[i][j];
        if(obj[prop] == value) {
          return obj;
        }
      }
    }
  },

  arrayToJSON: function (array) {
    var json = {};
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var obj = array[i][j];
        json["Step_"+(i+1)+"_"+(j+1)] = obj.codeobj;
      }
    }
    return json;
  },

  getHierarchy: function(array, toolid) {
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var obj = array[i][j];
        if(obj["id"] == toolid) {
          return i;
        }
      }
    }
  },
  
  getHierarchyByName: function(array, toolname) {
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].length; j++) {
        var obj = array[i][j];
        if(obj["name"] == toolname) {
          return i;
        }
      }
    }
  },

  deleteById: function(array, id) {
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
  
  hasPath: function(array, path) {
    for (var i=0; i < array.length; i++) {
      if (array[i].path == path) {
          return true;
      }
    }
    return false;
  },

}

module.exports = Util;
