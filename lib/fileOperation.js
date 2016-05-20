'use strict';

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var open = require("open");

var Util = require('./util');

if (process.platform != 'win32') {
  var newline = "\n";
} else {
  var newline = "\r\n";
}

var FileOperation = {

  openProject: function openProject(app) {
    var filepath = dialog.showOpenDialog({
      title: "Open Project",
      properties: ['openFile']
    }, function (filepath) {
      if (!filepath) {
        return;
      }
      fs.readFile(filepath[0], 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        var readState = JSON.parse(data);
        if (readState.workDir) {
          app.state = readState;
          app.setState(app.state);
        } else {
          dialog.showErrorBox("Open Project Error", "Malformatted project file.");
        }
      });
    });
  },

  saveProject: function saveProject(app) {
    if (app.state.lastSaved == "") {
      var filepath = dialog.showSaveDialog({
        title: "Save Project",
        defaultPath: path.join(app.state.workDir, "defaultProject.json"),
        properties: ['createDirectory']
      }, function (filepath) {
        if (!filepath) {
          return;
        }
        app.state.lastSaved = filepath;
        var writeState = JSON.stringify(app.state);
        fs.writeFile(filepath, writeState, function (err) {
          if (err) {
            return console.log(err);
          }
          console.log("Project saved!");
        });
      });
    } else {
      var writeState = JSON.stringify(app.state);
      fs.writeFile(app.state.lastSaved, writeState, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Project saved!");
      });
    }
  },

  saveAsProject: function saveAsProject(app) {
    var filepath = dialog.showSaveDialog({
      title: "Save Project",
      defaultPath: path.join(app.state.workDir, "defaultProject.json"),
      properties: ['createDirectory']
    }, function (filepath) {
      if (!filepath) {
        return;
      }
      app.state.lastSaved = filepath;
      var writeState = JSON.stringify(app.state);
      fs.writeFile(filepath, writeState, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Project saved!");
      });
    });
  },

  importFile: function importFile(app) {
    var filepaths = dialog.showOpenDialog({
      title: "Import File",
      properties: ['openFile', 'multiSelections']
    }, function (filepaths) {
      if (!filepaths) {
        return;
      }
      filepaths.map(function (filepath) {
        if (!Util.hasPath(app.state.files, filepath)) {
          app.state.files.push({ name: path.basename(filepath), type: "imported", path: filepath });
        }
        app.setState(app.state);
      }, this);
    });
  },

  newProject: function newProject(app) {
    var touchFile = function touchFile(filepath) {
      var txtpath = filepath;
      fs.writeFile(txtpath, "", { flag: 'wx' }, function (err) {
        if (err) return;
        console.log(txtpath + " touched.");
      });
    };
    var filepath = dialog.showOpenDialog({
      title: "New Project",
      defaultPath: process.env.HOME,
      properties: ['openDirectory', 'createDirectory']
    }, function (filepath) {
      if (!filepath) {
        return;
      }
      app.state = {
        workDir: "",
        lastSaved: "",
        tools: [[app.getNewTool(0)]],
        lastId: 0,
        files: [],
        action: "map",
        showingParsed: false,
        currentTool: 0,
        chose: false,
        choosing: 0,
        command: ""
      };
      touchFile(path.join(filepath[0], "INPUT.list.txt"));
      app.state.files.push({ name: "INPUT.list.txt", type: "generated", path: path.join(filepath[0], "INPUT.list.txt") });
      app.state.workDir = filepath[0];
      app.setState(app.state);
    });
  },

  newParse: function newParse(app) {
    var tool = Util.filterByProperty(app.state.tools, "id", app.state.currentTool);
    mkdirp(path.join(app.state.workDir, tool.name), function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("Directory made.");
      }
    });
    var filepath = path.join(app.state.workDir, tool.name, tool.name + ".list.txt");
    fs.writeFileSync(filepath, tool.output_files.join(newline));
    if (!Util.hasPath(app.state.files, filepath)) {
      app.state.files.push({ name: tool.name + ".list.txt", type: "generated", path: filepath });
    }
    app.setState(app.state);
  },

  exportCommand: function exportCommand(app) {
    var filepath = dialog.showSaveDialog({
      title: "Export Code",
      defaultPath: path.join(app.state.workDir, process.platform != 'win32' ? "PipelineDog.sh" : "PipelineDog.BAT")
    }, function (filepath) {
      if (!filepath) {
        return;
      }
      var writeState = app.state.command;
      fs.writeFile(filepath, writeState, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Command exported!");
      });
    });
  },

  exportProject: function exportProject(app, json) {
    var filepath = dialog.showSaveDialog({
      title: "Export Project",
      defaultPath: path.join(app.state.workDir, "PipelineDog.pipeline.json")
    }, function (filepath) {
      if (!filepath) {
        return;
      }
      fs.writeFile(filepath, JSON.stringify(json, null, "  "), function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Project exported!");
      });
    });
  },

  openFile: function openFile(filepath) {
    open(filepath);
  },

  exportTool: function exportTool(app) {
    var tool = Util.filterByProperty(app.state.tools, "id", app.state.currentTool);
    var filepath = dialog.showSaveDialog({
      title: "Export Tool",
      defaultPath: path.join(app.state.workDir, tool.name + ".pdt.json")
    }, function (filepath) {
      if (!filepath) {
        return;
      }
      var writeState = tool.code;
      fs.writeFile(filepath, writeState, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Tool exported!");
      });
    });
  },
  importTool: function importTool(app) {
    var tool = Util.filterByProperty(app.state.tools, "id", app.state.currentTool);
    var filepath = dialog.showOpenDialog({
      title: "Import Tool",
      properties: ['openFile']
    }, function (filepath) {
      if (!filepath) {
        return;
      }
      fs.readFile(filepath[0], 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        var readState = JSON.parse(data);
        if (readState.name) {
          tool.name = readState.name;
          tool.description = readState.description;
          tool.code = data;
          tool.codeobj = readState;
          app.setState(app.state);
        } else {
          dialog.showErrorBox("Import Tool Error", "Malformatted tool file.");
        }
      });
    });
  }

};

module.exports = FileOperation;