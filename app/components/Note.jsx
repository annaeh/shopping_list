import React from 'react';

import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const noteSource = {
  beginDrag(props) {
    return {
      id: props.id,
    };
  }, 
  isDragging(props, monitor) {
  return props.id === monitor.getItem().id;
}
};

const noteTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(sourceId !== targetId) {
      targetProps.onMove({sourceId, targetId});
    }
  }
};

@DragSource(ItemTypes.NOTE, noteSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))

export default class Note extends React.Component {
  render() {
    const {connectDragSource, connectDropTarget, isDragging, id, onDelete, name, amount, value, editing, onMove, ...props} = this.props;
    const dragSource = editing ? a => a : connectDragSource;
    return dragSource(connectDropTarget(
      <li style={{
        opacity: isDragging ? 0: 1
      }} {...props}>{editing ? this.renderEdit() : this.renderValue()}</li>
    ));
  }

  renderValue = () => {
    const onDelete = this.props.onDelete;

    return (
    <div>
      <span onClick={this.props.onValueClick}>Item: {this.props.name} <br /></span>
      {onDelete ? this.renderDelete() : null }
      <span>Price: {this.props.amount} <br /></span>
      <span>SKU: {this.props.id} <br /></span> 
      </div>
    );
  };

 renderEdit = () => {
    return <input type="text"
      ref={
        (e) => e ? e.selectionStart = this.props.name.length : null
      }
      autoFocus={true}
      defaultValue={this.props.name}
      onBlur={this.finishEdit}
      onKeyPress={this.checkEnter} />;
  };

  renderDelete = () => {
    return <button

      className="delete"

      onClick={this.props.onDelete}>x</button>;
  };


  checkEnter = (e) => {
    if(e.key === 'Enter') {
      this.finishEdit(e);
    }
  };
  finishEdit = (e) => {
    const value = e.target.name;

    if(this.props.onEdit) {
      this.props.onEdit(name);

    }
  };
}