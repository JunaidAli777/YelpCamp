const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    /* useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true */
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

// the following function is to pick a random element from an array 
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<300; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '66436f049141917b73518885',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dwxcorqhw/image/upload/v1716218451/YelpCamp/ju8mejx0lvcnghqddg1d.jpg',
                  filename: 'YelpCamp/ju8mejx0lvcnghqddg1d'
                },
                {
                  url: 'https://res.cloudinary.com/dwxcorqhw/image/upload/v1716218452/YelpCamp/hwmxqrorrfrzwaitq0mu.jpg',
                  filename: 'YelpCamp/hwmxqrorrfrzwaitq0mu',
                }
              ],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit, atque! Magni quaerat ea dicta excepturi laudantium ut sint, aperiam, atque maxime quod ad quisquam, enim rem sequi minus laborum officia.',
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        })
        await camp.save();
    }
} 

seedDB().then(() => {
    mongoose.connection.close();
});