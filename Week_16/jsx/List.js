import { Component, STATE, ATTREIBUTE, createElement } from "./framework";
import { enableGesture } from "./gesture";
export { STATE, ATTREIBUTE } from "./framework";

export class List extends Component {
  constructor() {
    super();
  }
  render() {
    
    this.children = this[ATTREIBUTE].data.map(this.template);
    this.childContainer = (<span />);
    this.root = (<div>{this.children}</div>).render();
    return this.root;
  }

  appendChild(child) {
    this.template = (child);
    this.render();
  }
}