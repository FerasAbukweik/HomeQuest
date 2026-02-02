import type { UserPropertyCardResposeDTO } from "../property/user-property-card";

 export interface UserDashBoardData
 {
    propertiesCardData : UserPropertyCardResposeDTO[],
    numberOfActiveListings : number,
    totalViews : number
    numOfActiveListingsLastMonth : number,
    totalViewsLastMonth : number

 }