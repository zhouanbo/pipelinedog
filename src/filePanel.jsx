var React = require('react');
var $ = require('jquery');

var FilePanel = React.createClass({

  refreshTitle: function() {
    $('.filepanel .list-group-header').width($('.filepanel .table-striped').width()-20);
  },
  componentDidMount: function() {
    this.refreshTitle();
  },
  componentDidUpdate: function() {
    this.refreshTitle();
  },

  render: function() {
    return (
      <div className="filepanel pane-sm sidebar pull-right">
        <ul className="list-group">
          <li className="list-group-header">
            <strong>Files</strong>
          </li>
        </ul>
        <table className="table-striped">
          <thead>
            <tr>
              <th>Action</th>
              <th>Name</th>
              <th>Type</th>              
            </tr>
          </thead>
          <tbody>
            {this.props.files.map(function(file, index) {
              return (
                <tr key={index}>
                  <td style={{textAlign: "center"}}>
                    <span onClick={this.props.openFile.bind(null, file.path)} className="icon icon-eye" style={{marginRight: '5px'}}></span>
                    {file.type=="generated" ? <span></span> :
                      <span onClick={this.props.deleteFile.bind(null, index)} className="icon icon-cancel-circled"></span>
                    }
                  </td>
                  <td onClick={this.props.onFileClick.bind(null, file.path)}>{file.name}</td>
                  <td>{file.type}</td>
                </tr>
              );
            }, this)}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = FilePanel;
