import BaseComponent from './BaseComponent'

class Content extends BaseComponent {
  render() {
    return (
      <article id="pageContent">
        <this.Title />
        <this.Subtitle />
        <this.Content />
      </article>
    );
  }
}

export default Content
