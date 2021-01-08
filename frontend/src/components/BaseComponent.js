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
    let { ContentComponents, content } = this.state.post;
    let { evaluateDynamicContent } = this.state;
    let wordiness = this.props.wordiness ? this.props.wordiness() : 0;

    //only include components of the body that aren't too wordy
    let filteredComponents = ContentComponents.filter(component => component.wordiness <= wordiness);
    if (!evaluateDynamicContent)
      return (<span data-wordiness={wordiness}>{content}</span>);

    return (
      <>{ filteredComponents.map((Component, index) => (
          <span key={index} id={Component.id} className={Component.className} data-wordiness={wordiness}><Component.body/></span>
        )) }</>
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

      let getWordiness = () => 0;
      if (this.props.wordiness) getWordiness = this.props.wordiness;
      else if (post.wordiness) getWordiness = () => post.wordiness;


      this.setState({post:{...this.state.post, ...post}});

      if (this.state.evaluateDynamicContent)
        getComponents(post, this, getWordiness);

      else {
        post.ContentComponents = [{
          body: (() => (<>{post.content}</>)),
          wordiness: getWordiness()
        }];
        this.setState({post: {...this.state.post, ContentComponents: post.ContentComponents}});
      }
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
        ContentComponents: [{body:(()=>(<></>)), wordiness:0}],
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

class SkillComponent extends Component {
  requiredProperties = ['name', 'description'];

  ImageBanner = () => {
    const skillObject = this.props.skillObject;
    if (!skillObject.image)
      return (<></>);
    return (<img alt="" className="imagebanner" href={skillObject.image} />);
  }

  render() {
    const skillObject = this.props.skillObject || {};

    for (let i = 0; i < this.requiredProperties.length; i++) {
      if (!Object.keys(skillObject).includes(this.requiredProperties[i]))
        return (<></>);
    }
    return (
      <div className="outerskillbox">
        <div className="innerskillbox">
          <this.ImageBanner />
          <h1 className="skillname">{skillObject.name}</h1>
          <p className="skilldescription">{skillObject.description}</p>
        </div>
      </div>
    )
  }
}

class SkillContainer extends Component {

  render() {
    let wordiness = 0;
    if (this.props.wordiness) wordiness = this.props.wordiness();
    const skills = this.props.skillList.filter(skill => skill.wordiness <= wordiness);
    return (
      <div className="skillcontainer">
        { skills.map((skill, index) => (<SkillComponent key={index} skillObject={skill} />)) }
      </div>
    );
  }
}

export { BaseComponent, ImageComponent, SkillContainer, SkillComponent }
