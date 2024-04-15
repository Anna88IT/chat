export function checknotAuthentication (req, res, next) {
    if(req.isAuthenticated()){
        res.redirect("/");
    }
    next();
}

export function checkAuthentication (req, res, next) {
    if(!req.isAuthenticated()){
        console.log("user is authenticated --- middleware")
        res.redirect("/login");
    }
    next();
};