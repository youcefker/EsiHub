// needed modules 
const express = require('express')
const app = express()
const expressEdge =require('express-edge').engine;
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session')
const expressValidator = require('express-validator')
const connectFlash = require('connect-flash')
const passport = require('passport')
const multer = require('multer')
const { body } = require('express-validator/check')
const User = require('./models/Users')
const Project = require('./models/Project')
const Notification = require('./models/Notification')







//db configs
//connect to the database
const db = require("./config/database");
db.authenticate()
 .then(() => {
   console.log('Connection has been established successfully.');
 })
 .catch(err => {
   console.error(err);
 });

//passport config
require('./config/passport')(passport)





//middlewares

// settingUp middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
// multer set up 
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/projectImages/');
  },
  filename: (req, file, cb) => {
    cb(null,file.originalname );
  }
}) 

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({storage:fileStorage, fileFilter: fileFilter}).single('image'))


app.use(expressValidator())
app.use(fileUpload());
app.use(expressEdge);
app.set("views", __dirname + "/views");
app.use(expressSession({
  secret: 'keyboard cat',
  cookie: {
    maxAge:269999999999
  },
  saveUninitialized: true,
  resave:true
}))
//passport stup
app.use(passport.initialize());

//flash setup
app.use(connectFlash())

//
app.use((req , res  , next )=>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error = req.flash('error')
  next()

})
Project.hasMany(Notification)
Notification.belongsTo(Project, { constraints: true, onDelete: 'CASCADE' })

User.hasMany(Project)
Project.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

//controllers
const homeRedirect = require('./controllers/homePage')
const registerController = require('./controllers/register')
const loginController = require('./controllers/login')
const profileController = require('./controllers/profile')

//projectControllers

const projectController = require('./controllers/project')
const isAuth =  require('./middlewares/isAuthenticated')

//searchController

const searchController = require('./controllers/search')

//notificationController

const notificationController = require('./controllers/notification')

//routes
app.get('/', homeRedirect)
app.post('/auth/register' , registerController.register)
app.post('/auth/completeRegister' , registerController.registerComplete)
app.post('/auth/login' ,loginController.loginController)
app.get('/me' ,profileController.myProfile)
app.post('/updateMe' ,profileController.updateProfile)



//projectRoutes

app.get('/add-project', projectController.getAddProject)

/*[body('title').isString()
.isLength({min: 3})
.trim(),
body('description').isString()
.isLength({min:5, max:400})
.trim()]
*/

app.post('/add-project',  projectController.postAddProject)

app.get('/projects', isAuth, projectController.getProjects)

app.get('/projects/:projectId', isAuth, projectController.getProject)

//search 
app.get('/search', searchController.getSearch)

app.post('/searchProject', searchController.postSearch)

//Notifications

app.get('/notifications', notificationController.getNotify)

app.get('/add-comment/:projectId', notificationController.getAddComment)

app.post('/add-comment', notificationController.postAddComment)

app.post('/add-like/:projectId', notificationController.addLike)

app.post('/add-rating/:info', notificationController.addRating)



//server

  const port = process.env.port || 3000
  app.listen(port , ()=> console.log('Server listening on port '+port))

