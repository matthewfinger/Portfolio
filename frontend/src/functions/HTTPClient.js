async function getPost(postName=null, url="http://localhost:8000/post/name/") {
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

export default getPost
