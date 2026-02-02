import type { FilterPropertiesRequestDTO } from "../../interfaces/DTO/infinit-scroll/filter-guest-properties-request";
import type { GuestPropertyCardsInfinitScrollDTO } from "../../interfaces/DTO/infinit-scroll/property-card-infinit-scroll-response";
import type { PropertyDTO } from "../../interfaces/DTO/property/perperty";
import Api from "../api/api";
import type IPropertiesServices from "./properties-services-interface";

export default class PropertiesServices implements IPropertiesServices{
    async FilterGuestProperties(requestData: FilterPropertiesRequestDTO){
        try
        {
            const response = await Api.post(
                "PropertysListings/FilterGuestProperties",
                requestData
            );
        
            return response.data as GuestPropertyCardsInfinitScrollDTO;
        }
        catch (error)
        {
            console.log(error);
            return null;
        }
    };
    async GetPropertyDetails(id: string): Promise<PropertyDTO | null> {
        try
        {
            const response = await Api.get(`PropertysListings/GetPropertyDetails/${id}`);
            return response.data as PropertyDTO;
        }
        catch(error)
        {
            console.log(error);
            return null;
        }
    }
    
}