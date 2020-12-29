const default_base_url = 'http://localhost:8000/'

//returns JWT containing the post and all the info about it
async function getPost(postName=null, url=default_base_url+"post/name/") {
  if (postName) {
    url += `${postName}`;
  }
  url += "?format=json";
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
async function getImage(imageName, url=default_base_url+"post/image/name/") {
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
async function getSections(url=default_base_url+'post/sections/') {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept':'application/json'
      }
    });
    if (response.status !== 200) throw Error('4**, something went wrong when fetching sections');
    let output = await response.json();
    if (Array.isArray(output)) output = output.sort((elem1, elem2) => elem1.order_key > elem2.order_key);
    return output;
  } catch (error) {
    console.warn(error);
    return [];
  }
}

export { getPost, getImage, getSections }
