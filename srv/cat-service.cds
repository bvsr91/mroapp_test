using ferrero.mro as my from '../db/data-model';

@requires : 'authenticated-user'
service MroService @(impl:'./cat-service.js'){
    // @readonly
    entity Roles             as projection on my.Roles;
    entity Users             as projection on my.Users_Role_Assign;

    entity MaintainApproval  as projection on my.User_Approve_Maintain;
    entity VendorList        as projection on my.Vendor_List_1;
    entity PricingConditions as projection on my.Pricing_Conditions_1;

    @readonly
    entity CheckUserRole as projection on my.Users_Role_Assign;
}
