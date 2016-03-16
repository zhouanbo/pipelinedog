var React = require('react');
var $ = require('jquery');

var Util = require('./util');

var MapPanel = React.createClass({

  render: function() {

    var chose = this.props.chose;
    var choosing = this.props.choosing;

    return (
      <div className="pane mappanel">
        <ul className="list-group">
          <li className="list-group-header">
            <strong>Map</strong>
            <strong style={{float:"right", color:"#B03060"}} onClick={this.props.deleteTool.bind(null, chose, choosing)}>Delete</strong>
          </li>
        </ul>
        {this.props.tools.map(function(level, levelindex) {
          return (
            <div key={levelindex} className="maplevel" name={levelindex}>

              <div className="hierarchynum">{levelindex+1}</div>

              {level.map(function(tool, index) {
                return (
                  <div key={index} name={tool.id} className={(chose && choosing == tool.id) ? "chose mapnode" : "mapnode"} onClick={this.props.onNodeClick} onDoubleClick={this.props.toolClick}>{tool.name}</div>
                );
              }, this)}
              {(this.props.tools[levelindex].length > 0) ?
                <div className="btn-group">
                  <div name="rightplus" tabIndex={levelindex} className="icon icon-right" onClick={this.props.addTool}></div>
                  <div name="bottomplus" tabIndex={levelindex} className="icon icon-down" onClick={this.props.addTool}></div>
                </div> :
                <div></div>
              }
            </div>
          );
        }, this)}

      </div>
    );
  }

});

module.exports = MapPanel;
