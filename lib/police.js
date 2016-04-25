var remote = require('remote');
var dialog = remote.require('dialog');
var Util = require('./util');
var path = require('path');
var fs = require('fs');

var Police = {

  checkToolDefinition: function (appParam) {

    var app = appParam;

    var tool = Util.filterByProperty(app.state.tools, "id", app.state.currentTool);
    var expressions = [tool.codeobj.input_option, tool.codeobj.output_option, tool.codeobj.label_option, tool.codeobj.log_option];

    var rfalse = false;
    expressions.map(function (s, i) {
      if (s) {
        if (typeof s != "object") {
          if (!this.checkLEASH(s)) {
            rfalse = true;
          }
        } else {
          if (!this.checkObject(s)) {
            rfalse = true;
          }
        }
      }
    }, this);

    if (Array.isArray(tool.codeobj.output_files)) {
      tool.codeobj.output_files.map(function (s, i) {
        if (!this.checkLEASH(s)) {
          rfalse = true;
        }
      }, this);
    } else {
      if (!this.checkObject(tool.codeobj.output_files)) {
        rfalse = true;
      }
    }

    if (rfalse) {
      return false;
    }

    //inputlists must exsit
    var flexist = true;
    var flempty = false;
    tool.codeobj.inputlists.map(function (fl, i) {
      var fstat;
      try {
        fstat = fs.statSync(fl);
      } catch (e) {
        console.log(e);
        flexist = false;
        return;
      }
      if (fstat.size == 0) {
        flempty = true;
      }
    }.bind(this));
    if (!flexist) {
      dialog.showErrorBox("Tool Parse Error", "Inputlist does not exist in " + tool.name + ".");
      return false;
    }
    if (flempty) {
      dialog.showErrorBox("Tool Parse Error", "Inputlist empty in " + tool.name + ".");
      return false;
    }

    //must have a name, description and invoke command
    if (tool.codeobj.name == "" || tool.codeobj.description == "" || tool.codeobj.invoke == "") {
      dialog.showErrorBox("Tool Parse Error", "Missing required definition in " + tool.name + ".");
      return false;
    }

    //'l'A in both input, output option
    var inputLoop = false,
        outputLoop = false,
        labelLoop = false,
        logLoop = false;
    var ltOne = false;
    if (tool.codeobj.input_option) {
      if (typeof tool.codeobj.input_option != "object") {
        var inputArray = tool.codeobj.input_option.split(/[\{\}]/);
        for (var i = 1; i < inputArray.length - 1; i += 2) {
          inputArray[i].split('|').map(function (s, i) {
            if (s == "'l'A") {
              inputLoop = true;
            }
          });
          if (i > 1) {
            ltOne = true;
          }
        }
      } else {
        if (tool.codeobj.input_option.arrangement == "'l'") {
          inputLoop = true;
        }
      }
    }
    if (tool.codeobj.output_option) {
      if (typeof tool.codeobj.output_option != "object") {
        var outputArray = tool.codeobj.output_option.split(/[\{\}]/);
        for (var i = 1; i < outputArray.length - 1; i += 2) {
          outputArray[i].split('|').map(function (s, i) {
            if (s == "'l'A") {
              outputLoop = true;
            }
          });
          if (i > 1) {
            ltOne = true;
          }
        }
      } else {
        if (tool.codeobj.output_option.arrangement == "'l'") {
          outputLoop = true;
        }
      }
    }
    if (tool.codeobj.label_option) {
      if (typeof tool.codeobj.label_option != "object") {
        var labelArray = tool.codeobj.label_option.split(/[\{\}]/);
        for (var i = 1; i < labelArray.length - 1; i += 2) {
          labelArray[i].split('|').map(function (s, i) {
            if (s == "'l'A") {
              labelLoop = true;
            }
          });
          if (i > 1) {
            ltOne = true;
          }
        }
      } else {
        if (tool.codeobj.label_option.arrangement == "'l'") {
          labelLoop = true;
        }
      }
    }
    if (tool.codeobj.log_option) {
      if (typeof tool.codeobj.log_option != "object") {
        var logArray = tool.codeobj.log_option.split(/[\{\}]/);
        for (var i = 1; i < logArray.length - 1; i += 2) {
          logArray[i].split('|').map(function (s, i) {
            if (s == "'l'A") {
              logLoop = true;
            }
          });
          if (i > 1) {
            ltOne = true;
          }
        }
      } else {
        if (tool.codeobj.log_option.arrangement == "'l'") {
          logLoop = true;
        }
      }
    }
    if (inputLoop || outputLoop || labelLoop || logLoop) {
      if (!(inputLoop && outputLoop)) {
        dialog.showErrorBox("Tool Parse Error", "'l'A need to be in both input and output option in " + tool.name + ".");
        return false;
      }
      if (ltOne) {
        dialog.showErrorBox("Tool Parse Error", "Looping arrangement only allow one LEASH per option in " + tool.name + ".");
        return false;
      }
    }

    //can only use lower hierarchy output
    var isLowerHierarchy = false;
    var h = Util.getHierarchy(app.state.tools, tool.id);
    tool.codeobj.inputlists.map(function (il, i) {
      var hil = Util.getHierarchyByName(app.state.tools, path.basename(il).slice(0, -9));
      if (hil) {
        if (hil >= h) {
          isLowerHierarchy = true;
        }
      }
    }, this);
    if (isLowerHierarchy) {
      dialog.showErrorBox("Tool Parse Error", "You can't use output list from same or lower hierarchy in " + tool.name + ", because they are not exist by that step.");
      return false;
    }

    return true;
  },

  checkLEASH: function (leashString) {
    //if not leash, return true
    if (leashString.indexOf('{') == -1 && leashString.indexOf('}') == -1) {
      return true;
    }

    //Open and close symbols
    var depthBracket = 0;
    var depthQuote = 0;
    var characterArray = leashString.split("");
    characterArray.map(function (c, i) {
      if (c == "{") depthBracket++;
      if (c == "}") depthBracket--;
      if (c == "'") depthQuote++;
    });
    if (depthBracket != 0) {
      dialog.showErrorBox("LEASH Parse Error", "Open and close brackets don't match in expression: " + leashString + ".");
      return false;
    }
    if (depthQuote % 2 != 0) {
      dialog.showErrorBox("LEASH Parse Error", "Quotes don't match in expression: " + leashString + ".");
      return false;
    }

    //Segments
    var legalSeg = true;
    var legalType = true;
    var leashArray = leashString.split(/[\{\}]/);
    var lastSeg = -1;wrongOrder = false;
    for (var i = 1; i < leashArray.length - 1; i += 2) {
      leashArray[i].split("|").map(function (s, i) {
        var si = s.slice(-1);
        var ss = s.slice(0, -1);
        if (si == 'F') {
          if (lastSeg > 0) wrongOrder = true;
          lastSeg = 0;
          if (ss.search(/^\/.*\/$/) == -1 && ss.search(/[^\d\,\-]+/) != -1) {
            legalType = false;
          }
        } else if (si == 'L') {
          if (lastSeg > 1) wrongOrder = true;
          lastSeg = 1;
          if (ss.search(/^\/.*\/$/) == -1 && ss.search(/[^\d\,\-]+/) != -1) {
            legalType = false;
          }
        } else if (si == 'B') {
          if (lastSeg > 2) wrongOrder = true;
          lastSeg = 2;
          if ((ss.indexOf('/') != -1 && ss.search(/^P*\/.*\/$/)) == -1 && ss.indexOf('/') == -1 && (ss.search(/[^P\d\,\-]+/) != -1 || ss.indexOf('P') != 0)) {
            legalType = false;
          }
        } else if (si == 'E') {
          if (lastSeg > 3) wrongOrder = true;
          lastSeg = 3;
          if (ss.search(/([(PRE)(SUF)]\'.*\')+/) == -1) {
            legalType = false;
          }
        } else if (si == 'A') {
          if (lastSeg > 4) wrongOrder = true;
          lastSeg = 4;
          if (ss.search(/^\'.*\'$/) == -1) {
            legalType = false;
          }
        } else {
          legalSeg = false;
        }
      }, this);
    }
    //Illegal segment indicator
    if (!legalSeg) {
      dialog.showErrorBox("LEASH Parse Error", "Illegal Segment indicator in LEASH expression: " + leashString + ".");
      return false;
    }
    //Segment type
    if (!legalType) {
      dialog.showErrorBox("LEASH Parse Error", "Illegal Segment format in LEASH expression: " + leashString + ".");
      return false;
    }
    //Segment ordering
    if (wrongOrder) {
      dialog.showErrorBox("LEASH Parse Error", "Segments not correctly ordered in LEASH expression: " + leashString + ".");
      return false;
    }

    return true;
  },

  checkObject: function (obj) {

    var legalKey = true;
    var legalType = true;
    var lastSeg = -1;wrongOrder = false;

    for (var key in obj) {
      if (key == 'file') {
        if (lastSeg > 0) wrongOrder = true;
        lastSeg = 0;
        if (obj[key].search(/^\/.*\/$/) == -1 && obj[key].search(/[^\d\,\-]+/) != -1) {
          legalType = false;
        }
      } else if (key == 'line') {
        if (lastSeg > 1) wrongOrder = true;
        lastSeg = 1;
        if (obj[key].search(/^\/.*\/$/) == -1 && obj[key].search(/[^\d\,\-]+/) != -1) {
          legalType = false;
        }
      } else if (key == 'base') {
        if (lastSeg > 2) wrongOrder = true;
        lastSeg = 2;
        if ((obj[key].indexOf('/') != -1 && obj[key].search(/^P*\/.*\/$/)) == -1 && obj[key].indexOf('/') == -1 && (obj[key].search(/[^P\d\,\-]+/) != -1 || obj[key].indexOf('P') != 0)) {
          legalType = false;
        }
      } else if (key == 'extension') {
        if (lastSeg > 3) wrongOrder = true;
        lastSeg = 3;
        if (obj[key].search(/([(PRE)(SUF)]\'.*\')+/) == -1) {
          legalType = false;
        }
      } else if (key == 'arrangement') {
        if (lastSeg > 4) wrongOrder = true;
        lastSeg = 4;
        if (obj[key].search(/^\'.*\'$/) == -1) {
          legalType = false;
        }
      } else {
        legalKey = false;
      }
    }

    if (!legalKey) {
      dialog.showErrorBox("Object Parse Error", "Unrecognized key name in Object: " + JSON.stringify(obj) + ".");
      return false;
    }
    //Segment type
    if (!legalType) {
      dialog.showErrorBox("Object Parse Error", "Illegal Segment format in Object: " + JSON.stringify(obj) + ".");
      return false;
    }

    if (wrongOrder) {
      dialog.showErrorBox("LEASH Parse Error", "Segments not correctly ordered in LEASH object: " + JSON.stringify(obj) + ".");
      return false;
    }

    return true;
  }

};

module.exports = Police;