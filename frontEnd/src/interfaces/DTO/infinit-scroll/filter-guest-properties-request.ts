import type { InfinitScrollDTO } from "./infinit-scroll";
import type { FilterPropertiesData } from "../property/guest-filter-data";

export interface FilterPropertiesRequestDTO
{
    filterData : FilterPropertiesData,
    infinitScrollData : InfinitScrollDTO
}