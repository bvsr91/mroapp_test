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
                var oModel = this.getOwnerComponent().getModel("mrosrv_v2")
                this.getView().setModel(oModel);
                this.getView().byId("priceSmartTab").rebindTable();
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
            onModify: function (oInput, oEvent) {
                this.openDialog(oInput, true);
            },
            onDetailPress: function (oEvent) {
                var oInput = oEvent.getSource(),
                    oBinding = oInput.getParent().getBindingContext("pricingData").getObject();
                this.openDialog(oInput, false);
            },
            openDialog: function (oInput, bEdit) {
                var oCtx = oInput.getBindingContext("pricingData");
                var sPath = oCtx.getPath();
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment(this.createId("FrgPricingData"), "com.ferre.mrouife.view.fragments.PricingConditionForm", this);
                    this.getView().addDependent(this._oDialog);
                }
                this.byId(sap.ui.core.Fragment.createId("FrgPricingData", "SimpleFormToolbarPricingDisplay"))
                    .bindElement({
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
            handleAddPricingDetails: function () {
                if (!this._DialogAddPricing) {
                    this._DialogAddPricing = sap.ui.xmlfragment(this.createId("FrgAddPricingData"), "com.ferre.mrouife.view.fragments.AddPricingForm", this);
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
            onaddPricingData1: function () {
                this.getView().byId("idPLTData").getBinding("items").filter("");
                var manufacturerCodeId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "manufacturerCodeId")).getValue();
                var manufacturerDescId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "manufacturerDescId")).getValue();
                var countryId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "countryId")).getValue();
                var countryCodeId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "countryCodeId")).getValue();
                var plantId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "plantId")).getValue();
                var plantDescriptionId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "plantDescriptionId")).getValue();
                var exchangeRateId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "exchangeRateId")).getValue();
                var countryFactorId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "countryFactorId")).getValue();
                var validityStartId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "validityStartId")).getValue();
                var validityEndId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "validityEndId")).getValue();
                var localOwnershipId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "localOwnershipId")).getSelected();
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
                    if (typeof itemData !== "undefined" && itemData !== null && itemData.length > 0) {
                        itemData.unshift(itemRow);
                    } else {
                        itemData = [];
                        itemData.unshift(itemRow);
                    }

                    oModel.setProperty("/pricingConditionData", itemData);
                    oModel.refresh(true);
                    this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "manufacturerCodeId")).setValue("");
                    this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "manufacturerDescId")).setValue("");
                    this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "countryId")).setValue("");
                    this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "countryCodeId")).setValue("");
                    this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "plantId")).setValue("");
                    this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "plantDescriptionId")).setValue("");
                    this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "exchangeRateId")).setValue("");
                    this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "countryFactorId")).setValue("");
                    this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "validityStartId")).setValue("");
                    this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "validityEndId")).setValue("");
                    this.byId(sap.ui.core.Fragment.createId("FrgAddPricingData", "localOwnershipId")).setSelected(false);
                    this.onClosePricing();
                } else {
                    alert("fields cannot be blank");
                }
            },
            onSearch: function (oEvent) {
                var aFilters = [];

                var sQuery = oEvent.getSource().getValue();

                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("manufacturerCode", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }
                var oList = this.byId("idPLTData");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },
            onPressActions: function (oEvent) {
                var oInput = oEvent.getSource(),
                    oBinding = oInput.getParent().getBindingContext().getObject();
                //   bEnDevelopment = oBinding.MyDevelopment === "X",
                var oPopover = new sap.m.Popover({
                    placement: "Bottom",
                    showHeader: false,
                    content: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.Button({
                                    text: 'Edit', icon: 'sap-icon://edit', type: 'Transparent', width: '6rem',
                                    press: this.onModify.bind(this, oInput)
                                }),
                                new sap.m.Button({
                                    text: 'Delete', icon: 'sap-icon://delete', type: 'Transparent', width: '6rem',
                                    press: this.onPressDelete.bind(this, oInput)
                                })
                            ]
                        }).addStyleClass("sapUiTinyMargin"),
                    ],
                }).addStyleClass("sapUiResponsivePadding");
                oPopover.openBy(oInput);
            },
            onPressDelete: function (oInput, oEvent) {
                this._oDelObjContext = oInput.getParent().getBindingContext();
                MessageBox.confirm("Do you want to delete the record?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                    initialFocus: MessageBox.Action.CANCEL,
                    onClose: function (sAction) {
                        if (sAction === "YES") {
                            this.onDelete(this._oDelObjContext);
                        }
                    }.bind(this),
                }
                );
            },
            onDelete: function (oObjectContext) {
                var oModel = this.getOwnerComponent().getModel("mrosrv_v2");
                this.getView().setBusy(true);
                oModel.remove(oObjectContext.sPath, {
                    success: function (oData) {
                        this.getView().setBusy(false);
                        MessageBox.success("Record Deleted successfully");
                    }.bind(this),
                    error: function (error) {
                        this.getView().setBusy(false);
                        var errorObj1 = JSON.parse(error.responseText).error.message;
                        MessageBox.show(
                            errorObj1.value,
                            sap.m.MessageBox.Icon.ERROR,
                            "Error In Create Operation"
                        );
                    }.bind(this)
                });
            },
            handleAddPricing: function () {
                if (!this._DialogAddPricing) {
                    this._DialogAddPricing = sap.ui.xmlfragment(this.createId("FrgAddPricing"), "com.ferre.mrouife.view.fragments.AddPricingForm", this);
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
                var manufacturerCode = this.byId(sap.ui.core.Fragment.createId("FrgAddPricing", "idIpManf")).getValue();
                var manufacturerCodeDesc = this.byId(sap.ui.core.Fragment.createId("FrgAddPricing", "idIpManfDesc")).getValue();
                var country = this.byId(sap.ui.core.Fragment.createId("FrgAddPricing", "idIpCountry")).getValue();
                var countryDesc = this.byId(sap.ui.core.Fragment.createId("FrgAddPricing", "idIpCountryDesc")).getValue();
                var countryFact = this.byId(sap.ui.core.Fragment.createId("FrgAddPricing", "idIpContFact")).getValue();
                var validityStartId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricing", "validityStartId")).getValue();
                var validityEndId = this.byId(sap.ui.core.Fragment.createId("FrgAddPricing", "validityEndId")).getValue();
                var exchageRate = this.byId(sap.ui.core.Fragment.createId("FrgAddPricing", "idIpExchRate")).getValue();

                var oPayLoad = {};
                oPayLoad.ManufacturerCode = manufacturerCode;
                // oPayLoad.localManufacturerCode = localDealerManufacturerCode;
                oPayLoad.Country = country;
                oPayLoad.countryDesc = countryDesc;
                oPayLoad.manufacturerCodeDesc = manufacturerCodeDesc;
                oPayLoad.CountryFactor = isNaN(parseInt(countryFact)) && countryFact === "" ? 0.0 : parseFloat(countryFact);
                oPayLoad.ExchangeRate = isNaN(parseInt(exchageRate)) && exchageRate === "" ? 0.0 : parseFloat(exchageRate);
                oPayLoad.ValidityStart = validityStartId === "" ? null : new Date(validityStartId).toISOString();
                oPayLoad.ValidityEnd = validityEndId === "" ? null : new Date(validityEndId).toISOString();

                var oModel = this.getOwnerComponent().getModel("mrosrv_v2");
                this.getView().setBusy(true);
                oModel.create("/PricingConditions", oPayLoad, {
                    success: function (oData) {
                        console.log(oData);
                        this.onClosePricing();
                        this.getView().setBusy(false);
                        MessageBox.success("Record created successfully");
                    }.bind(this),
                    error: function (error) {
                        console.log(error);
                        var errorObj1 = JSON.parse(error.responseText).error.message;
                        MessageBox.show(
                            errorObj1.value,
                            sap.m.MessageBox.Icon.ERROR,
                            "Error In Create Operation"
                        );
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            }
        });
    }
);
