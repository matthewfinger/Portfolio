let BREAKPOINT_PAIRS = {};


function registerBreakpoint(querySelector, breakpointTable) {
  let elements = () => [...document.querySelectorAll(`${querySelector}`)];
  let key = JSON.stringify([querySelector, Object.keys(breakpointTable)]);

  if (!breakpointTable.lastKey)
    breakpointTable.lastKey = null;

  BREAKPOINT_PAIRS[key] = [elements, breakpointTable];
}

//finds the current entry out of the ones specified
function getCurrentBreakpointKey(breakpointTable) {
  let width = window.innerWidth;
  let keys = Object.keys(breakpointTable).map(n => Number(n)).sort((a, b) => a < b).filter(e => !isNaN(e));
  let min = 0;
  for (let key of keys) {
    if ( isNaN(key) ) continue;
    if (width >= min && width <= key) return key;
    min = key;
  }
  return keys.pop();
}

// runs breakpoint function on each element
function evaluateBreakpoint(breakpointPair) {
  let breakpointTable = breakpointPair[1];
  let currentKey = getCurrentBreakpointKey(breakpointTable);
  if (breakpointTable.lastKey === currentKey) return;

  let callback = breakpointTable[currentKey];
  if ( !callback )
  {
    return;
  }

  let elements = breakpointPair[0]();
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
  document.body.setAttribute( 'data-in-mobile', '1' );
  let mainSection = document.getElementsByClassName('mainSection')[0]
  if (mainSection) mainSection.style.flexWrap = "wrap";
  document.querySelector("#section1LogoContainer").style.width = "100%";
  if (element) {
    collapse(element);
    element.style.flexDirection = 'column';
    element.style.top = '0';
    element.style.width = '75vw';
    element.parentElement.style.zIndex = '500';

    let visible = false;
    if (element.dataset.toggler) {
      const toggler = document.querySelector(element.dataset.toggler);
      show(toggler);

      let children = [].slice.call(element.children).filter(el => !!(el));
      children.push(document.getElementById('root'));
      const close = e => {
        visible = false;
        collapse(element);
      };
      children.forEach(child => {child.onclick = child.onclick || close});

      if (!toggler.onclick) {
        const toggle = e => {
          e.stopPropagation();
          if (!visible)
          {
            visible = true;
            show(element);
          }
          else {
            visible = false;
            collapse(element);
          }
        }
        toggler.onclick = toggle;
      }
    }
  }
}

function revertNav(element) {
  document.body.setAttribute( 'data-in-mobile', '0' );
  let mainSection = document.getElementsByClassName('mainSection')[0]
  if (mainSection) mainSection.style.flexWrap = "";
  document.querySelector("#section1LogoContainer").style.width = "";
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

let windowInterval;
const UiFun = () => {

  //register the logo hide breakpoint
  registerBreakpoint('#section1LogoContainer #section1Logo', { '1023': hideElement, '1024': showElement});
  registerBreakpoint('#section1LogoContainer > :not(.mobileOn)', { '1023': hideElement, '1024': showElement});
  registerBreakpoint('#pageOptions', {'800': expandOptions, '801': revertOptions});
  registerBreakpoint('.navUl', {'800':hideNav, '801':revertNav});
  registerBreakpoint('.mobileOnly', {'800':show, '801': collapse});
  registerBreakpoint('#section1LogoContainer > .mobileOn', {
    '800': (e => {
      showElement(e);
      e.style.fontSize = e.tagName.toLowerCase() === 'h4' ? "2.5em" : "1.4em";
    }),
    '1023': (e => {
      hideElement(e);
      e.style.fontSize = "";
    }),
    '1024': (e => {
      showElement(e);
      e.style.fontSize = '';
    })
  });

  window.BREAKPOINT_PAIRS = BREAKPOINT_PAIRS;

  //registerBreakpoint('#contactform', {'500': sizeIframe, '501': sizeIframe});
  //BREAKPOINT_PAIRS.forEach(pair => evaluateBreakpoint(pair));
  if (windowInterval) window.clearInterval(windowInterval);
  windowInterval = window.setInterval(() => Object.values(BREAKPOINT_PAIRS).forEach(pair => evaluateBreakpoint(pair)), 50);
  const contactform = () => document.getElementById('contactform');
  setInterval(() => {
    if (contactform()) {
      contactform().onload = e => sizeIframe(e.target);
    }
  }, 50)
}

export default UiFun
