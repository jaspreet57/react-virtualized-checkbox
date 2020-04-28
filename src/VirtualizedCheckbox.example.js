import React, { Component } from "react";
import PropTypes from "prop-types";
import VirtualizedCheckbox from "./VirtualizedCheckbox";
import "react-resizable/css/styles.css";

export default class VirtualizedCheckboxExample extends Component {
  static propTypes = {
    cityData: PropTypes.array.isRequired,
  };

  state = {
    results: undefined,
    canceled: false,
    hasOkButton: true,
    hasCancelButton: true,
    hasFilterBox: true,
    showOverlay: false,
  };

  handleFilterToggle = () => {
    this.setState({ hasFilterBox: !this.state.hasFilterBox });
  };

  handleOkButtonToggle = () => {
    this.setState({ hasOkButton: !this.state.hasOkButton });
  };

  handleCancelButtonToggle = () => {
    this.setState({ hasCancelButton: !this.state.hasCancelButton });
  };

  openOverlay = () => {
    this.setState({ showOverlay: true });
  };

  closeOverlay = () => {
    this.setState({ showOverlay: false });
  };

  render() {
    return (
      <div>
        <div>
          <h3>Example</h3>
          <div
            style={{
              height: 400,
              boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.75)",
            }}
          >
            <VirtualizedCheckbox
              items={this.props.cityData.map((opt) => ({
                ...opt,
                checked: true,
              }))}
              labelKey="name"
              rowHeight={20}
              onChange={(item) => console.log("onChange", item)}
              hasFilterBox={true}
            />
          </div>
          <Results
            canceled={this.state.canceled}
            results={this.state.results}
            all={this.state.all}
            textFilter={this.state.textFilter}
          />
        </div>
      </div>
    );
  }
}

const Results = ({ canceled, results, all, textFilter }) => {
  let message;
  if (canceled) {
    message = <div>Selection canceled</div>;
  } else if (all) {
    message = <div>All items selected</div>;
  } else if (!results) {
    message = <div>No results yet</div>;
  } else {
    message = (
      <div>
        <div>
          {textFilter ? `Text filter: ${textFilter}` : "No text filter"}
        </div>
        <div>
          {results.length} item{results.length > 1 ? "s" : ""} selected.
        </div>
        <div>{results.map((item) => item.name).join(" ")}</div>
      </div>
    );
  }
  return (
    <div style={{ margin: "1rem 0" }}>
      <div
        style={{
          border: "#2196f3 dotted 0.2rem",
          borderRadius: "1rem",
          padding: "0.5rem",
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        {message}
      </div>
    </div>
  );
};
