import { BaseComponent, ImageComponent } from '../components/BaseComponent'
import { getPost, getImage, getSections } from './HTTPClient'
const functions = { getPost, getImage, getSections };

function evalTag(tag) {
  tag = tag.replaceAll(/\[%\s*|\s*%\]/g, '');
  let values = tag.split(/\s+/);
  let options = {
    'id': ''
  };
  if (values.length < 2) return '';
  values.forEach((value, index) => {
    if (value.includes('=')) {
      let keyval = value.split('=', 2);
      options[keyval[0]] = keyval[1];
    }
  })
  console.log(values[1])
  switch (values[0]) {
    case 'img':
      return (<ImageComponent functions={functions} imageName={values[1]} imageOnly={true} id={options.id}/>);
      break;
    default:
      return (<></>);

  }
}

//function that seperates dynamic content (denoted within [%, %]) and static text
function getSegments(textStr) {
  const opener = '[%';
  const closer = '%]';
  let segments = [];
  let segment = ['', false]; //these segments will be the source text & a bool to describe whether or not they're dynamic

  for (let i = 0; i < textStr.length; i++) {
    let nextTwo = textStr.substring(i, i+2);
    if (nextTwo === opener && !segment[1]) {
      segments.push([ ...segment ]);
      segment[1] = true;
      segment[0] = '';
    } else if (nextTwo === closer && segment[1]) {
      segment[0] += nextTwo;
      i += 2;
      segments.push([ ...segment ]);
      segment[1] = false;
      segment[0] = '';
    }

    if (i < textStr.length) segment[0] += textStr[i];
  }

  if (segment[0]) segments.push([ ...segment ]);

  return segments;
}

//converts content text into usable components
function getComponents(textStr) {
  try {
    let segments = getSegments(textStr);
    let components = [];
    segments.forEach(segment => {
      if (segment[1]) {
        components.push(() => evalTag(segment[0]));
      } else {
        components.push(() => (<>{segment[0]}</>))
      }
    });
    return components;
  } catch (error) {
    console.warn(error);
    return (<>{textStr}</>);
  }
}


//wrapper for getComponents that cn be treated as a component
function MainComponent(textStr) {
  let components = getComponents(textStr);
  return (<>{components.map((Component, index) => <span key={index}><Component /></span>)}</>);
}


export { getSegments, getComponents, MainComponent }
