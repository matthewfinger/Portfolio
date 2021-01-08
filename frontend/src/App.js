import React from 'react'
import Nav from './components/Nav'
import { Content, MainContent } from './components/Content'
import Footer from './components/Footer'
import { Options } from './components/Options'
import { getPost, getImage, getSections, getSkills } from './functions/HTTPClient'

const { Component } = React;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skills : []
    }

    this.functions = { getPost, getImage, getSections };
    this.state = this.state || {};
    this.state.wordinessLevel = 0;

  }

  componentDidMount() {
    this.addskills = skills => this.setState({skills});
    getSkills()
      .then(this.addskills);
  }

  incrementWordiness = () => this.setState({wordinessLevel: this.state.wordinessLevel + 1});
  decrementWordiness = () => this.setState({wordinessLevel: this.state.wordinessLevel - 1});

  render() {
    const functions = this.functions;
    const { wordinessLevel } = this.state;
    return (
      <>
        <Nav functions={ functions } postName='Nav'/>
        <Options
          incrementWordiness={this.incrementWordiness}
          decrementWordiness={this.decrementWordiness}
        />
        <article id="pageContent">
          <MainContent functions={ functions } postName='Content' wordiness={wordinessLevel}/>
          <Content functions={ functions } wordiness={wordinessLevel}/>
        </article>
        <Footer functions={ functions } postName='Footer'/>
      </>
    );
  }
}

export default App;
