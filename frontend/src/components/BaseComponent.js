import React from 'react'
import { getPost, getImage, getSections } from '../functions/HTTPClient'
import { getSegments, getComponents, MainComponent } from '../functions/CmsFunctions'
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

  Content = () => {
    const {content, content_id, content_class} = this.state.post;
    if (!content) return (<></>);
    const AdjustedContent = () => MainComponent(content);
    return (<div className={content_class} id={content_id}><AdjustedContent /></div>);
  }

  getResourceFunction() {
    return this.state.functions[this.state.resourceFunction] || (() => {
      throw Error(`Function with key ${this.state.resourceFunction} must be added to functions prop object!`);
    });
  }

  async getResource() {
    try {
      if (!this.props.postName) return;
      const postName = this.props.postName || '';
      let post = await this.getResourceFunction()(postName);
      this.setState({post:{...this.state.post, ...post}});
    } catch (error) {
      console.warn(error);
    }
  }


  constructor(props) {
    super(props);
    this.state = {
      functions: this.props.functions || {},
      resourceFunction: 'getPost',
      post: {
        container_id: '',
        container_class: '',
        title: '',
        title_id: '',
        title_class: '',
        subtitle: '',
        subtitle_id: '',
        subtitle_class: '',
        content: '',
        content_id: '',
        content_class: ''
      }
    };
    if (this.props.postObject) this.state = { ...this.state, post: { ...this.props.postObject } };
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
