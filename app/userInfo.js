const approuter = require("@sap/approuter");
const jwtDecode = require("jwt-decode");
let ar = approuter();

ar.beforeRequestHandler.use((req, res, next) => {
    console.log("Method : ---", req.method);
    console.log("URL: ", req.url);
    next();
});

ar.beforeRequestHandler.use("/getUserInfo", (req, res) => {
    res.statusCode = 200;
    let decodeJwtTooken = jwtDecode(req.user.token.accessToken);

    res.end(JSON.stringify({
        decodeJwtTooken
    }));
});

ar.start();