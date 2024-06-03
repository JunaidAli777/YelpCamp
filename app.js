if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');


const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


const MongoDBStore = require("connect-mongo")(session);


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
    /* useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
    useFindAndMoodify: false*/
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connection")
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const store = new MongoDBStore({
    url: dbUrl,
    secret: 'thisisnotagoodsecret',
    touchAfter: 24 * 60 * 60
})

store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e)
})


const sessionConfig = { 
                        store,
                        name:'session',
                        secret: 'thisshouldbeabettersecret!',
                        resave: false,
                        saveUninitialized: true,
                        cookie: {
                            httpOnly: true,
                            //secure: true,
                            expires: Date.now() + 1000*60*60*24*7,
                            maxAge: 1000*60*60*24*7
                        }};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",  // Ensure to include this if using jsDelivr for CSS
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    "https://fonts.googleapis.com/", 
    "https://fonts.gstatic.com/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwxcorqhw/", // Your Cloudinary account
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    /*the following two statements is done in order to have access to flash messages(stored in a variable)
    in the views template, so that we do not have to pass it through to the view templates
    every time in the route handler functions. the control will retrieve IF any message is 
    stored under the keys like 'success', 'error', 'danger' etc in the res.local object*/
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) =>{
    const user = new User({email: 'newu@gmail.com', username: 'newu'});
    const newUser = await User.register(user, 'newu');
    res.send(newUser);
})

//const validateCampground = (req, res, next) => {
/*campgroundSchema: This refers to the Joi schema defined in the schemas.js file, which 
presumably defines the structure and validation rules for campground data. 
.validate(req.body): This is a method provided by Joi for validating data against a schema.
In this case, it's being used to validate the req.body object, which typically contains 
data submitted in an HTTP POST request. const { error } = ...: This line uses object 
destructuring to extract the error property from the result of the validation.
The error variable will contain any validation errors encountered during the validation
process. */   
//    const { error } = campgroundSchema.validate(req.body);
//    if (error) {
/*el: This is a commonly used abbreviation for "element". In the context of this code snippet,
el represents each individual element within the array error.details that is being iterated
over. Here's a more detailed explanation:
error.details: This likely refers to an array of detailed error objects within the error
object. Each element in this array represents a specific validation error that occurred
during the validation process. .map(el => el.message): This part of the code is using the
map method on the error.details array. The map method iterates over each element in the
array and applies the provided function to transform each element. In this case, the 
provided function is an arrow function that takes an element (el) as its parameter and 
returns el.message. So, for each element in the error.details array, el.message is extracted. 
Here, el represents an individual element within the array. */       
//        const msg = error.details.map(el => el.message).join(',')
//        throw new ExpressError(msg, 400)
//    } else{
//        next();
//    }
//}

//const validateReview = (req, res, next) => {
//    const { error } = reviewSchema.validate(req.body);
//    if (error) {
//        const msg = error.details.map(el => el.message).join(',')
//        throw new ExpressError(msg, 400)
//    } else{
//        next();
//    }
//}

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home')
});



// app.all means for all kinds of requests and '*' means for all paths
app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))
    /*this statement will send the new instance of error to the next 
    middleware function which is right below this function to handle errors */
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'oh no, Something went wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('serving on port 3000')
});