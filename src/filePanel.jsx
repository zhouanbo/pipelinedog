var React = require('react');

var FilePanel = React.createClass({
  render: function() {
    return (
      <div className="pane-sm sidebar pull-right">
        <ul className="list-group">
          <li className="list-group-header">
            <strong>Files</strong>
          </li>
        </ul>
        <table className="table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>photon.css</td>
              <td>File</td>
            </tr>
            <tr>
              <td>photon.css</td>
              <td>File</td>
            </tr>
            <tr>
              <td>photon.css</td>
              <td>File</td>
            </tr>
            <tr>
              <td>photooooooooo.css</td>
              <td>FileList</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = FilePanel;
