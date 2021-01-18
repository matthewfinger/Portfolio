import React from 'react';
import { getPost, getImage, getSections, default_base_url } from '../functions/HTTPClient';
import { getComponents } from '../functions/CmsFunctions';
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
    filteredComponents = filteredComponents.map(component => {return { ...component, Body:component.body };});
    if (!evaluateDynamicContent)
      return (<span data-wordiness={wordiness}>{content}</span>);

    return (
      <>{filteredComponents.map((Component, index) => (
          <span key={index} id={Component.id} className={Component.className} data-wordiness={wordiness}><Component.Body/></span>
        ))}</>
    );

  }

  Content = () => {
    const { content_id, content_class } = this.state.post;

    return (
      <div className={content_class} id={content_id}>
        {this.ContentBody()}
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
        <hr/>
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
    this.state.resourceserver = props.resourceserver || 'http://backend.mattfinger.info';
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
  fetchedComponents = false;

  constructor(props) {
    super(props);
    this.state = {imageUrl: '', components: []};
  }

  ImageBanner = () => {
    const skillObject = this.props.skillObject;
    const imageUrl = this.state.imageUrl;

    if (!skillObject.image || !imageUrl) {
      const callback = res => this.setState({imageUrl: default_base_url + res.image});
      if (skillObject.image) {
        getImage(skillObject.image, false)
          .then(callback);
      }

      return (<span></span>);
    }

    return (<img alt={skillObject.name} className="imagebanner" src={imageUrl} />);
  }

  async componentDidMount() {

  }

  render() {
    const skillObject = this.props.skillObject || {};

    for (let i = 0; i < this.requiredProperties.length; i++) {
      if (!Object.keys(skillObject).includes(this.requiredProperties[i]))
        return (<></>);
    }

    if (!this.fetchedComponents) {
      const callback = components => this.setState({components});
      this.fetchedComponents = true;
      getComponents({textStr:skillObject.description}, null, () => 0, true)
        .then(async coms => coms.map(component => component.body))
        .then(callback);
    }

    return (
      <div className="outerskillbox">
        <article className="innerskillbox">
          <header className="skillheader">
            <this.ImageBanner />
            <h1 className="skillname">{skillObject.name}</h1>
          </header>
          <hr/>
          <section className="skilldescription">
            { this.state.components.map((C, index) => (<span key={index}><C /></span>)) }
          </section>
        </article>
      </div>
    )
  }
}

class SkillContainer extends Component {

  render() {
    let wordiness = 0;
    if (this.props.wordiness) wordiness = this.props.wordiness();
    let skills = this.props.skillList.filter(skill => skill.wordiness <= wordiness);
    return (
      <div className="skillcontainer">
        { skills.map((skill, index) => (<SkillComponent key={index} skillObject={skill} />)) }
      </div>
    );
  }
}

class SampleComponent extends Component {
  requiredProperties = ['name', 'description', 'href'];
  fetchedComponents = false;

  constructor(props) {
    super(props);
    this.state = {imageUrl: '', components: []};
  }

  ImageBanner = () => {
    const sampleObject = this.props.sampleObject;
    const imageUrl = this.state.imageUrl;

    if (!sampleObject.image || !imageUrl) {
      const callback = res => this.setState({imageUrl: default_base_url + res.image});

      if (sampleObject.image) {
        getImage(sampleObject.image, false)
          .then(callback);
      }

      return (<></>);
    }

    return (<img alt={sampleObject.name} className="imagebanner" src={imageUrl} />);
  }

  render() {
    const sampleObject = this.props.sampleObject || {};

    for (let i = 0; i < this.requiredProperties.length; i++) {
      if (!Object.keys(sampleObject).includes(this.requiredProperties[i]))
        return (<></>);
    }

    if (!this.fetchedComponents) {
      const callback = components => this.setState({components});
      this.fetchedComponents = true;
      getComponents({textStr:sampleObject.description}, null, () => 0, true)
        .then(async coms => coms.map(component => component.body))
        .then(callback);
    }



    return (
      <div className="outersamplebox">
        <div className="innersamplebox">
          <this.ImageBanner />
          <a href={sampleObject.href} className="sampleAnchor" target="_blank" rel="noreferrer">
            <h1 className="samplename">{sampleObject.name}</h1>
            <h4 className="sampleurl">{sampleObject.href}</h4>
          </a>
          <hr/>
          <div className="sampledescription">
            {this.state.components.map((C, index) => (<span key={index}><C /></span>))}
          </div>
        </div>
      </div>
    )
  }
}

class SampleContainer extends Component {

  render() {
    let wordiness = 0;
    if (this.props.wordiness) wordiness = this.props.wordiness();
    let samples = this.props.sampleList.filter(sample => sample.wordiness <= wordiness);
    return (
      <div className="samplecontainer">
        { samples.map((sample, index) => (<SampleComponent key={index} sampleObject={sample} />)) }
      </div>
    );
  }
}

export {
  BaseComponent,
  ImageComponent,
  SkillContainer,
  SkillComponent,
  SampleContainer,
  SampleComponent
}
