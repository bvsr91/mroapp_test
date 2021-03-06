sap.ui.define(
    ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"],
    function (Controller, History) {
      "use strict";
  
      return Controller.extend("com.ferre.mrouife.controller.BaseController", {
        /**
         * Convenience method for accessing the router in every controller of the application.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
          return this.getOwnerComponent().getRouter();
        },
  
        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
          return this.getView().getModel(sName);
        },
  
        /**
         * Convenience method for setting the view model in every controller of the application.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
          return this.getView().setModel(oModel, sName);
        },
  
        /**
         * Convenience method for getting the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
  
        /**
         * Event handler for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the master route.
         * @public
         */
        onNavBack: function () {
          var sPreviousHash = History.getInstance().getPreviousHash();
  
          if (sPreviousHash !== undefined) {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
          } else {
            this.getRouter().navTo("master", {}, true);
          }
        },
        toolPageExpanded: function (bVal) {
          this.getOwnerComponent()
            .getModel("userModel")
            .setProperty("/isExpanded", bVal);
        },
        determineVisibilityBasedOnRole: function () {
          var oVisibleModel = this.getOwnerComponent().getModel("userModel");
          var oVisibleData = oVisibleModel.getData();
          var bCudVisible = false,
            sRoleName;
          if (oVisibleData.role === "GCM") {
            // Global catalog manager
            bCudVisible = false;
            sRoleName = "Global Catalog Manager";
          } else if (oVisibleData.role === "CDT") {
            //Central Delivery Team
            bCudVisible = true;
            sRoleName = "Central Delivery Team";
          } else if (oVisibleData.role === "LPT") {
            //Local Procurement Team
            bCudVisible = false;
            sRoleName = "Local Procurement Team";
          } else if (oVisibleData.role === "LDT") {
            // Local Delivery Team
            bCudVisible = true;
            sRoleName = "Local Delivery Team";
          }
          oVisibleModel.setProperty("/cudVisible", bCudVisible);
          oVisibleModel.setProperty("/roleName", sRoleName);
        },
        setSelKey: function (sKey) {
          //   sap.ui.getCore().byId("idSN").setSelectedKey(sKey);
          this.getOwnerComponent()
            .getModel("side")
            .setProperty("/selectedKey", sKey);
          // var aData = this.getOwnerComponent().getModel("side").getProperty("/navigation");
          // aData.forEach(element => {
          //     if(element.key === sKey){
  
          //     }
          // });
          this.getOwnerComponent().getModel("side").refresh(true);
          // this.getView().byId("idNL").setSelectedKey(sKey);
        },
        getFormattedDate: function () {
          var today = new Date();
          var dd = today.getDate();
  
          var mm = today.getMonth() + 1;
          var yyyy = today.getFullYear();
          if (dd < 10) {
            dd = "0" + dd;
          }
  
          if (mm < 10) {
            mm = "0" + mm;
          }
          return dd+'/'+mm+'/'+yyyy;
        },
      });
    }
  );
  