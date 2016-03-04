var fs = require('fs');

var ToolLoader = {
  load: function(path) {
    var obj = JSON.parse(fs.readFileSync(path));
    
  }
}

module.exports = ToolLoader;
