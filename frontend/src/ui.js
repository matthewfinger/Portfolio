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
  if (elements[0] && elements[0].type !== 'iframe')
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

function expandOptions(element) {
  if (element) {
    element.style.right = '0';
    element.style.top = '20px';
    element.style.width = 'calc(92vw - 20px)';
  }
}

function revertOptions(element) {
  if (element) {
    element.style.right = '';
    element.style.top = '';
    element.style.width = '';
  }
}

function collapse(element) {
  if (element) {
    element.style.display = 'none';
  }
}

function show(element) {
  if (element) {
    element.style.display = 'flex';
  }
}

function hideNav(element) {
  if (element) {
    collapse(element);
    element.style.flexDirection = 'column';
    element.style.top = '0';
    element.style.width = '75vw';
    element.parentElement.style.zIndex = '500';

    if (element.dataset.toggler) {
      const toggler = document.querySelector(element.dataset.toggler);
      show(toggler);

      let children = [].slice.call(element.children).filter(el => !!(el));
      children.push(document.getElementById('root'));
      const close = () => collapse(element);
      children.forEach(child => child.addEventListener('mouseup', close, false));

      if (!toggler.onclick) {
        const toggle = () => {
          if (element.style.display === 'none') show(element);
          else collapse(element);
        }
        toggler.addEventListener('click', toggle, false);
      }
    }
  }
}

function revertNav(element) {
  if (element) {
    element.style.flexDirection = '';
    element.style.top = '';
    element.style.width = '';
    element.style.zIndex = '';
    element.parentElement.style.zIndex = '';
    show(element);

    const children = [].slice.call(element.children).filter(el => !!(el));
    const open = () => show(element);
    children.forEach(child => child.onclick = open);

    if (element.dataset.toggler) {
      collapse(document.querySelector(element.dataset.toggler));
    }
  }
}


const UiFun = () => {

  //register the logo hide breakpoint
  registerBreakpoint('#section1LogoContainer', { '1023': hideElement, '1024': showElement});
  registerBreakpoint('#pageOptions', {'800': expandOptions, '801': revertOptions});
  registerBreakpoint('.navUl', {'800':hideNav, '801':revertNav});
  registerBreakpoint('.mobileOnly', {'800':show, '801':collapse});

  //registerBreakpoint('#contactform', {'500': sizeIframe, '501': sizeIframe});
  //BREAKPOINT_PAIRS.forEach(pair => evaluateBreakpoint(pair));
  window.setInterval(() => BREAKPOINT_PAIRS.forEach(pair => evaluateBreakpoint(pair)), 50);
  const contactform = () => document.getElementById('contactform');
  setInterval(() => {
    if (contactform()) {
      contactform().onload = e => sizeIframe(e.target);
    }
  }, 50)
}

export default UiFun
