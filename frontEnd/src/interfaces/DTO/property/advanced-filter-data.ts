import type { FilterPropertiesData } from "./guest-filter-data"


export interface advancedFilterOptions {
    handleApplyFilter : (newFilterData:  FilterPropertiesData) => void,
    close : () =>void,
    isUser : boolean,
    oldfilterData :  FilterPropertiesData
}