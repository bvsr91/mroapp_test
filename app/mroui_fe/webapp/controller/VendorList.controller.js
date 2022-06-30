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
        "sap/ui/table/RowAction",
        "sap/ui/table/RowActionItem",
        "sap/ui/table/RowSettings",
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
        RowAction,
        RowActionItem,
        RowSettings,
        formatter
    ) {
        "use strict";

        return BaseController.extend("com.ferre.mrouife.controller.VendorList", {
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
                    .getRoute("vendorList")
                    .attachPatternMatched(this._onRouteMatched, this);
                // this.getRouter().attachBypassed(this.onBypassed, this);
                var oModel = this.getOwnerComponent().getModel("mrosrv_v2")
                this.getView().setModel(oModel);
                this.getView().byId("vendSmartTab").rebindTable();
                // this.createRecord();
                this.extendTable();
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
                this.setSelKey("vendorList");
            },

            onLinksDownload: function (oEvent) {
                var oInput = oEvent.getSource(),
                    oBinding = oInput
                        .getParent()
                        .getBindingContext("vendorData")
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
                        .getBindingContext("vendorData")
                        .getObject();
                this.openDialog(oInput, false);
            },
            openDialog: function (oInput, bEdit) {
                var oCtx = oInput.getBindingContext("vendorData");
                var sPath = oCtx.getPath();
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment(
                        this.createId("FrgVendorData"),
                        "com.ferre.mrouife.view.fragments.VendorForm",
                        this
                    );
                    this.getView().addDependent(this._oDialog);
                }
                this.byId(
                    sap.ui.core.Fragment.createId(
                        "FrgVendorData",
                        "SimpleFormToolbarDisplay"
                    )
                ).bindElement({
                    path: sPath,
                    model: "vendorData",
                });
                var oModel = this.getOwnerComponent().getModel("vendorData");
                oModel.setProperty("/bText", !bEdit);
                oModel.setProperty("/bInput", bEdit);
                oModel.setProperty("/bEdit", bEdit);
                oModel.refresh(true);
                // this._oDialog.setEscapeHandler(function (o) {
                //   o.reject();
                // });
                this._oDialog.open();
            },
            onCloseVendorData: function () {
                if (this._oDialog) {
                    this._oDialog.close();
                    this._oDialog.destroy();
                    this._oDialog = undefined;
                }
            },
            onSaveVendorData: function () {
                var oModel = this.getOwnerComponent().getModel("vendorData");
                oModel.setProperty("/bText", true);
                oModel.setProperty("/bInput", false);
                oModel.refresh(true);
                this.onCloseVendorData();
            },

            onDelete: function (oInput, oEvent) {
                this._oDelObj = oInput
                    .getParent()
                    .getBindingContext("vendorData")
                    .getObject();
                MessageBox.confirm(
                    "Do you want to delete " + this._oDelObj.manufacturerCode + "?",
                    {
                        actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                        initialFocus: MessageBox.Action.CANCEL,
                        onClose: function (sAction) {
                            if (sAction === "YES") {
                                var oModel = this.getOwnerComponent().getModel("vendorData");
                                var aData = oModel.getProperty("/vendorListData");
                                aData = aData.filter(
                                    (a) => a.manufacturerCode !== this._oDelObj.manufacturerCode
                                );
                                oModel.setProperty("/vendorListData", aData);
                                oModel.refresh(true);
                                sap.m.MessageToast.show(
                                    this._oDelObj.manufacturerCode + " Deleted successfully "
                                );
                            }
                        }.bind(this),
                    }
                );
            },
            handleAddVendorDetails: function () {
                if (!this._DialogAddVendor) {
                    this._DialogAddVendor = sap.ui.xmlfragment(
                        this.createId("FrgAddVendorData"),
                        "com.ferre.mrouife.view.fragments.AddVendorForm",
                        this
                    );
                    this.getView().addDependent(this._DialogAddVendor);
                }
                this._DialogAddVendor.open();
            },
            onCloseVendor: function () {
                if (this._DialogAddVendor) {
                    this._DialogAddVendor.close();
                    this._DialogAddVendor.destroy(true);
                    this._DialogAddVendor = undefined;
                }
            },
            onaddVendorData: function () {
                this.getView().byId("idVLTData").getBinding("items").filter("");
                var manufacturerCodeId = this.byId(
                    sap.ui.core.Fragment.createId(
                        "FrgAddVendorData",
                        "manufacturerCodeId"
                    )
                ).getValue();
                var manufacturerDescId = this.byId(
                    sap.ui.core.Fragment.createId(
                        "FrgAddVendorData",
                        "manufacturerDescId"
                    )
                ).getValue();
                var localDealerManufacturerCodeId = this.byId(
                    sap.ui.core.Fragment.createId(
                        "FrgAddVendorData",
                        "localDealerManufacturerCodeId"
                    )
                ).getValue();
                var localDealerMaufacturerDescId = this.byId(
                    sap.ui.core.Fragment.createId(
                        "FrgAddVendorData",
                        "localDealerMaufacturerDescId"
                    )
                ).getValue();
                var purchasingOrganizationId = this.byId(
                    sap.ui.core.Fragment.createId(
                        "FrgAddVendorData",
                        "purchasingOrganizationId"
                    )
                ).getValue();
                var purchasingOrganizationDescId = this.byId(
                    sap.ui.core.Fragment.createId(
                        "FrgAddVendorData",
                        "purchasingOrganizationDescId"
                    )
                ).getValue();
                var paymentTermsId = this.byId(
                    sap.ui.core.Fragment.createId("FrgAddVendorData", "paymentTermsId")
                ).getValue();
                var paymentTermDescId = this.byId(
                    sap.ui.core.Fragment.createId("FrgAddVendorData", "paymentTermDescId")
                ).getValue();
                var creationDateId = this.getFormattedDate();
                var latestDateId = this.getFormattedDate();
                var statusId = "Active";
                if (
                    manufacturerCodeId != "" &&
                    manufacturerDescId != "" &&
                    localDealerMaufacturerDescId != "" &&
                    purchasingOrganizationId != ""
                ) {
                    var itemRow = {
                        manufacturerCode: manufacturerCodeId,
                        manufacturerDesc: manufacturerDescId,
                        localDealerManufacturerCode: localDealerManufacturerCodeId,
                        localDealerMaufacturerDesc: localDealerMaufacturerDescId,
                        purchasingOrganization: purchasingOrganizationId,
                        purchasingOrganizationDesc: purchasingOrganizationDescId,
                        paymentTerms: paymentTermsId,
                        paymentTermDesc: paymentTermDescId,
                        creationDate: creationDateId,
                        latestDate: latestDateId,
                        status: statusId,
                    };
                    var oModel = this.getOwnerComponent().getModel("vendorData");

                    var itemData = oModel.getProperty("/vendorListData");

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

                    oModel.setProperty("/vendorListData", itemData);
                    oModel.refresh(true);
                    this.byId(
                        sap.ui.core.Fragment.createId(
                            "FrgAddVendorData",
                            "manufacturerCodeId"
                        )
                    ).setValue("");
                    this.byId(
                        sap.ui.core.Fragment.createId(
                            "FrgAddVendorData",
                            "manufacturerDescId"
                        )
                    ).setValue("");
                    this.byId(
                        sap.ui.core.Fragment.createId(
                            "FrgAddVendorData",
                            "localDealerManufacturerCodeId"
                        )
                    ).setValue("");
                    this.byId(
                        sap.ui.core.Fragment.createId(
                            "FrgAddVendorData",
                            "localDealerMaufacturerDescId"
                        )
                    ).setValue("");
                    this.byId(
                        sap.ui.core.Fragment.createId(
                            "FrgAddVendorData",
                            "purchasingOrganizationId"
                        )
                    ).setValue("");
                    this.byId(
                        sap.ui.core.Fragment.createId(
                            "FrgAddVendorData",
                            "purchasingOrganizationDescId"
                        )
                    ).setValue("");
                    this.byId(
                        sap.ui.core.Fragment.createId("FrgAddVendorData", "paymentTermsId")
                    ).setValue("");
                    this.byId(
                        sap.ui.core.Fragment.createId(
                            "FrgAddVendorData",
                            "paymentTermDescId"
                        )
                    ).setValue("");
                    this.onCloseVendor();
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

                var oList = this.byId("idVLTData");

                var oBinding = oList.getBinding("items");

                oBinding.filter(aFilters, "Application");
            },
            createRecord: function () {
                var oModel = this.getOwnerComponent().getModel("mrosrv_v2");
                var oPayLoad = {
                    manufacturerCode: "1000101",
                    localManufacturerCode: "L120944",
                    country: "IN",
                    countryDesc: "India"
                    // manufacturerCodeDesc: "Test1"
                    // localManufacturerCodeDesc: "LM123"
                    // ,
                    // "uuid": "8HEXDIG4HEXDIG4HEXDIG4HEXDIG12HEXDIG"
                };
                oModel.create("/VendorList", oPayLoad, {
                    success: function (oData) {
                        console.log(oData);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },
            handleAddVendor: function () {
                if (!this._DialogAddVendor) {
                    this._DialogAddVendor = sap.ui.xmlfragment(
                        this.createId("FrgAddVendorData"),
                        "com.ferre.mrouife.view.fragments.AddVendorForm",
                        this
                    );
                    this.getView().addDependent(this._DialogAddVendor);
                }
                this._DialogAddVendor.open();
            },
            onCloseVendor: function () {
                if (this._DialogAddVendor) {
                    this._DialogAddVendor.close();
                    this._DialogAddVendor.destroy(true);
                    this._DialogAddVendor = undefined;
                }
            },
            onSaveNewVendorData: function () {
                var manufacturerCode = this.byId(sap.ui.core.Fragment.createId("FrgAddVendorData", "idIpManf")).getValue();
                var manufacturerDesc = this.byId(sap.ui.core.Fragment.createId("FrgAddVendorData", "idIpManfDesc")).getValue();
                var localDealerManufacturerCode = this.byId(sap.ui.core.Fragment.createId("FrgAddVendorData", "idIpLocalManf")).getValue();
                var localDealerMaufacturerDesc = this.byId(sap.ui.core.Fragment.createId("FrgAddVendorData", "idIpLocalManfDesc")).getValue();
                var country = this.byId(sap.ui.core.Fragment.createId("FrgAddVendorData", "idIpCountry")).getValue();
                var countryDesc = this.byId(sap.ui.core.Fragment.createId("FrgAddVendorData", "idIpCountryDesc")).getValue();

                var oPayLoad = {};
                oPayLoad.manufacturerCode = manufacturerCode;
                oPayLoad.localManufacturerCode = localDealerManufacturerCode;
                oPayLoad.country = country;
                oPayLoad.countryDesc = countryDesc;
                oPayLoad.manufacturerCodeDesc = manufacturerDesc;
                oPayLoad.localManufacturerCodeDesc = localDealerMaufacturerDesc;

                var oModel = this.getOwnerComponent().getModel("mrosrv_v2");
                this.getView().setBusy(true);
                oModel.create("/VendorList", oPayLoad, {
                    success: function (oData) {
                        console.log(oData);
                        this.onCloseVendor();
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
            },
            extendTable: function () {
                var oTable = this.byId("idUiTab");
                var fnPress = this.handleActionPress.bind(this);
                var oTemplate = oTable.getRowActionTemplate();
                if (oTemplate) {
                    oTemplate.destroy();
                    oTemplate = null;
                }
                var iCount;
                this.modes = [
                    {
                        key: "Multi",
                        text: "Multiple Actions",
                        handler: function () {
                            var oTemplate = new RowAction({
                                items: [
                                    // new RowActionItem({ icon: "sap-icon://attachment", text: "Attachment", press: fnPress }),
                                    // new RowActionItem({ icon: "sap-icon://edit", text: "Edit", press: fnPress }),
                                    // new RowActionItem({ icon: "sap-icon://edit", text: "Edit", press: fnPress }),
                                    new RowActionItem({ text: "Delete", press: fnPress, type: sap.ui.table.RowActionType.Delete })
                                ]
                            });
                            return [2, oTemplate];
                        }
                    }
                ];
                for (var i = 0; i < this.modes.length; i++) {
                    if ("Multi" == this.modes[i].key) {
                        var aRes = this.modes[i].handler();
                        iCount = aRes[0];
                        oTemplate = aRes[1];
                        break;
                    }
                }
                oTable.setRowActionTemplate(oTemplate);
                oTable.setRowActionCount(iCount);
            },
            handleActionPress: function (oEvent) {
                var oRow = oEvent.getParameter("row");
                var oItem = oEvent.getParameter("item");
                if (oItem.getType() === "Delete") {
                    this.onDelete(oEvent);
                }
                // sap.m.MessageToast.show("Item " + (oItem.getText() || oItem.getType()) + " pressed for product with id " +
                //     oRow.getBindingContext().getObject().manufacturerCode);
            },
            onDelete: function (oEvent) {
                var oModel = this.getOwnerComponent().getModel("mrosrv_v2");
                this.getView().setBusy(true);
                oModel.remove(oEvent.getParameter("row").getBindingContext().sPath, {
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
            }
        });
    }
);
