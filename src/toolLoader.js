var fs = require('fs');

ToolLoader = {
  load: function(path) {
    var obj = JSON.parse(fs.readFileSync(path));

  }
}

module.exports = ToolLoader;
