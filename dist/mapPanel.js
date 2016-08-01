'use strict';

var React = require('react');

var Util = require('./util');

var MapPanel = React.createClass({
  displayName: 'MapPanel',


  render: function render() {

    var chose = this.props.chose;
    var choosing = this.props.choosing;

    return React.createElement(
      'div',
      { className: 'pane mappanel' },
      React.createElement(
        'ul',
        { className: 'list-group' },
        React.createElement(
          'li',
          { className: 'list-group-header' },
          React.createElement(
            'strong',
            null,
            'Map'
          ),
          React.createElement(
            'strong',
            { style: { float: "right", color: "#B03060" }, onClick: this.props.deleteTool.bind(null, chose, choosing) },
            'Delete'
          )
        )
      ),
      this.props.tools.map(function (level, levelindex) {
        return React.createElement(
          'div',
          { key: levelindex, className: 'maplevel', name: levelindex },
          this.props.tools[levelindex].length > 0 ? React.createElement(
            'div',
            { className: 'hierarchynum' },
            levelindex + 1
          ) : React.createElement('div', null),
          level.map(function (tool, index) {
            return React.createElement(
              'div',
              { key: index, className: chose && choosing == tool.id ? "chose mapnode" : "mapnode", onClick: this.props.onNodeClick.bind(null, tool.id), onDoubleClick: this.props.toolClick.bind(null, tool.id) },
              tool.name
            );
          }, this),
          this.props.tools[levelindex].length > 0 ? React.createElement(
            'div',
            { className: 'btn-group' },
            React.createElement('div', { name: 'rightplus', tabIndex: levelindex, className: 'icon icon-right', onClick: this.props.addTool }),
            React.createElement('div', { name: 'bottomplus', tabIndex: levelindex, className: 'icon icon-down', onClick: this.props.addTool })
          ) : React.createElement('div', null)
        );
      }, this)
    );
  }

});

module.exports = MapPanel;