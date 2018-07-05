import { html, LitElement } from '@polymer/lit-element';
import CSS from './_components.drag-and-drop-css';

function isJson (file) {
  const { name } = file;
  return name.substr(name.length - 4, 4) === 'json';
}

class DragAndDrop extends LitElement {
  constructor () {
    super();
    this.isDraggedOver = false;
    this.denyDrop = false;
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  static get properties () {
    return {
      isDraggedOver: Boolean,
      denyDrop: Boolean,
      onDrop: Function
    };
  }

  handleDragOver () {
    this.isDraggedOver = true;
  }

  handleDragLeave (e) {
    this.isDraggedOver = false;
  }

  ignoreDragLeave (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDrop (e) {
    e.preventDefault();
    this.isDraggedOver = false;

    const file = e.dataTransfer.files[0];
    this.denyDrop = !isJson(file);

    if (this.denyDrop) {
      return;
    }

    this._props.onDrop(file);
  }

  _propertiesChanged (props, changedProps, prevProps) {
    this._props = props;
    super._propertiesChanged(props, changedProps, prevProps);
  }

  _render () {
    const classes = [
      'buv-c-drag-and-drop',
      this.isDraggedOver ? 'is-active' : ''
    ].join(' ');

    const denyText = this.denyDrop ? 'Only JSON files are accepted' : '';

    return html`
    ${CSS}
    <div 
      class$='${classes}'
      ondragover='${this.handleDragOver}'
      ondragleave='${this.handleDragLeave}'
      ondrop='${this.handleDrop}'
    >
      <p ondragleave='${this.ignoreDragLeave}'>You can also drag and drop a certificate file (accepted format: JSON)</p>
      <span ondragleave='${this.ignoreDragLeave}'>${denyText}</span>
      <slot ondragleave='${this.ignoreDragLeave}'></slot>
    </div>`;
  }
}

window.customElements.define('buv-drag-and-drop-raw', DragAndDrop);

// wrap DragAndDrop in order to plug into Container
// necessary trade-off to deal with class component in the store connector
function DragAndDropWrapper (props) {
  return html`
  <buv-drag-and-drop-raw
    onDrop='${props.onDrop}'
  >
  <slot></slot>
</buv-drag-and-drop-raw>`;
}

export { DragAndDropWrapper as DragAndDrop };
