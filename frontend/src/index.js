const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('home');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server up!!'));
