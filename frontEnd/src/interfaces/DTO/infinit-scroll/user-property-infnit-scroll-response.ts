import type { UserPropertyCardResposeDTO } from "../property/user-property-card";


export interface UserPropertyCardInfinitScrollDTO {
    propertiesListings: UserPropertyCardResposeDTO[];
    currTaken: number;
    isMoreAvaiable: boolean;
}