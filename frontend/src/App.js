import React from 'react'
import Nav from './components/Nav'
import { Content, MainContent } from './components/Content'
import Footer from './components/Footer'
import { getPost, getImage, getSections } from './functions/HTTPClient'

const { Component } = React;

getSections()
.then(console.log)

class App extends Component {
  constructor(props) {
    super(props);
    this.functions = { getPost, getImage, getSections };
  }

  render() {
    const functions = this.functions;
    return (
      <>
        <Nav functions={ functions } postName='Nav'/>
        <article id="pageContent">
          <MainContent functions={ functions } postName='Content'/>
          <Content functions={ functions }/>
        </article>
        <Footer functions={ functions } postName='Footer'/>
      </>
    );
  }
}

export default App;
