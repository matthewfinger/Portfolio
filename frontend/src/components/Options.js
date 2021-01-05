import { Component } from 'react';

class Options extends Component {
  render() {
    const missingProp = propName => () => console.log(`prop '${propName}' missing! should be a function for 'Options' component`);
    const incrementWordiness = this.props.incrementWordiness || missingProp('incrementWordiness');
    const decrementWordiness = this.props.decrementWordiness || missingProp('decrementWordiness');

    return (
      <div id='pageOptions'>
        <div className='optionsRow'>
          <button onClick={incrementWordiness}>More Words!</button>
          <button onClick={decrementWordiness}>Less Words!</button>
        </div>
      </div>
    );
  }
}


export { Options }
