import React from 'react'
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
    return (<div className={content_class} id={content_id}>{content}</div>);
  }


  constructor(props) {
    super(props);
    this.state = {
      post: {
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
  }

  async componentDidMount() {
    try {
      const postName = this.props.postName || '';
      let post = await this.props.getPostFunction(postName);
      this.setState({post:{...this.state.post, ...post}});
    } catch (error) {
      console.warn(error);
    }
  }


  render() {
    return (
      <div>
        <this.Title />
        <this.Subtitle />
        <this.Content />
      </div>
    );
  }
}

export default BaseComponent
