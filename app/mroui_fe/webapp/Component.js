sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "./model/models"
], function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("com.ferre.mrouife.Component", {

        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * In this function, the device models are set and the router is initialized.
         * @public
         * @override
         */
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // create the views based on the url/hash
            this.getRouter().initialize();
            this.validateUser();
        },

        /**
         * The component is destroyed by UI5 automatically.
         * In this method, the ErrorHandler is destroyed.
         * @public
         * @override
         */
        destroy: function () {
            // this._oErrorHandler.destroy();
            // call the base component's destroy function
            UIComponent.prototype.destroy.apply(this, arguments);
        },

        /**
         * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
         * design mode class should be set, which influences the size appearance of some controls.
         * @public
         * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
         */
        getContentDensityClass: function () {
            if (this._sContentDensityClass === undefined) {
                // check whether FLP has already set the content density class; do nothing in this case
                // eslint-disable-next-line sap-no-proprietary-browser-api
                if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        },
        validateUser: function () {
            var oModel = this.getModel("mrosrv_v2");
            oModel.read("/CheckUserRole", {
                success: function (oData) {
                    console.log("odata: ", oData);
                    if (oData.results.length === 0) {
                        this.showNotFound();
                    } else {
                        if (this.getRouter().getHashChanger().getHash() === "notFound") {
                            this.getRouter().navTo("search");
                        }
                        this.getModel("userModel").setProperty("/role", oData.results[0]);
                    }
                }.bind(this),
                error: function (error) {
                    this.showNotFound();
                }.bind(this)
            });
        },
        showNotFound: function () {
            this.getModel("side").setProperty("/navigation", []);
            this.getRouter().navTo("notFound");
            // var sPath = "com.ferre.mrouife.view.fragments.notFound";
            // if (!this.NotFoundDialog) {
            // 	this.NotFoundDialog = sap.ui.xmlfragment(sPath, this);
            // 	//this.getView().addDependent(this.NotFoundDialog);
            // }
            // this.NotFoundDialog.open();
            // this.NotFoundDialog.attachBrowserEvent("keydown", function (e) {
            // 	if ((e.which === 27) || (e.which === 32)) {
            // 		return false;
            // 	}
            // });
            // var title = this.getModel("i18n").getResourceBundle().getText("notFound");
            // sap.ui.getCore().byId("titleText").setText(title);
            // var message = this.getModel("i18n").getResourceBundle().getText("notFound.text");
            // sap.ui.getCore().byId("nameText").setText(message);
        }

    });

});