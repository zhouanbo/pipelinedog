var React = require('react');

var MapPanel = React.createClass({


  render: function() {

    return (
      <div className="pane">
        <ul className="list-group">
          <li className="list-group-header">
            <strong>Map</strong>
          </li>
        </ul>
        <span name="bottomplus" tabIndex={-1} className="icon icon-plus bottomplus" onClick={this.props.addTool}></span>
        {this.props.tools.map(function(level, levelindex) {
          return (
            <div key={levelindex} className="maplevel" name={levelindex}>
              {level.map(function(tool, index) {
                return (
                  <div key={index} className="mapnode">{tool.name}</div>
                );
              }, this)}
              <span name="rightplus" tabIndex={levelindex} className="icon icon-plus rightplus" onClick={this.props.addTool}></span>
              <span name="bottomplus" tabIndex={levelindex} className="icon icon-plus bottomplus" onClick={this.props.addTool}></span>
            </div>
          );
        }, this)}

      </div>
    );
  }

});

module.exports = MapPanel;
