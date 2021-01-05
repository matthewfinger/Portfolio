import React from 'react'
import { getPost, getImage, getSections } from '../functions/HTTPClient'
import { getComponents } from '../functions/CmsFunctions'
const { Component } = React;

class BaseComponent extends Component {

  Title = () => {
    const {title, title_id, title_class} = this.state.post;
    if (!title) return (<></>);
    return (<h1 className={title_class} id={title_id}>{title}</h1>);
  }

  Subtitle = () => {
    const {subtitle, subtitle_id, subtitle_class} = this.state.post;
    if (!subtitle) return (<></>);
    return (<h3 className={subtitle_class} id={subtitle_id}>{subtitle}</h3>);
  }

  ContentBody = () => {
    const { ContentComponents, content } = this.state.post;
    const { evaluateDynamicContent } = this.state;
    const wordiness = this.props.wordiness || 0;

    //only include components of the body that aren't too wordy
    const filteredComponents = ContentComponents.filter(component => component.wordiness <= wordiness);

    if (!evaluateDynamicContent)
      return (<span data-wordiness={wordiness}>{content}</span>);

    return (
      <>{filteredComponents.map(component => (
          <span id={component.id} className={component.className} data-wordiness={wordiness}>{component.body}</span>
        ))}</>
    );

  }

  Content = () => {
    const { content_id, content_class } = this.state.post;

    return (
      <div className={content_class} id={content_id}>
        <this.ContentBody />
      </div>
    );
  }

  getResourceFunction() {
    return this.state.functions[this.state.resourceFunction] || (() => {
      throw Error(`Function with key ${this.state.resourceFunction} must be added to functions prop object!`);
    });
  }

  async getResource() {
    try {
      if (!(this.props.postName || this.props.postObject)) return;
      const postName = this.props.postName || '';
      let post = this.props.postObject;

      if (!post)
        post = await this.getResourceFunction()(postName);

      const wordiness = this.props.wordiness || post.wordiness || 0;


      if (this.state.evaluateDynamicContent)
        post.ContentComponents = getComponents(post.content, wordiness);
      else
        post.ContentComponents = [{
          body: (<>{post.content}</>),
          wordiness
        }]

      this.setState({post:{...this.state.post, ...post}});
    } catch (error) {
      console.warn(error);
    }
  }


  constructor(props) {
    super(props);
    this.state = {
      functions: this.props.functions || { getPost, getImage, getSections },
      resourceFunction: this.props.resourceFunction || 'getPost',
      evaluateDynamicContent: this.props.evaluateDynamicContent || true,
      post: {
        container_id: '',
        container_class: '',
        title: '',
        title_id: '',
        title_class: '',
        subtitle: '',
        subtitle_id: '',
        subtitle_class: '',
        ContentComponents: [{body:(<></>), wordiness:0}],
        content: '',
        content_id: '',
        content_class: '',
      }
    };
    //if (this.props.postObject) this.state = { ...this.state, post: { ...this.props.postObject } };
  }

  async componentDidMount() {
    this.getResource();
  }

  render() {
    return (
      <div id={this.state.post.container_id} className={this.state.post.container_class}>
        <this.Title />
        <this.Subtitle />
        <this.Content />
      </div>
    );
  }
}

class ImageComponent extends BaseComponent {
  constructor(props) {
    super(props);
    this.state.resourceFunction = 'getImage';
    delete this.state.post;
    this.state.imageurl = '';
    this.state.resourceserver = props.resourceserver || 'http://localhost:8000';
  }

  async getResource() {
    try {
      const imageName = this.props.imageName || '';
      let imageUrl = await this.getResourceFunction()(imageName);
      this.setState({imageurl: this.state.resourceserver + imageUrl.image});
    } catch (error) {
      console.warn(error);
    }
  }

  async componentDidMount() {
    this.getResource();
  }

  Img = () => {
    return (<img id={this.props.id || ''} src={this.state.imageurl} alt={this.props.alt || ""} />);
  }

  render () {
    if (this.props.imageOnly) return (<this.Img />);
    return (
      <div id={this.props.containerId || ""}>
        <this.Img />
        <h3>Matthew Finger</h3>
        <h2>Web Developer</h2>
      </div>
    );
  }
}

export { BaseComponent, ImageComponent }
