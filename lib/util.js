Util = {
  filterByProperty: function (array, prop, value) {
    var filtered = [];
    for (var i = 0; i < array.length; i++) {
      var obj = array[i];
      for (var key in obj) {
        if (typeof (obj[key] == "object")) {
          var item = obj[key];
          if (item[prop] == value) {
            filtered.push(item);
          }
        }
      }
    }
    return filtered;
  }
};

module.exports = Util;