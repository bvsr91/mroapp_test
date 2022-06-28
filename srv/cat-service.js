const cds = require('@sap/cds')
module.exports = async function () {
    const db = await cds.connect.to('db')
    const {
        Roles,
        Users_Role_Assign,
        Vendor_List_1,
        User_Approve_Maintain,
        Pricing_Conditions_1
    } = db.entities("ferrero.mro");
    this.on("READ", "CheckUserRole", async (req, next) => {
        var result;
        var logOnUser = req.user.id;
        if (logOnUser && logOnUser !== "") {
            try {
                result = await SELECT.from(Users_Role_Assign).where({ user: req.user.id });
            } catch (err) {
                return err;
            }
            return result;
        } else {
            req.error(500, "logon user unavailable");
        }
    });
    this.before("INSERT", "PricingConditions", async (req, next) => {
        var logOnUser = req.user.id;
        try {
            var aCheckRecordExits = await SELECT.from(Pricing_Conditions_1).where('ManufacturerCode=', req.data.ManufacturerCode, 'and Country=', req.data.Country);
            if (aCheckRecordExits.length > 0) {
                req.error(500, "record already exists with same data");
            }

            if (logOnUser && logOnUser !== "") {
                result = await SELECT.from(User_Approve_Maintain).where({ userid: req.user.id });
                if (result.length > 0 && result[0].managerid !== "") {
                    req.data.approver = result[0].managerid;
                    req.data.initiator = req.user.id;
                    req.data.Status = "Pending";
                } else {
                    req.error(500, "Approver not maintained for the user: " + req.user.id);
                }
                return result;
            } else {
                req.error(500, "logon user unavailable");
            }
        }
        catch (err) {
            return err;
        }
        return req;
    });

    
    this.before("INSERT", "VendorList", async (req, next) => {
        var logOnUser = req.user.id;
        try {
            var aCheckRecordExits = await SELECT.from(Vendor_List_1).where('manufacturerCode=', req.data.manufacturerCode, 'and localManufacturerCode=', req.data.localManufacturerCode,
            'and country=', req.data.country);
            if (aCheckRecordExits.length > 0) {
                req.error(500, "record already exists with same data");
            }

            if (logOnUser && logOnUser !== "") {
                result = await SELECT.from(User_Approve_Maintain).where({ userid: req.user.id });
                if (result.length > 0 && result[0].managerid !== "") {
                    req.data.approver = result[0].managerid;
                    req.data.initiator = req.user.id;
                    req.data.Status = "Pending";
                } else {
                    req.error(500, "Approver not maintained for the user: " + req.user.id);
                }
                return result;
            } else {
                req.error(500, "logon user unavailable");
            }
        }
        catch (err) {
            return err;
        }
        return req;
    });

}