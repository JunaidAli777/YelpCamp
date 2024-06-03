module.exports = func => {
    /*here what we do is return a function that calls func(req,res,next) and returns the logic provided in the 
    app.js file or if there is an error it catches the error and directs the executor to the next middleware 
    function in the order to deal with the error in a customed manner so as not to crash the app*/
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}