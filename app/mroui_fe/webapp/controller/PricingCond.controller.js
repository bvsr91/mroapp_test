sap.ui.define(
    [
      "./BaseController",
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
      "sap/ui/model/Sorter",
      "sap/ui/model/FilterOperator",
      "sap/m/GroupHeaderListItem",
      "sap/ui/Device",
      "sap/ui/core/Fragment",
      "sap/m/MessageBox",
      "../model/formatter",
    ],
    function (
      BaseController,
      JSONModel,
      Filter,
      Sorter,
      FilterOperator,
      GroupHeaderListItem,
      Device,
      Fragment,
      MessageBox,
      formatter
    ) {
      "use strict";
  
      return BaseController.extend("com.ferre.mrouife.controller.PricingCond", {
        formatter: formatter,
  
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
  
        /**
         * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
         * @public
         */
        onInit: function () {
          this.getRouter()
            .getRoute("pricingCond")
            .attachPatternMatched(this._onRouteMatched, this);
          // this.getRouter().attachBypassed(this.onBypassed, this);
        },
  
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
  
        /**
         * Event handler for navigating back.
         * We navigate back in the browser historz
         * @public
         */
        onNavBack: function () {
          // eslint-disable-next-line sap-no-history-manipulation
          history.go(-1);
        },
  
        /* =========================================================== */
        /* begin: internal methods                                     */
        /* =========================================================== */
  
        _onRouteMatched: function () {
          //Set the layout property of the FCL control to 'OneColumn'
          // this.getModel("appView").setProperty("/layout", "OneColumn");
          this.setSelKey("pricingCond");
        },
        
        
        onLinksDownload: function (oEvent) {
          var oInput = oEvent.getSource(),
            oBinding = oInput
              .getParent()
              .getBindingContext("pricingData")
              .getObject();
          //   bEnDevelopment = oBinding.MyDevelopment === "X",
          var oPopover = new sap.m.Popover({
            placement: "Bottom",
            showHeader: false,
            content: [
              new sap.m.HBox({
                items: [
                  new sap.ui.core.Icon({
                    src: "sap-icon://edit",
                    size: "1.0rem",
                    //   color: "#BC9D61",
                  }).addStyleClass("sapUiSmallMarginBeginEnd"),
                  new sap.m.Link({
                    text: "Modify",
                    press: this.onModify.bind(this, oInput),
                    enabled: true,
                    wrapping: true,
                  }),
                ],
              }).addStyleClass("sapUiSmallMarginTopBottom sapUiSmallMarginEnd"),
              new sap.m.HBox({
                items: [
                  new sap.ui.core.Icon({
                    src: "sap-icon://delete",
                    size: "1.0rem",
                    //   ,
                    color: "red",
                  }).addStyleClass("sapUiSmallMarginBeginEnd"),
                  new sap.m.Link({
                    text: "Delete",
                    enabled: true,
                    press: this.onDelete.bind(this, oInput),
                    wrapping: true,
                  }),
                ],
              }).addStyleClass("sapUiSmallMarginBottom linkColorReject"),
            ],
          });
  
          oPopover.openBy(oInput);
        },
        onModify: function (oInput, oEvent) {
          this.openDialog(oInput, true);
        },
        onDetailPress: function (oEvent) {
          var oInput = oEvent.getSource(),
            oBinding = oInput
              .getParent()
              .getBindingContext("pricingData")
              .getObject();
          this.openDialog(oInput, false);
        },
        openDialog: function (oInput, bEdit) {
          var oCtx = oInput.getBindingContext("pricingData");
          var sPath = oCtx.getPath();
          if (!this._oDialog) {
            this._oDialog = sap.ui.xmlfragment(
              this.createId("FrgPricingData"),
              "com.ferre.mrouife.view.fragments.PricingConditionForm",
              this
            );
            this.getView().addDependent(this._oDialog);
          }
          this.byId(
            sap.ui.core.Fragment.createId(
              "FrgPricingData",
              "SimpleFormToolbarPricingDisplay"
            )
          ).bindElement({
            path: sPath,
            model: "pricingData",
          });
          var oModel = this.getOwnerComponent().getModel("pricingData");
          oModel.setProperty("/bText", !bEdit);
          oModel.setProperty("/bInput", bEdit);
          oModel.setProperty("/bEdit", bEdit);
          oModel.refresh(true);
          // this._oDialog.setEscapeHandler(function (o) {
          //   o.reject();
          // });
          this._oDialog.open();
        },
        onClosePricingData: function () {
          if (this._oDialog) {
            this._oDialog.close();
            this._oDialog.destroy();
            this._oDialog = undefined;
          }
        },
        onSavePricingData: function () {
          var oModel = this.getOwnerComponent().getModel("pricingData");
          oModel.setProperty("/bText", true);
          oModel.setProperty("/bInput", false);
          oModel.refresh(true);
          this.onClosePricingData();
        },
        onDelete: function (oInput, oEvent) {
          this._oDelObj = oInput
            .getParent()
            .getBindingContext("pricingData")
            .getObject();
          MessageBox.confirm(
            "Do you want to delete " + this._oDelObj.manufacturerCode + "?",
            {
              actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
              initialFocus: MessageBox.Action.CANCEL,
              onClose: function (sAction) {
                if (sAction === "YES") {
                  var oModel = this.getOwnerComponent().getModel("pricingData");
                  var aData = oModel.getProperty("/pricingConditionData");
                  aData = aData.filter(
                    (a) => a.manufacturerCode !== this._oDelObj.manufacturerCode
                  );
                  oModel.setProperty("/pricingConditionData", aData);
                  oModel.refresh(true);
                  sap.m.MessageToast.show(
                    this._oDelObj.manufacturerCode + " Deleted successfully "
                  );
                }
              }.bind(this),
            }
          );
        },
        handleAddPricingDetails: function () {
          if (!this._DialogAddPricing) {
            this._DialogAddPricing = sap.ui.xmlfragment(
              this.createId("FrgAddPricingData"),
              "com.ferre.mrouife.view.fragments.AddPricingForm",
              this
            );
            this.getView().addDependent(this._DialogAddPricing);
          }
          this._DialogAddPricing.open();
        },
        onClosePricing: function () {
          if (this._DialogAddPricing) {
            this._DialogAddPricing.close();
            this._DialogAddPricing.destroy(true);
            this._DialogAddPricing = undefined;
          }
        },
        onaddPricingData: function () {
          this.getView().byId("idPLTData").getBinding("items").filter("");
          var manufacturerCodeId = this.byId(
            sap.ui.core.Fragment.createId(
              "FrgAddPricingData",
              "manufacturerCodeId"
            )
          ).getValue();
          var manufacturerDescId = this.byId(
            sap.ui.core.Fragment.createId(
              "FrgAddPricingData",
              "manufacturerDescId"
            )
          ).getValue();
          var countryId = this.byId(
            sap.ui.core.Fragment.createId("FrgAddPricingData", "countryId")
          ).getValue();
          var countryCodeId = this.byId(
            sap.ui.core.Fragment.createId("FrgAddPricingData", "countryCodeId")
          ).getValue();
          var plantId = this.byId(
            sap.ui.core.Fragment.createId("FrgAddPricingData", "plantId")
          ).getValue();
          var plantDescriptionId = this.byId(
            sap.ui.core.Fragment.createId(
              "FrgAddPricingData",
              "plantDescriptionId"
            )
          ).getValue();
          var exchangeRateId = this.byId(
            sap.ui.core.Fragment.createId("FrgAddPricingData", "exchangeRateId")
          ).getValue();
          var countryFactorId = this.byId(
            sap.ui.core.Fragment.createId("FrgAddPricingData", "countryFactorId")
          ).getValue();
          var validityStartId = this.byId(
            sap.ui.core.Fragment.createId("FrgAddPricingData", "validityStartId")
          ).getValue();
          var validityEndId = this.byId(
            sap.ui.core.Fragment.createId("FrgAddPricingData", "validityEndId")
          ).getValue();
          var localOwnershipId = this.byId(
            sap.ui.core.Fragment.createId("FrgAddPricingData", "localOwnershipId")
          ).getSelected();
          var creationDateId = this.getFormattedDate();
          var latestDateId = this.getFormattedDate();
          var statusId = "Active";
          if (
            manufacturerCodeId != "" &&
            manufacturerDescId != "" &&
            countryId != "" &&
            countryCodeId != "" &&
            plantId != ""
          ) {
            var itemRow = {
              manufacturerCode: manufacturerCodeId,
              manufacturerDesc: manufacturerDescId,
              country: countryId,
              countryCode: countryCodeId,
              plant: plantId,
              plantDescription: plantDescriptionId,
              exchangeRate: exchangeRateId,
              countryFactor: countryFactorId,
              validityStart: validityStartId,
              validityEnd: validityEndId,
              localOwnership: localOwnershipId,
              creationDate: creationDateId,
              latestDate: latestDateId,
              status: statusId,
            };
            var oModel = this.getOwnerComponent().getModel("pricingData");
  
            var itemData = oModel.getProperty("/pricingConditionData");
  
            if (
              typeof itemData !== "undefined" &&
              itemData !== null &&
              itemData.length > 0
            ) {
              itemData.unshift(itemRow);
            } else {
              itemData = [];
              itemData.unshift(itemRow);
            }
  
            oModel.setProperty("/pricingConditionData", itemData);
            oModel.refresh(true);
            this.byId(
              sap.ui.core.Fragment.createId(
                "FrgAddPricingData",
                "manufacturerCodeId"
              )
            ).setValue("");
            this.byId(
              sap.ui.core.Fragment.createId(
                "FrgAddPricingData",
                "manufacturerDescId"
              )
            ).setValue("");
            this.byId(
              sap.ui.core.Fragment.createId("FrgAddPricingData", "countryId")
            ).setValue("");
            this.byId(
              sap.ui.core.Fragment.createId("FrgAddPricingData", "countryCodeId")
            ).setValue("");
            this.byId(
              sap.ui.core.Fragment.createId("FrgAddPricingData", "plantId")
            ).setValue("");
            this.byId(
              sap.ui.core.Fragment.createId(
                "FrgAddPricingData",
                "plantDescriptionId"
              )
            ).setValue("");
            this.byId(
              sap.ui.core.Fragment.createId("FrgAddPricingData", "exchangeRateId")
            ).setValue("");
            this.byId(
              sap.ui.core.Fragment.createId(
                "FrgAddPricingData",
                "countryFactorId"
              )
            ).setValue("");
            this.byId(
              sap.ui.core.Fragment.createId(
                "FrgAddPricingData",
                "validityStartId"
              )
            ).setValue("");
            this.byId(
              sap.ui.core.Fragment.createId("FrgAddPricingData", "validityEndId")
            ).setValue("");
            this.byId(
              sap.ui.core.Fragment.createId(
                "FrgAddPricingData",
                "localOwnershipId"
              )
            ).setSelected(false);
            this.onClosePricing();
          } else {
            alert("fields cannot be blank");
          }
        },
        onSearch: function (oEvent) {
          var aFilters = [];
  
          var sQuery = oEvent.getSource().getValue();
  
          if (sQuery && sQuery.length > 0) {
            var filter = new Filter(
              "manufacturerCode",
              FilterOperator.Contains,
              sQuery
            );
  
            aFilters.push(filter);
          }
  
          var oList = this.byId("idPLTData");
  
          var oBinding = oList.getBinding("items");
  
          oBinding.filter(aFilters, "Application");
        },
      });
    }
  );
  