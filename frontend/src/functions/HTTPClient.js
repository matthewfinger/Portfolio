const default_base_url = 'https://backend.mattfinger.info';

//returns JWT containing the post and all the info about it
async function getPost(postName=null, id=null, url=default_base_url+"/post/") {
  if (postName) {
    url += `name/${postName}`;
  } else if (id) {
    url += id;
  }
  url += "?format=json&enabledonly=1";
  try {
    const response = await fetch(url, {
      method: "GET",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (response.status === 404) throw Error('404 Not Found!');
    const output = await response.json();
    return output;
  } catch (error) {
    console.warn(`Post with the name ${postName} could not be found!`, error);
    return { content:"" };
  }
}

//gets a JWT containint the slug of the resource with the given name on the server
async function getImage(imageName, byName=true, url=default_base_url+"/post/image/") {
  if (byName) url += 'name/';
  if (imageName) url += `${imageName}`;
  url += '?format=json';
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (response.status === 404) throw Error('404 not found!');
    const output = await response.json();
    return output;
  } catch (err) {
    console.warn(`Image with the name ${imageName} is not an existing resource on the server`, err);
    return {};
  }
}

//gets a JWT Array containing all sections to be rendered as content
async function getSections(url=default_base_url+'/post/sections/?enabledonly=1') {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept':'application/json'
      }
    });
    if (response.status !== 200) throw Error('4**, something went wrong when fetching sections');
    let output = await response.json();
    if (Array.isArray(output)) output.sort((elem1, elem2) => (elem1.order_key > elem2.order_key ? 1 : -1));
    return output;
  } catch (error) {
    console.warn(error);
    return [];
  }
}

async function getSkills(url=default_base_url+'/post/skills/') {
  let out = [];
  url += '?format=json';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.status !== 200)
      throw Error(`Error 4**! Something went wrong while fetching skills from '${url}'`);

    let skillsList = await response.json();
    if (Array.isArray(skillsList))
      skillsList = skillsList.sort((elem1, elem2) => elem1.order_key > elem2.order_key);
    else throw Error(`Error! Unexpected response format from '${url}'! Expected a application/json formatted Array with each element having a 'order_key' property!`);

    out = [ ...skillsList ];

  } catch (error) {
    console.warn(error);
  }

  return out;
}

async function fetchList(url) {
  let out = [];
  url += '?format=json';
  try {
    const response = await fetch(url, {
      'Accept': 'application/json'
    });

    const jsonRes = await response.json();

    if (!Array.isArray(jsonRes))
      throw Error(`Error when fetching Array from '${url}'! Expected a JSON encoded array`);
    else out = out.concat(jsonRes);

    if (out[0] && Object.keys(out[0]).includes('order_key'))
      out = out.sort((elem1, elem2) => elem1.order_key > elem2.order_key);

  } catch (error) {
    console.warn(error);
  }
  return out;
}

//function that sends the usage
async function sendVisit() {
  try {
    let url = default_base_url + '/post/new_visit/';
    let res = await fetch(url, {
      'Method': 'GET',
    });

    const out = await res.json();
    return out;
  }
  catch( error ) {
    console.warn(error);
  }

  return {};
}

export {
  getPost,
  getImage,
  getSections,
  getSkills,
  fetchList,
  sendVisit,
  default_base_url
}
