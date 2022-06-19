import React from 'react'
import Nav from './components/Nav'
import { Content, MainContent } from './components/Content'
import Footer from './components/Footer'
import { Options } from './components/Options'
import { getPost, getImage, getSections, getSkills, sendVisit } from './functions/HTTPClient'
import UiFun from './ui'

const { Component } = React;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skills : []
    }

    this.functions = { getPost, getImage, getSections };
    this.state = this.state || {};
    this.state.wordinessLevel = Number(window.localStorage.getItem('wordinessPreference') || 1);
  }

  wordinessCallbacks = {}

  async componentDidMount() {
    this.addskills = skills => this.setState({skills});
    getSkills()
      .then(() => {
        sendVisit();
        this.scrollFromHrefAnchor();
      });

    this.addskills();

    UiFun();
    let x = 10;
    const interval = window.setInterval(() => {
      UiFun();
      if (x-- === 0) window.clearInterval(interval)
    }, 100);
    this.scrollFromHrefAnchor();
  }

  incrementWordiness = () => {
    let wordinessLevel = this.state.wordinessLevel + 1;
    this.setState({wordinessLevel});
    window.localStorage.setItem('wordinessPreference', wordinessLevel.toString());
    for(let cb of Object.values(this.wordinessCallbacks)) {
      cb(wordinessLevel);
    }
  };

  decrementWordiness = () => {
    let wordinessLevel = this.state.wordinessLevel - 1;
    window.localStorage.setItem('wordinessPreference', wordinessLevel.toString());
    this.setState({wordinessLevel});
    for(let cb of Object.values(this.wordinessCallbacks)) {
      cb(wordinessLevel);
    }
  };

  registerWordinessCallback(name, cb) {
    this.wordinessCallbacks[name] = cb;
  }

  unregisterWordinessCallback(name) {
    delete this.wordinessCallbacks[name];
  }

  scrollFromHrefAnchor() {
    /*  Not sure why, but this is more reliable than using setTimeout */
    let i = 0;
    let scrollThing = setInterval(() => {
      if ( i++ ) {
        clearInterval(scrollThing);
      }
      let components = window.location.href.split('?')[0].split('#');
      if ( components.length > 1 ) {
        let element = document.getElementById(components[1]);
        if ( element && element instanceof HTMLElement ) {
          element.scrollIntoView(true);
        }
      }
    },200);
  }

  render() {
    let functions = this.functions;
    functions.registerWordinessCallback = this.registerWordinessCallback.bind(this);
    functions.unregisterWordinessCallback = this.unregisterWordinessCallback.bind(this);
    const getWordiness = () => this.state.wordinessLevel;
    return (
      <>
        <Nav functions={ functions } postName='Nav'/>
        <Options
          incrementWordiness={this.incrementWordiness}
          decrementWordiness={this.decrementWordiness}
          getWordiness={getWordiness}
        />
        <article id="pageContent">
          <MainContent functions={ functions } postName='Main Content' wordiness={getWordiness}/>
          <Content functions={ functions } wordiness={getWordiness}/>
          <div className="disclaimer fullWidthCenter">&copy; 2022 Matt Finger; All rights reserved.</div>
        </article>
        <Footer functions={ functions } postName='Footer'/>
      </>
    );
  }
}

export default App;
