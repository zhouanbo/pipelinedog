var remote = require('remote');
var dialog = remote.require('dialog');

var Police = {

  checkToolDefinition: function (app) {

    var tool = Util.filterByProperty(app.state.tools, "id", app.state.currentTool);
    var expressions = [tool.codeobj.input_option, tool.codeobj.output_option, tool.codeobj.label_option];

    var rfalse = false;
    expressions.map(function (s, i) {
      if (!this.checkLEASH(s)) {
        rfalse = true;
      }
    }, this);

    tool.codeobj.output_files.map(function (s, i) {
      if (!this.checkLEASH(s)) {
        rfalse = true;
      }
    }, this);
    if (rfalse) {
      return false;
    }

    //must have a name, description and invoke command
    if (tool.codeobj.name == "" || tool.codeobj.description == "" || tool.codeobj.invoke == "") {
      dialog.showErrorBox("Parse Error", "Missing required definition.");
      return false;
    }

    //'l'A in both input, output option
    var inputLoop = false,
        outputLoop = false,
        labelLoop = false;
    var ltOne = false;
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
    if (inputLoop || outputLoop || labelLoop) {
      if (!(inputLoop && outputLoop)) {
        dialog.showErrorBox("LEASH Parse Error", "'l'A need to be in both input and output option.");
        return false;
      }
      if (ltOne) {
        dialog.showErrorBox("LEASH Parse Error", "Looping arrangement only allow one LEASH per option.");
        return false;
      }
    }

    //can only use lower hierarchy output
    //dialog.showErrorBox("LEASH Parse Error", "Output of higher hierarchy used.");  

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
    var depthSlash = 0;
    var characterArray = leashString.split("");
    characterArray.map(function (c, i) {
      if (c == "{") depthBracket++;
      if (c == "}") depthBracket--;
      if (c == "'") depthQuote++;
      if (c == '/') depthSlash++;
    });
    if (depthBracket != 0) {
      dialog.showErrorBox("LEASH Parse Error", "Open and close brackets don't match.");
      return false;
    }
    if (depthQuote % 2 != 0) {
      dialog.showErrorBox("LEASH Parse Error", "Quotes don't match.");
      return false;
    }
    if (depthSlash % 2 != 0) {
      dialog.showErrorBox("LEASH Parse Error", "Slashs don't match.");
      return false;
    }

    //Segments
    var legalSeg = true;
    var legalType = true;
    var leashArray = leashString.split(/[\{\}]/);
    var lastIndex = -1;wrongOrder = false;
    for (var i = 1; i < leashArray.length - 1; i += 2) {
      leashArray[i].split("|").map(function (s, i) {
        var si = s.slice(-1);
        var ss = s.slice(0, -1);
        if (si == 'F') {
          if (lastIndex > i) wrongOrder = true;
          lastIndex = i;
          if (ss.search(/^\/.*\/$/) == -1 && ss.search(/[^\d\,\-]+/) != -1) {
            legalType = false;
          }
        } else if (si == 'L') {
          if (lastIndex > i) wrongOrder = true;
          lastIndex = i;
          if (ss.search(/^\/.*\/$/) == -1 && ss.search(/[^\d\,\-]+/) != -1) {
            legalType = false;
          }
        } else if (si == 'B') {
          if (lastIndex > i) wrongOrder = true;
          lastIndex = i;
          if ((ss.indexOf('/') != -1 && ss.search(/^P*\/.*\/$/)) == -1 && ss.indexOf('/') == -1 && (ss.search(/[^P\d\,\-]+/) != -1 || ss.indexOf('P') != 0)) {
            legalType = false;
          }
        } else if (si == 'E') {
          if (lastIndex > i) wrongOrder = true;
          lastIndex = i;
          if (ss.search(/^\-*\'.*\'$/) == -1) {
            legalType = false;
          }
        } else if (si == 'A') {
          if (lastIndex > i) wrongOrder = true;
          lastIndex = i;
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
      dialog.showErrorBox("LEASH Parse Error", "Illegal Segment indicator.");
      return false;
    }
    //Segment type
    if (!legalType) {
      dialog.showErrorBox("LEASH Parse Error", "Illegal Segment format.");
      return false;
    }
    //Segment ordering
    if (wrongOrder) {
      dialog.showErrorBox("LEASH Parse Error", "Segments not correctly ordered.");
      return false;
    }

    return true;
  }

};

module.exports = Police;