import type { FilterPropertiesRequestDTO } from "../../interfaces/DTO/infinit-scroll/filter-guest-properties-request";
import type { GuestPropertyCardsInfinitScrollDTO } from "../../interfaces/DTO/infinit-scroll/property-card-infinit-scroll-response";
import type { PropertyDTO } from "../../interfaces/DTO/property/perperty";

export default interface IPropertiesServices{
    FilterGuestProperties(requestData : FilterPropertiesRequestDTO) : Promise<GuestPropertyCardsInfinitScrollDTO | null>;
    GetPropertyDetails(id: string) : Promise<PropertyDTO | null>
}