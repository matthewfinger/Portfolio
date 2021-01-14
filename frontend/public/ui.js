let BREAKPOINT_PAIRS = [];


function registerBreakpoint(querySelector, breakpointTable) {
  let elements = () => Array(document.querySelector(`${querySelector}`));

  if (!breakpointTable.lastKey)
    breakpointTable.lastKey = null;

  BREAKPOINT_PAIRS.push([elements, breakpointTable]);
}

//finds the current entry out of the ones specified
function getCurrentBreakpointKey(breakpointTable) {
  const width = window.innerWidth;
  let keys = Object.keys(breakpointTable).sort().filter(key => !isNaN(key)).map(key => Number(key));
  let min = 0;
  for (let i = 0; i < keys.length; i++) {
    if (width >= min && width <= keys[i]) return keys[i];
    min = keys[i];
  }
  return keys.pop();
}

// runs breakpoint function on each element
function evaluateBreakpoint(breakpointPair) {
  let breakpointTable = breakpointPair[1];
  let currentKey = getCurrentBreakpointKey(breakpointTable);
  if (breakpointTable.lastKey === currentKey) return;

  let elements = breakpointPair[0]();
  let callback = breakpointTable[currentKey];
  elements.forEach(element => {
    callback(element);
  });
  if (!elements[0].type == 'iframe')
    breakpointTable.lastKey = currentKey;
}

function hideElement(element) {
  element.style.visibility = 'hidden';
  element.style.width = "0";
  element.style.height = '0';
  element.style.margin = '0';
}

function showElement(element) {
  element.style.width = '';
  element.style.height = '';
  element.style.margin = '';
  element.style.visibility = 'visible';
}

function sizeIframe(element) {
  if (element && element.contentWindow) {
    try {
      element.style.height = element.contentWindow.document.body.scrollHeight + 'px';
    } catch (error) {
      element.style.height = '1000px';
    }
  }
}

document.body.onload = () => {

  //register the logo hide breakpoint
  registerBreakpoint('#section1LogoContainer', {'1023': hideElement, '1024': showElement});
  //registerBreakpoint('#contactform', {'500': sizeIframe, '501': sizeIframe});
  //BREAKPOINT_PAIRS.forEach(pair => evaluateBreakpoint(pair));
  window.setInterval(() => BREAKPOINT_PAIRS.forEach(pair => evaluateBreakpoint(pair)), 50);
  const contactform = () => document.getElementById('contactform');
  let contactforminterval = setInterval(() => {
    if (contactform()) {
      contactform().onload = e => sizeIframe(e.target);
    }
  }, 50)
}
