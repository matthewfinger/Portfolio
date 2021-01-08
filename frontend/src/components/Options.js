import { Component } from 'react';

class Options extends Component {
  render() {
    const missingProp = propName => () => console.log(`prop '${propName}' missing! should be a function for 'Options' component`);
    const incrementWordiness = this.props.incrementWordiness || missingProp('incrementWordiness');
    const decrementWordiness = this.props.decrementWordiness || missingProp('decrementWordiness');
    const getWordiness = this.props.getWordiness || missingProp('getWordiness');
    const range = this.props.range || [0,3];
    return (
      <div id='pageOptions'>
        <div className='optionsRow'>
          <button onClick={decrementWordiness} disabled={getWordiness()<=range[0]}>- Details</button>
          <button onClick={incrementWordiness} disabled={getWordiness()>=range[1]}>+ Details</button>
        </div>
      </div>
    );
  }
}


export { Options }
