const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const Sequelize = require('sequelize');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PW, {
  host: 'localhost',
  dialect: 'sqlite',
  storage: "./session.sqlite",
  port: 3306
});

//const sess = {
  //secret: 'Super secret secret',
  //cookie: {},
  //resave: false,
  //saveUninitialized: true,
  //store: new SequelizeStore({
    //db: sequelize
  //})
//};

app.use(session({
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
})
);

const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers/'));

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});