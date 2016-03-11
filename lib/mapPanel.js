var React = require('react');

var MapPanel = React.createClass({
  displayName: "MapPanel",


  render: function () {

    return React.createElement(
      "div",
      { className: "pane" },
      React.createElement(
        "ul",
        { className: "list-group" },
        React.createElement(
          "li",
          { className: "list-group-header" },
          React.createElement(
            "strong",
            null,
            "Map"
          )
        )
      ),
      React.createElement("span", { name: "bottomplus", tabIndex: -1, className: "icon icon-plus bottomplus", onClick: this.props.addTool }),
      this.props.tools.map(function (level, levelindex) {
        return React.createElement(
          "div",
          { key: levelindex, className: "maplevel", name: levelindex },
          level.map(function (tool, index) {
            return React.createElement(
              "div",
              { key: index, className: "mapnode" },
              tool.name
            );
          }, this),
          React.createElement("span", { name: "rightplus", tabIndex: levelindex, className: "icon icon-plus rightplus", onClick: this.props.addTool }),
          React.createElement("span", { name: "bottomplus", tabIndex: levelindex, className: "icon icon-plus bottomplus", onClick: this.props.addTool })
        );
      }, this)
    );
  }

});

module.exports = MapPanel;