import { BaseComponent, ImageComponent } from './BaseComponent'

//this class is for all content sections
class Content extends BaseComponent {
  //method to sync the sections on the server with the content section of the page
  async getSections() {
    try {
      if (!this.props.functions || !this.props.functions.getSections) throw Error(`A getSections function was expected in the props for the Content Element!`);

      const sections = await this.props.functions.getSections();
      this.setState({ sections });
    } catch (error) {
      console.warn(error);
    }
  }

  constructor(props) {
    super(props);
    if (!this.state) this.state = {};
    this.state.sections = [];
  }

  async componentDidMount() {
    this.getResource();
    this.getSections();
  }

  render() {
    const { sections } = this.state;
    let getWordiness = () => 0;
    if (this.props.wordiness) getWordiness = this.props.wordiness;
    return (
      <>
        {
          sections.map((sectionObject, index) => {
            let out = (<span key={index}></span>);
            if (index > 0) {
              out = (
                <div id={`pageSection${index}`} className="bigsection" key={index}>
                  <BaseComponent functions={this.props.functions || {}} postObject={sectionObject} wordiness={getWordiness}/>
                </div>
              );
            }
            return out;
          })
        }
      </>
    );
  }

}

//this class is for the initial landing page
class MainContent extends Content {
  render() {
    return (
      <section className={this.state.post.container_class}>
        <div>
          <this.Title />
          <hr/>
          <this.Subtitle />
          <this.Content />
        </div>
        <ImageComponent functions={this.state.functions} containerId="section1LogoContainer" id='section1Logo' imageName="Logo1" />
      </section>
    );
  }
}

export { Content, MainContent }
