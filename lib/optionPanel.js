var React = require('react');

var OptionPanel = React.createClass({
  displayName: "OptionPanel",


  getInitialState: function () {
    return {
      options: {}
    };
  },

  setOptionState: function (event) {
    this.state.options[event.target.name] = event.target.value;
    return this.setState({ options: this.state.options });
  },

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
            "Options"
          )
        )
      ),
      React.createElement(
        "form",
        null,
        React.createElement("input", { type: "number" })
      )
    );
  }
});

module.exports = OptionPanel;