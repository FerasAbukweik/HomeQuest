import type { GuestPropertyCardResponseDTO } from "../property/guest-property-card";

export interface GuestPropertyCardsInfinitScrollDTO {
    propertiesListings: GuestPropertyCardResponseDTO[];
    currTaken: number;
    isMoreAvaiable: boolean;
}