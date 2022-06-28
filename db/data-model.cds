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

entity Vendor_List_1 : managed {
    key manufacturerCode          : String(10) @description : 'Manufacturer Code'  @sap.label       : 'Manufacturer Code';
    key localManufacturerCode     : String(10) @description : 'Local Manufacturer'  @sap.label      : 'Local Manufacturer';
    key country                   : String(3) @description : 'Country'  @sap.label                 : 'Country';
    key uuid                      : UUID;
        manufacturerCodeDesc      : String(35) @description : 'Manufacturer Desc'  @sap.label       : 'Manufacturer Desc';
        localManufacturerCodeDesc : String(35) @description : 'Local Manufacturer Desc'  @sap.label : 'Local Manufacturer Desc';
        countryDesc               : String(15) @description : 'Country Desc'  @sap.label            : 'Country Desc';
        initiator                 : String @description : 'Initiator'  @sap.label               : 'Initiator';
        approver                  : String @description : 'Approver'  @sap.label                : 'Approver';
        Status                    : String(10) @description : 'Status'  @sap.label                  : 'Status';
}

entity Pricing_Conditions_1 : managed {
    key ManufacturerCode     : String(10)        @description : 'Manufacturer Code'  @sap.label        : 'Manufacturer Code';
    key Country              : String(3)        @description : 'Country'  @sap.label                  : 'Country';
    key uuid                 : UUID;
        manufacturerCodeDesc : String(35)        @description : 'Manufacturer Desc'  @sap.label        : 'Manufacturer Desc';
        countryDesc          : String(15)        @description : 'Country Desc'  @sap.label             : 'Country Desc';
        LocalCurrency        : String(5)        @description : 'Local Currency'  @sap.label           : 'Local Currency';
        ExchangeRate         : Decimal(2, 2) @description : 'Exchange Rate'  @sap.label            : 'Exchange Rate';
        CountryFactor        : Decimal(2, 2) @description : 'Country Factor'  @sap.label           : 'Country Factor';
        ValidityStart        : Date          @description : 'Validity Start Date'  @sap.label      : 'Validity Start Date';
        ValidityEnd          : Date          @description : 'Validity End Date'  @sap.label        : 'Validity End Date';
        initiator            : String        @description : 'Initiator'  @sap.label                : 'Initiator';
        approver             : String        @description : 'Approver'  @sap.label                 : 'Approver';
        ld_initiator         : String        @description : 'Local Delivery Initiator'  @sap.label : 'Local Delivery Initiator';
        Status               : String(10)        @description : 'Status'  @sap.label                   : 'Status';
}
