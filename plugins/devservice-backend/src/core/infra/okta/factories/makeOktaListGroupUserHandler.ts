import { OktaListGroupUsersHandler } from '../handlers/OktaListGroupUsersHandler'

export const makeOktaListGroupUserHandler= (): 
OktaListGroupUsersHandler => new OktaListGroupUsersHandler()