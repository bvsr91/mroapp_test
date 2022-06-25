using ferrero.mro as my from '../db/data-model';

service MroService {
    // @readonly
    entity Roles as projection on my.Roles;
    entity Users as projection on my.Users_Role_Assign;
}
