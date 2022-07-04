const { Roles } = require("../Middelwear/auth");

const roleAccess = {
    all:[Roles.user,Roles.admin],
    user:[Roles.user],
    admin:[Roles.admin]
};

module.exports =roleAccess;