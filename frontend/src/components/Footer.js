import BaseComponent from './BaseComponent'

class Footer extends BaseComponent {
  render() {
    return (
      <footer id="pageFooter">
        <this.Title />
        <this.Subtitle />
        <this.Content />
      </footer>
    );
  }
}

export default Footer
