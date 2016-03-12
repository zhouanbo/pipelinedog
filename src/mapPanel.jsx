var React = require('react');

var MapPanel = React.createClass({

  render: function() {

    return (
      <div className="pane mappanel">
        <ul className="list-group">
          <li className="list-group-header">
            <strong>Map</strong>
          </li>
        </ul>
        {this.props.tools.map(function(level, levelindex) {
          return (
            <div key={levelindex} className="maplevel" name={levelindex}>
              {level.map(function(tool, index) {
                return (
                  <div key={index} className="mapnode">{tool.name}</div>
                );
              }, this)}
              <div className="btn-group">
                <button className="btn btn-small btn-default bottomplus" name="bottomplus" tabIndex={levelindex} onClick={this.props.addTool}><span name="bottomplus" tabIndex={levelindex} className="icon icon-down" ></span></button>
                <button className="btn btn-small btn-default rightplus" name="rightplus" tabIndex={levelindex} onClick={this.props.addTool}><span name="rightplus" tabIndex={levelindex} className="icon icon-right" ></span></button>
              </div>
            </div>
          );
        }, this)}

      </div>
    );
  }

});

module.exports = MapPanel;
