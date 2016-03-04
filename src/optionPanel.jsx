var React = require('react');

var OptionPanel = React.createClass({

  getInitialState: function() {
    return {
      options: {}
    };
  },

  setOptionState: function(event) {
    this.state.options[event.target.name] = event.target.value;
    return this.setState({options: this.state.options});
  },

  render: function() {
    return (
      <div className="pane">
        <ul className="list-group">
          <li className="list-group-header">
            <strong>Options</strong>
          </li>
        </ul>
        <form>
          <input type="number" />
        </form>
      </div>
    );
  }
});

module.exports = OptionPanel;
