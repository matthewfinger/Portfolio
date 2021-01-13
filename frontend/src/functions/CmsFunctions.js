import { ImageComponent, SkillContainer } from '../components/BaseComponent'
import { getPost, getImage, getSections, fetchList } from './HTTPClient'
const functions = { getPost, getImage, getSections };

//the intended use if this table is to map names of functions (strings) to functions (js)
//mainly for to eval tags from the backend
//each function SHOULD take in a 'props' arg
const postFunctions = {
  "SkillList" : props => (<SkillContainer skillList={props.list} wordiness={props.getWordiness} />)
};


//expects a 'tag', which'll be a string, in enclosed in '[%' and '%]'
//returns an object with a react component as the 'body' property, and the 'wordiness' as a property as well
async function evalTag(tag, getWordiness=()=>0) {
  let out = { getWordiness, wordiness:getWordiness(), body: (<span></span>) };

  tag = tag.replaceAll(/\[%\s*|\s*%\]/g, '');
  let values = tag.split(/\s+/);

  values.forEach((value, index) => {
    if (value.includes('=')) {
      let keyval = value.split('=', 2);
      out[keyval[0]] = keyval[1];
    }
  });

  // try to ensure the wordiness is a valid Number
  out.wordiness = Number(out.wordiness) || getWordiness();
  const tempOut = { ...out };

  switch (values[0]) {
    case 'img':
      out.body = () => (<ImageComponent functions={functions} imageName={values[1]} imageOnly={true} id={tempOut.imgId || tempOut.id}/>);
      if (!out.imgId)
        delete out.id; //we don't want the parent obj to have the same id
      break;
    case 'list':
      if (values.length >= 3 && postFunctions[values[2]]) {
        const list = await fetchList(values[1]);
        try {
          const props = {
            ...out,
            list
          }
          out.body = () => postFunctions[values[2]](props);
        } catch (err) {
          console.warn(err);
        }
      }
      break;
    case 'frame':
      out.body = () => (<></>);
      if (values.length >= 2) {
        out.body = () => (<iframe id={ tempOut.frameid || tempOut.id || ''} src={values[1]} width={tempOut.width || 'auto'} height={tempOut.height || 'auto'}></iframe>);
        if (!tempOut.frameid && tempOut.id) delete out.id;
      }
      break;
    case 'nl':
    case 'newline':
      let lineCount = 1;
      if (values[1] && Number(values[1]) > 0)
        lineCount = Number(values[1]).toPrecision(1);

      let lineBreaks = [];
      for (let i = 0; i < lineCount; i++) {
        lineBreaks.push((<br key={i} />))
      }
      out.body = () => (<>{lineBreaks}</>);
      break;
    case 'bold':
    case 'underline':
    case 'italic':
      const styles = ['bold', 'underline','italic'];
      let selectedStyles = {};
      let stylesSpecified = 0;
      styles.forEach(style => {
        selectedStyles[style] = values.slice(0, styles.length).includes(style)
        if (selectedStyles[style]) stylesSpecified++;
      });
      values = values.slice(stylesSpecified).filter(val => !val.includes('=')).map(val => val.replaceAll('\\s', ' '));
      let styledContent = (<>{values.join(' ')}</>);
      if (selectedStyles['italic']) styledContent = (<i>{styledContent}</i>);
      if (selectedStyles['bold']) styledContent = (<b>{styledContent}</b>);
      if (selectedStyles['underline']) styledContent = (<u>{styledContent}</u>);
      out.body = () => styledContent;
      break;
    default:
      values = values.filter(val => !val.includes('=')).map(val => val.replaceAll('\\s', ' '));
      out.body = () => (<span>{values.join(' ')}</span>);
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
async function getComponents(post, parentComponent, getWordiness=()=>0) {
  const textStr = post.content || post.textStr;
  let components = [];
  const BaseBody = seg => () => (<>{seg}</>);
  try {
    let segments = getSegments(textStr);
    let segment = [];
    for (let i = 0; i < segments.length; i++) {
      segment = segments[i]

      if (segment[1]) {
        //dynamic content
        let evaluatedTag = await evalTag(segment[0], getWordiness)
        components.push(evaluatedTag);
      } else {
        //static content
        components.push({
          body: BaseBody(segment[0]),
          wordiness: getWordiness()
        });
      }
    }

  } catch (error) {
    console.warn(error);
    components.push({
      body: BaseBody(textStr),
      wordiness: getWordiness()
    });
  }



  parentComponent.setState({
    post : {
    ...parentComponent.state.post,
    ...post,
    ContentComponents: components
  }})


}


export { getSegments, getComponents }
