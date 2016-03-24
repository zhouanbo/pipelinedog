var React = require('react');
var $ = require('jquery');

var FilePanel = React.createClass({
  displayName: 'FilePanel',


  refreshTitle: function () {
    $('.filepanel .list-group-header').width($('.filepanel .table-striped').width() - 20);
  },
  componentDidMount: function () {
    this.refreshTitle();
  },
  componentDidUpdate: function () {
    this.refreshTitle();
  },

  render: function () {
    return React.createElement(
      'div',
      { className: 'filepanel pane-sm sidebar pull-right' },
      React.createElement(
        'ul',
        { className: 'list-group' },
        React.createElement(
          'li',
          { className: 'list-group-header' },
          React.createElement(
            'strong',
            null,
            'Files'
          )
        )
      ),
      React.createElement(
        'table',
        { className: 'table-striped' },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              'Action'
            ),
            React.createElement(
              'th',
              null,
              'Name'
            ),
            React.createElement(
              'th',
              null,
              'Type'
            )
          )
        ),
        React.createElement(
          'tbody',
          null,
          this.props.files.map(function (file, index) {
            return React.createElement(
              'tr',
              { key: index },
              React.createElement(
                'td',
                { style: { textAlign: "center" } },
                React.createElement('span', { onClick: this.props.openFile.bind(null, file.path), className: 'icon icon-eye', style: { marginRight: '5px' } }),
                file.type == "generated" ? React.createElement('span', null) : React.createElement('span', { onClick: this.props.deleteFile.bind(null, index), className: 'icon icon-cancel-circled' })
              ),
              React.createElement(
                'td',
                { onClick: this.props.onFileClick.bind(null, file.path) },
                file.name
              ),
              React.createElement(
                'td',
                null,
                file.type
              )
            );
          }, this)
        )
      )
    );
  }
});

module.exports = FilePanel;