const Express = require('express');
const app = Express();
const port = 3000;

app.use(Express.static('build'));

app.listen(port, () => console.log(`listening on port ${port}`));
