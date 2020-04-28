import React, { Component } from 'react';
import { List } from 'react-virtualized';

const Checkbox = ({ onChange, checked, label, style }) =>
  <div style={{ ...style, textAlign: 'left' }}>
    <label>
      <input
        type="checkbox"
        value={label}
        onChange={onChange}
        checked={checked || false}
      />
      {label}
    </label>
  </div>;

class Checkboxes extends Component {
  componentWillReceiveProps() {
    this.list.forceUpdateGrid();
  }

  handleChange = event => {
    const { labelKey, onChange } = this.props;
    onChange({ [labelKey]: event.target.value, checked: event.target.checked });
  };

  checkboxRenderer = ({ index, style }) => {
    const { items, labelKey } = this.props;
    const item = items[index - 1];
    return (
      <Checkbox
        style={style}
        key={item[labelKey]}
        onChange={this.handleChange}
        label={item[labelKey]}
        checked={item.checked}
      />
    );
  };

  render() {
    const { items, rowHeight, height, width } = this.props;
    console.log('check boxes height is : ', height)
    const rowCount = items.length
    return (
      <List
        height={height}
        width={width}
        ref={ref => {
          this.list = ref;
        }}
        rowCount={rowCount}
        rowHeight={rowHeight}
        rowRenderer={this.checkboxRenderer}
      />
    );
  }
}

export default Checkboxes;
