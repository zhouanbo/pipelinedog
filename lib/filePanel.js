var React = require('react');
var $ = require('jquery');
require('jquery-ui');

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
                null,
                file.name
              ),
              React.createElement(
                'td',
                null,
                file.type
              )
            );
          })
        )
      )
    );
  }
});

module.exports = FilePanel;