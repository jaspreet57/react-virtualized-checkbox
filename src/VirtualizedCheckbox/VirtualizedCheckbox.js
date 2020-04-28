import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { AutoSizer } from "react-virtualized";

import Checkboxes from "./Checkboxes";

function getDistinctFast(items, key) {
  let unique = {};
  let distinct = [];
  for (let opt of items) {
    if (typeof unique[opt[key]] === "undefined") {
      distinct.push(opt);
    }
    unique[opt[key]] = 0;
  }
  return distinct;
}

// Fast function to update items
// Use the fact that both arrays are sorted and have no duplicates
// and that all elements of the second array are present in the first array
function updateItems(base, items, labelKey) {
  let index = 0;
  for (let it of items) {
    while (base[index][labelKey] !== it[labelKey]) {
      index += 1;
    }
    base[index].checked = it.checked;
  }
  return base;
}

const FilterBar = ({ value, onChange, height, width }) =>
(
  <div style={{ height }}>
    <input
      style={{ width, height }}
      type="text"
      id="filter"
      placeholder="Filter boxes"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);

class VirtualizedCheckbox extends Component {
  static propTypes = {
    hasCancelButton: PropTypes.bool,
    hasFilterBox: PropTypes.bool,
    hasOkButton: PropTypes.bool,
    items: PropTypes.array,
    labelKey: PropTypes.string,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    onOk: PropTypes.func,
    rowHeight: PropTypes.number,
    textFilter: PropTypes.string,
  };

  static defaultProps = {
    hasOkButton: true,
    hasCancelButton: true,
    hasFilterBox: true,
    labelKey: "label",
    onCancel: () => null,
    onChange: () => null,
    onOk: () => null,
    items: [],
    rowHeight: 30,
    textFilter: "",
  };

  constructor(props) {
    super(props);
    const { items: propsItems, labelKey, textFilter } = props;

    const objectItems =
      typeof propsItems[0] === "string"
        ? propsItems.map((item) => ({ [labelKey]: item }))
        : propsItems;
    const items = getDistinctFast(objectItems, labelKey);
    this.state = {
      items,
      filter: textFilter,
    };
  }

  handleSelectAllChange = (checked) => {
    const items = this.getFilteredItems().map((it) => ({ ...it, checked }));
    this.setState((prevState) => ({
      items: updateItems(prevState.items, items, this.props.labelKey),
    }));
    if (this.props.onChange) {
      this.props.onChange(items);
    }
  };

  handleChange = (eventTarget) => {
    const index = this.state.items.findIndex(
      (it) => it[this.props.labelKey] === eventTarget[this.props.labelKey]
    );
    const items = [...this.state.items];
    items[index].checked = eventTarget.checked;
    this.setState((prevState) => ({
      items,
    }));
    if (this.props.onChange) {
      this.props.onChange(items[index]);
    }
  };

  handleFilterChange = (filter) => {
    this.setState(() => ({
      filter,
    }));
  };

  getFilteredItems = () => {
    const { items, filter } = this.state;
    return items.filter(
      (it) =>
        it[this.props.labelKey] &&
        it[this.props.labelKey].toLowerCase().startsWith(filter.toLowerCase())
    );
  };

  handleOkClick = () => {
    const { items, filter } = this.state;
    const checkedItems = items.filter((i) => i.checked);
    this.props.onOk(checkedItems, checkedItems.length === items.length, filter);
  };

  handleCancelClick = () => this.props.onCancel();

  render() {
    const { rowHeight, hasFilterBox } = this.props;
    return (
      <AutoSizer>
        {({ width, height }) => (
          <div>
            {hasFilterBox ? (
              <FilterBar
                value={this.state.filter}
                onChange={this.handleFilterChange}
                height={40}
              />
            ) : null}
            <Checkboxes
              height={height-40}
              width={width}
              items={this.getFilteredItems()}
              labelKey={this.props.labelKey}
              filtered={!!this.state.filter}
              rowHeight={rowHeight}
              onChange={this.handleChange}
              onSelectAllChange={this.handleSelectAllChange}
            />
          </div>
        )}
      </AutoSizer>
    );
  }
}

export default VirtualizedCheckbox;
