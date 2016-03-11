var path = require('path');
var fs = require('fs');

FileOperation = {

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
        var readState = JSON.parse(data)
        app.state = readState;
        app.setState(app.state);
      });
    });
  },

  saveProject: function(app) {
    var filepath = dialog.showSaveDialog({
      title: "Save Project",
      defaultPath: path.join(process.env.HOME, "defaultProject.JSON")
    }, function(filepath) {
      if (!filepath) {return;}
      var writeState = JSON.stringify(app.state)
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
        app.state.files.push({name: path.basename(filepath), type: "imported", path: filepath});
        app.setState({files: app.state.files});
      }, this)
    });
  },
}

module.exports = FileOperation;
