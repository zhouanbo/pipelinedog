var React = require('react');

var ToolPanel = React.createClass({
  render: function() {
    return (
      <div className="pane-sm sidebar">
        <ul className="list-group">
          <li className="list-group-header">
            <strong>Pipelines</strong>
          </li>
          <li className="list-group-item">
            <div className="media-body">
              <strong>samtools index</strong>
              <p>Index SAM/BAM files.</p>
            </div>
          </li>
          <li className="list-group-item">
            <div className="media-body">
              <strong>samtools mdup</strong>
              <p>Remove PCR duplicates in SAM/BAM files.</p>
            </div>
          </li>
        </ul>
      </div>
    );
  }
});

module.exports = ToolPanel;
