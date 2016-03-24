var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

var Util = require('./util');


var FileOperation = {

  openProject: function(app) {
    var filepath = dialog.showOpenDialog({
      title: "Open Project",
      properties: ['openFile']
    }, function(filepath) {
      if (!filepath) {return;}
      fs.readFile(filepath[0], 'utf8', function(err, data) {
        if (err) {
          return console.log(err);
        }
        var readState = JSON.parse(data);
        app.state = readState;
        app.setState(app.state);
      });
    });
  },

  saveProject: function(app) {
    var filepath = dialog.showSaveDialog({
      title: "Save Project",
      defaultPath: path.join(app.state.workDir, "defaultProject.JSON")
    }, function(filepath) {
      if (!filepath) {return;}
      var writeState = JSON.stringify(app.state);
      fs.writeFile(filepath, writeState, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Project saved!");
      });
    });
  },

  importFile: function(app) {
    var filepaths = dialog.showOpenDialog({
      title: "Import File",
      properties: ['openFile','multiSelections']
    }, function(filepaths) {
      if (!filepaths) {return;}
      filepaths.map(function(filepath) {
        if(!Util.hasPath(app.state.files, filepath)) {
          app.state.files.push({name: path.basename(filepath), type: "imported", path: filepath});
        }
        app.setState(app.state);
      }, this);
    });
  },

  newProject: function(app) {
    var touchFile = function(filepath) {
      var txtpath = filepath;
      fs.writeFile(txtpath, "", { flag: 'wx' }, function (err) {
        if (err) return;
        console.log(txtpath+" touched.");
      });
    };
    var filepath = dialog.showOpenDialog({
      title: "New Project",
      defaultPath: process.env.HOME,
      properties: ['openDirectory']
    }, function(filepath) {
      if (!filepath) {return;}
      touchFile(path.join(filepath[0], "INPUT.list.txt"));
      app.state.files.push({name: "INPUT.list.txt", type: "generated", path: path.join(filepath[0], "INPUT.list.txt")});
      app.state.workDir = filepath[0];
      app.setState(app.state);
    });
  },
  
  newParse: function(app) {
    var tool = Util.filterByProperty(app.state.tools, "id", app.state.currentTool);
    mkdirp(path.join(app.state.workDir, tool.name), function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log("Directory made.");
      }
    });
    var filepath = path.join(app.state.workDir, tool.name, tool.name+".list.txt");
    fs.writeFileSync(filepath, tool.output_files.join("\n"));
    if(!Util.hasPath(app.state.files, filepath)) {
      app.state.files.push({name: tool.name+".list.txt", type: "generated", path: filepath});
    }
    app.setState(app.state);
  },

};

module.exports = FileOperation;
