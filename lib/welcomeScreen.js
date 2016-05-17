"use strict";

var React = require('react');

var WelcomeScreen = React.createClass({
  displayName: "WelcomeScreen",


  render: function render() {
    return React.createElement(
      "div",
      { className: "welcomewrapper" },
      React.createElement(
        "div",
        { className: "welcomeimg" },
        React.createElement("img", { src: "img/icon_256x256.png" })
      ),
      React.createElement(
        "div",
        { className: "welcometitle" },
        React.createElement(
          "h1",
          null,
          "Welcome to PipelineDog"
        )
      ),
      React.createElement(
        "div",
        { className: "welcomebutton" },
        React.createElement(
          "button",
          { className: "btn btn-large btn-default", onClick: this.props.newProject },
          React.createElement("span", { className: "icon icon-plus icon-text" }),
          "New Project"
        ),
        React.createElement(
          "button",
          { className: "btn btn-large btn-default", onClick: this.props.openProject },
          React.createElement("span", { className: "icon icon-folder icon-text" }),
          "Open Project"
        )
      )
    );
  }
});

module.exports = WelcomeScreen;