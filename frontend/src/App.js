import React from 'react'
import Nav from './components/Nav'
import Content from './components/Content'
import Footer from './components/Footer'
import getPost from './functions/HTTPClient'

const { Component } = React;

class App extends Component {
  constructor(props) {
    super(props);
    this.getPost = getPost;
  }

  render() {
    return (
      <>
        <Nav getPostFunction={ this.getPost } postName='Nav'/>
        <Content getPostFunction={ this.getPost } postName='Content'/>
        <Footer getPostFunction={ this.getPost } postName='Footer'/>
      </>
    );
  }
}

export default App;
