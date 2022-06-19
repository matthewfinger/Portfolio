import React from 'react';
import { getPost, getImage, getSections, default_base_url } from '../functions/HTTPClient';
import { getComponents } from '../functions/CmsFunctions';
const { Component, createRef } = React;

class TextToggle extends Component {
  randomMap = {}
  randomIndices = {}

  constructor(props) {
    super(props);
    let words = props.words || [];
    let currentStr = words[0];
    this.randomMap = {};
    this.ref = createRef();
    this.state = {
      prefix : props.prefix || "",
      words,
      suffix: props.suffix || "",
      wordIndex: 0,
      wordLength: currentStr.length,
      expanding: true,
      fullCount: Math.round(65 + (1.2 * currentStr.length) * 0.5),
      randomIterations: props.randomIterations || 10, // number of iterations per str length
      currentStr
    }
  }

  getRandomString(length) {
    let out = '';
    if ( !this.randomMap[length] || this.randomMap[length].length < this.state.randomIterations ) {
      for ( let i = 0; i <= length; i++ ){
        let x = Math.floor( Math.random() * 26 ) + 97;
        out += String.fromCharCode(x);
      }
      this.randomMap[length] = this.randomMap[length] || [];
      this.randomIndices[length] = this.randomIndices[length] || 0;
      this.randomMap[length].push(out);
    } else {
      out = this.randomMap[length][this.randomIndices[length]++];
      if( this.randomIndices[length] >= this.randomMap[length].length ) this.randomIndices[length] = 0;
    }
    return out;
  }

  getText = () => {
    let {expanding, wordIndex, wordLength, fullCount} = this.state;
    let currentStr = fullCount ?
      this.state.words[wordIndex] : 
       this.props.randomAnimation ? this.getRandomString( Math.round(this.state.words[wordIndex].length * .7 - 1) ) : this.state.words[wordIndex].substr(0, wordLength);


    if (expanding && (this.state.words[wordIndex].length - wordLength === 4) && this.ref && this.ref.current) {
      let shrinkTime = this.props.shrinkTime || 100;
      if (!this.ref.current.style.transitionDuration) this.ref.current.style.transitionDuration = `${shrinkTime}ms`;
      this.ref.current.style.transform = `scale(1.1)`;
      const elem = this.ref.current;
      window.setTimeout(()=> elem.style.transform = 'scale(1)', shrinkTime + 5);
    }
    if ( wordLength >= this.state.words[wordIndex].length ) {
      expanding = false;
      /* Keep it full length for a while */
      if ( fullCount === false )
      {
        fullCount = Math.round((this.props.staticBase || 85) + ((this.props.staticLengthWeight || 1.2) * currentStr.length) * (wordIndex ? 1 : 2.2));
      }
      else if ( fullCount === 0 )
      {
        fullCount = false;
      }
      else
      {
        fullCount--;
      }
    }

    if ( fullCount === false ) {
      if ( expanding ) wordLength++;
      else wordLength--;
    }

    if (wordLength < 0 && !expanding) {
      expanding = true;
      wordLength = 0;
      wordIndex++;
      if ( wordIndex >= this.state.words.length ) {
        wordIndex = 0;
      }
    }

    this.setState({
      ...this.state,
      expanding,
      wordIndex,
      wordLength,
      currentStr,
      fullCount,
    })
  }

  componentDidMount() {
    this.interval = window.setInterval( this.getText.bind(this), this.props.charDelay || 27 );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    // eslint-disable-next-line
    return (
      <span style={{...(this.props.style || {}),display:"inline-block"}} ref={this.ref}>{this.state.prefix + this.state.currentStr + this.state.suffix}</span>
    );
  }
}

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
    this.state.wordiness = props.wordiness();
    this.state.resourceserver = props.resourceserver || 'https://backend.mattfinger.info';
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
    this.props.functions.registerWordinessCallback('imgCmp1', wordiness => {
      this.setState({wordiness});
    });
    await this.getResource();
  }

  componentWillUnmount() {
    this.props.functions.unregisterWordinessCallback('imgCmp1');
  }

  Img = () => {
    return (<img id={this.props.id || ''} src={this.state.imageurl} alt={this.props.alt || ""} />);
  }

  render () {
    if (this.props.imageOnly) return (<this.Img />);
    return (
      <div id={this.props.containerId || ""}>
        <this.Img />
        <h2>Matt Finger</h2>
        <h4 className="mobileOn"><TextToggle style={{
          color: "#fae543"
        }} prefix={"Web "} words={["Consultant", "Developer", "Designer"]} randomAnimation={this.state.wordiness >= 2 ? 1 : 0} /></h4>
        <h5 className="mobileOn">(based in Milwaukee!)</h5>
      </div>
    );
  }
}

class SkillComponent extends Component {
  requiredProperties = ['name', 'description'];
  fetchedComponents = false;
  wordiness = 0;

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
    // @todo line up our heights
  }

  render() {
    const skillObject = this.props.skillObject || {};

    for (let requiredProperty of this.requiredProperties) {
      if (!Object.keys(skillObject).includes(requiredProperty))
        return (<></>);
    }

    if (!this.fetchedComponents || this.wordiness !== this.props.wordiness) {
      const callback = components => {
        this.fetchedComponents = true;
        this.setState({components});
      };

      this.wordiness = this.props.wordiness;
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
            <div>
              { this.state.components.map((C, index) => (<span key={index}><C /></span>)) }
            </div>
            <div className="spacer"></div>
            <div className="priceTag">
              <div>
                {skillObject.price ? (`Standard Cost - $${skillObject.price} ${skillObject.price_unit || 'per hour'}`) : 'Contact for more info!'}{skillObject.price ? <sup> &dagger;</sup> : ""}
              </div>
              <div>
                {skillObject.recurring_price ? ( `Standard Cost - $${skillObject.recurring_price} ${skillObject.recurring_price_unit || 'per month'}` ) : ''}{skillObject.recurring_price ? <sup> &dagger;</sup> : ""}
              </div>
              <div>
                {skillObject.revision_price ? (`Standard Cost - $${skillObject.revision_price} ${skillObject.revision_price_unit || 'per tweak'}`) : ''}{skillObject.revision_price ? <sup> &dagger;</sup> : ""}
              </div>
            </div>
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
      <>
        <div className="skillcontainer">
          {skills.map((skill, index) => {
            return (<SkillComponent wordiness={wordiness} key={index} skillObject={skill}/>);
          })}
        </div>
        <div className="disclaimer">&dagger; The listed price is for the standard skill or service solicited to clients, however there are rare instances in which I have to invoice slightly higher depending on a client's needs!
        I try to keep this low, but there is often a lot of "off hours/off the record" work, such as researching niche tools and industry specific standards that increase the labor required to deliver the service.
        The listed price also does not guarantee my current or future availability to provide a skill or service.</div>
      </>
    );
  }
}

class SampleComponent extends Component {
  requiredProperties = ['name', 'description', 'href'];
  fetchedComponents = false;
  wordiness = 0;

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

    if (!this.fetchedComponents || this.wordiness !== this.props.wordiness) {
      const callback = components => this.setState({components});
      this.fetchedComponents = true;
      this.wordiness = this.props.wordiness;
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
        {samples.map((sample, index) =>
          (<SampleComponent key={index} sampleObject={sample} wordiness={wordiness} />)
        )}
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
