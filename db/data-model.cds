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
