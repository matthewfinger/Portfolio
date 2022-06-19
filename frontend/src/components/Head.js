import {BaseComponent} from './BaseComponent'

class Head extends BaseComponent {

  render() {
    return (
      <header id="pageHeader">
        <this.Title />
        <this.Subtitle />
      </header>
    );
  }
}

export default Head
