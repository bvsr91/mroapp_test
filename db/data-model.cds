namespace ferrero.mro;

using {
    managed,
    cuid,
    Currency,
    sap.common
} from '@sap/cds/common';

entity Roles {
    key role        : String;
        description : String;
}

entity Users_Role_Assign {
    key user : String;
        role : Association to Roles
}

entity User_Approve_Maintain {
    key userid    : String;
    key managerid : String;
}

entity Vendor_List : managed, cuid {
    key manufacturerCode          : String @description:'Manufacturer Code' @sap.label: 'Manufacturer Code';
    key localManufacturerCode     : String @description:'Local Manufacturer' @sap.label: 'Local Manufacturer';
    key country                   : String @description:'Country' @sap.label: 'Country';
        manufacturerCodeDesc      : String @description:'Manufacturer Desc' @sap.label: 'Manufacturer Desc';
        localManufacturerCodeDesc : String @description:'Local Manufacturer Desc' @sap.label: 'Local Manufacturer Desc';
        countryDesc               : String @description:'Country Desc' @sap.label: 'Country Desc';
        initiator                 : String @description:'Initiator' @sap.label: 'Initiator';
        approver                  : String @description:'Approver' @sap.label: 'Approver';
        Status                    : String @description:'Status' @sap.label: 'Status';
}

entity Pricing_Conditions : managed,cuid {
    key ManufacturerCode     : String @description:'Manufacturer Code' @sap.label: 'Manufacturer Code';
    key Country              : String @description:'Country' @sap.label: 'Country';
        manufacturerCodeDesc : String @description:'Manufacturer Desc' @sap.label: 'Manufacturer Desc';
        countryDesc          : String @description:'Country Desc' @sap.label: 'Country Desc';
        LocalCurrency        : String @description:'Local Currency' @sap.label: 'Local Currency';
        ExchangeRate         : Decimal(2, 2) @description:'Exchange Rate' @sap.label: 'Exchange Rate';
        CountryFactor        : Decimal(2, 2) @description:'Country Factor' @sap.label: 'Country Factor';
        ValidityStart        : Date @description:'Validity Start Date' @sap.label: 'Validity Start Date';
        ValidityEnd          : Date @description:'Validity End Date' @sap.label: 'Validity End Date';
        initiator            : String @description:'Initiator' @sap.label: 'Initiator';
        approver             : String @description:'Approver' @sap.label: 'Approver';
        ld_initiator         : String @description:'Local Delivery Initiator' @sap.label: 'Local Delivery Initiator';
        Status               : String @description:'Status' @sap.label: 'Status';
}
