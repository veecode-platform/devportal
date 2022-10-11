import { OktaUser } from "../models/OktaUser";
  
export function  differenceBetweenListOfUsers(externalGroup:OktaUser[], internalGroup: OktaUser[]): OktaUser[] {
    const isSameUser = (a:OktaUser, b:OktaUser) => a.profile.firstName === b.profile.firstName && a.profile.lastName === b.profile.lastName && a.profile.email === b.profile.email && a.id === b.id;

    const onlyInLeft = (left:OktaUser[], right:OktaUser[], compareFunction:Function) => 
      left.filter(leftValue =>
        !right.some(rightValue => 
          compareFunction(leftValue, rightValue)));
    
    const onlyInExternal = onlyInLeft(externalGroup, internalGroup, isSameUser);
    const onlyInInternal = onlyInLeft(internalGroup, externalGroup, isSameUser);
    
    const result = [...onlyInExternal, ...onlyInInternal];
    return onlyInExternal
}
  




// const oktaUsers:OktaUser[]=[
//     {id:"123456",profile:{firstName:"alejandro1",email:"ale1@gmail.com",lastName:"firstName1"}},
//     {id:"1234567",profile:{firstName:"alejandro2",email:"ale2@gmail.com",lastName:"firstName2"}},
//     {id:"1234568",profile:{firstName:"alejandro3",email:"ale3@gmail.com",lastName:"firstName3"}},
//     {id:"1234568",profile:{firstName:"alejandro4",email:"ale4@gmail.com",lastName:"firstName4"}},
// ]
// const devPortalUsers:OktaUser[]=[
//   {id:"123456",profile:{firstName:"alejandro1",email:"ale1@gmail.com",lastName:"firstName1"}},
//   {id:"1234567",profile:{firstName:"alejandro2",email:"ale2@gmail.com",lastName:"firstName2"}},
//   {id:"1234568",profile:{firstName:"alejandro3",email:"ale3@gmail.com",lastName:"firstName3"}},
// ]