const getpage = async () => {
  let res = await fetch('http://localhost:8000/post/2?format=json', {
    method: 'GET',
    mode: "cors",
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json'
    }

  })
  let x = await res.json()
  return x;
}

try {
  getpage()
  .then(console.log)
} catch (err) {
  console.log(err, err.stack);
}
