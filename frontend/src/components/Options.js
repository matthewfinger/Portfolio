import { Component } from 'react';

class BackgroundSlider extends Component {
  changebackground = event => {
    let background = `hsl(${event.target.value}, 100%, 8%)`;
    if (Number(event.target.value) <= 3)
      background = `hsl(${event.target.value}, 0%, 8%)`;
    document.body.style.background = background;
    this.setState({value:event.target.value});
  }

  constructor(props) {
    super(props);
    this.state = {
      value: 188
    };
  }

  render() {
    return (
      <div className='optionsRow'>
        <input onInput={this.changebackground} type="range" min="1" max="360" value={this.state.value} className="slider" id="myRange" />
      </div>
    );
  }
}

class Options extends Component {

  GetBackgroundSlider = () => {
    if (this.props.getWordiness() >= 2) {
      return (<BackgroundSlider />);
    }

    return (<></>);
  }
  render() {
    const missingProp = propName => () => console.log(`prop '${propName}' missing! should be a function for 'Options' component`);
    const incrementWordiness = this.props.incrementWordiness || missingProp('incrementWordiness');
    const decrementWordiness = this.props.decrementWordiness || missingProp('decrementWordiness');
    const getWordiness = this.props.getWordiness || missingProp('getWordiness');
    const range = this.props.range || [0,2];
    return (
      <div id='pageOptions'>
        <div className='optionsRow'>
          <button onClick={decrementWordiness} disabled={getWordiness()<=range[0]}>- Details</button>
          <button onClick={incrementWordiness} disabled={getWordiness()>=range[1]}>+ Details</button>
        </div>
        <this.GetBackgroundSlider />
      </div>
    );
  }
}


export { Options }
