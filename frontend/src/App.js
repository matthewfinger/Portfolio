import React from 'react'
import Nav from './components/Nav'
import { Content, MainContent } from './components/Content'
import Footer from './components/Footer'
import { Options } from './components/Options'
import { getPost, getImage, getSections } from './functions/HTTPClient'

const { Component } = React;

getSections()
.then(console.log)

class App extends Component {
  constructor(props) {
    super(props);
    this.functions = { getPost, getImage, getSections };
    this.state = this.state || {};
    this.state.wordinessLevel = 0;
  }

  incrementWordiness = () => this.setState({wordinessLevel: this.state.wordinessLevel + 1});
  decrementWordiness = () => this.setState({wordinessLevel: this.state.wordinessLevel - 1});

  render() {
    const functions = this.functions;
    return (
      <>
        <Nav functions={ functions } postName='Nav'/>
        <Options
          incrementWordiness={this.incrementWordiness}
          decrementWordiness={this.decrementWordiness}
        />
        <article id="pageContent">
          <MainContent functions={ functions } postName='Content' wordiness={this.state.wordinessLevel}/>
          <Content functions={ functions } wordiness={this.state.wordinessLevel}/>
        </article>
        <Footer functions={ functions } postName='Footer'/>
      </>
    );
  }
}

export default App;
