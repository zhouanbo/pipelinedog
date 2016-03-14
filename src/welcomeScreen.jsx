var React = require('react');

var WelcomeScreen = React.createClass({

  render: function() {
    return (
      <div className="welcomewrapper">
        <div className="welcomeimg">
          <img src="img/icon_256x256.png" />
        </div>
        <div className="welcometitle">
          <h1>Welcome to PipelineDog</h1>
        </div>
        <div className="welcomebutton">
          <button className="btn btn-large btn-default" onClick={this.props.newProject}>
            <span className="icon icon-plus icon-text"></span>
            New Project
          </button>
          <button className="btn btn-large btn-default" onClick={this.props.openProject}>
            <span className="icon icon-folder icon-text"></span>
            Open Project
          </button>
        </div>
      </div>
    );
  }
});

module.exports = WelcomeScreen;
