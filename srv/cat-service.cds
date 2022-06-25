using ferrero.mro as my from '../db/data-model';

@requires: 'authenticated-user'
service MroService {
    // @readonly
    entity Roles as projection on my.Roles;
    entity Users as projection on my.Users_Role_Assign;
}
