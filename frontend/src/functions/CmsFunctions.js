import { ImageComponent } from '../components/BaseComponent'
import { getPost, getImage, getSections } from './HTTPClient'
const functions = { getPost, getImage, getSections };


//expects a 'tag', which'll be a string, in enclosed in '[%' and '%]'
//returns an object with a react component as the 'body' property, and the 'wordiness' as a property as well
function evalTag(tag, wordiness=0) {
  let out = { wordiness, body: (<span></span>) };

  tag = tag.replaceAll(/\[%\s*|\s*%\]/g, '');
  let values = tag.split(/\s+/);

  values.forEach((value, index) => {
    if (value.includes('=')) {
      let keyval = value.split('=', 2);
      out[keyval[0]] = keyval[1];
    }
  });

  //ensure the wordiness is a valid Number
  out.wordiness = Number(out.wordiness) || wordiness;

  switch (values[0]) {
    case 'img':
      out.body = (<ImageComponent functions={functions} imageName={values[1]} imageOnly={true} id={out.imgId || out.id}/>);
      if (!out.imgId)
        delete out.id; //we don't want the parent obj to have the same id
      break;
    default:
      values = values.filter(val => !val.includes('='));
      out.body = (<span>{values.join(' ')}</span>);
  }

  return out;
}

//function that seperates dynamic content (denoted within [%, %]) and static text
//returns an Array of substrings
function getSegments(textStr, staticVals=true, dynamicVals=true) {
  const opener = '[%';
  const closer = '%]';
  let segments = [];
  let segment = ['', false]; //these segments will be the source text & a bool to describe whether or not they're dynamic

  for (let i = 0; i < textStr.length; i++) {
    let nextTwo = textStr.substring(i, i+2);
    if (nextTwo === opener && !segment[1]) {
      if (staticVals) segments.push([ ...segment ]);
      segment[1] = true;
      segment[0] = '';
    } else if (nextTwo === closer && segment[1]) {
      segment[0] += nextTwo;
      i += 2;
      if (dynamicVals) segments.push([ ...segment ]);
      segment[1] = false;
      segment[0] = '';
    }

    if (i < textStr.length) segment[0] += textStr[i];
  }

  if (segment[0]) segments.push([ ...segment ]);

  return segments;
}

//takes the main text as an input, and returns a list of objects (to be rendered)
//each object in the list will have at least a 'body', and a 'wordiness' property
function getComponents(textStr, wordiness=0) {
  let components = [];
  try {
    let segments = getSegments(textStr);
    segments.forEach(segment => {

      if (segment[1]) {
        //dynamic content
        let evaluatedTag = evalTag(segment[0], wordiness)
        components.push(evaluatedTag);
      } else {
        //static content
        components.push({
          body: (<>{segment[0]}</>),
          wordiness
        });
      }
    });

  } catch (error) {
    console.warn(error);
    components.push({
      body: (<>{textStr}</>),
      wordiness
    });
  }

  return components;
}


export { getSegments, getComponents }
