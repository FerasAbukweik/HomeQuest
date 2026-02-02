import styles from "./my-listings.module.css";
import { useEffect, useRef, useState } from "react";
import type { FilterPropertiesData } from "../../../../../../interfaces/DTO/property/guest-filter-data";
import { PropertyStateEnum } from "../../../../../../enums/property-state-enum";
import AdvancedFilterOptions from "../../../../../shared-components/advanced-filter-departments/advanced-filter-departments";
import type { InfinitScrollDTO } from "../../../../../../interfaces/DTO/infinit-scroll/infinit-scroll";
import Api from "../../../../../../services/api/api";
import type { FilterPropertiesRequestDTO } from "../../../../../../interfaces/DTO/infinit-scroll/filter-guest-properties-request";
import axios from "axios";
import Loading from "../../../../../shared-components/loading/loading";
import type { UserPropertyCardResposeDTO } from "../../../../../../interfaces/DTO/property/user-property-card";
import UserPropertyCard from '../shared-components/user-property-card/user-property-card';
import type { UserPropertyCardInfinitScrollDTO } from "../../../../../../interfaces/DTO/infinit-scroll/user-property-infnit-scroll-response";
import { EnumUtils } from "../../../../../../utils/EnumUtils";
import { useNavigate } from "react-router";

export default function MyListings(){
    const navigate = useNavigate();

    type fitlerDataTypes = PropertyStateEnum | 0 | boolean;

    const [isLoading , setIsLoading] = useState<boolean>(true);
    const [properties , setProperties] = useState<UserPropertyCardResposeDTO[]>([]);
    const [filterData , setFilterData] = useState<FilterPropertiesData>({
        createdFrom: null,
        createdTo: null,
        maxPrice:null,
        minPrice:null,
        propertyState:0,
        propertyType:0,
        sortByDate:null,
        title:null
    });
    const [showAdvancedFilter , setShowAdvancedFilter] = useState<boolean>(false);

    const sectionSize = 10;

    const infinitScrollData = useRef<InfinitScrollDTO>({
        alreadyTaken: 0,
        sectionSize:sectionSize
    });

    const handleApplyFilter = (newFitlerData: FilterPropertiesData)=>{
        infinitScrollData.current = {
            ...infinitScrollData.current,
            alreadyTaken: 0
        }
        setFilterData(newFitlerData);
        setShowAdvancedFilter(false);
    }

    function updateFilterOptions(toUpdate : keyof typeof filterData , newOption : fitlerDataTypes){
        setFilterData(curr=>({...curr , [toUpdate] : newOption }))

        infinitScrollData.current = {
            ...infinitScrollData.current,
            alreadyTaken: 0
        }
    }

    useEffect(()=>{
        const getUserListings = async ()=>{

            try
            {
                const requestData : FilterPropertiesRequestDTO = {
                    filterData: filterData,
                    infinitScrollData: infinitScrollData.current
                }

                const response = await Api.post("PropertysListings/FitlerUserProperties" , requestData);
                const data : UserPropertyCardInfinitScrollDTO = response.data;

                setProperties(data.propertiesListings)

                infinitScrollData.current = {
                    ...infinitScrollData.current,
                    alreadyTaken: data.currTaken,
                }
                
                setIsLoading(false);
            }
            catch(err)
            {
                if(axios.isAxiosError(err))
                    console.error(`Axios Error: ${err.response?.data?.message ?? "unexpected Error"}`)
                else
                    console.error(`Unexpected Error: ${err}`);
            }
        }

        getUserListings();
    } , [filterData])

    return (
        <article className={`${styles.mainContainer} globalMyListings`}>
                <div className={styles.header}>
                    <div className={styles.textArea}>
                        <span className={styles.upperText}>My Listings</span>
                        <span className={styles.lowerText}>view and manage all your property listings in one piece</span>
                    </div>
                    <button className={`${styles.addBtn} greenBtn`}
                    onClick={()=>navigate("/user-page/addNewListing")}>
                        <i className={`${styles.plusIcon} fa-solid fa-plus`}></i>
                        <span className={styles.addText}>Add New Listing</span>
                    </button>
                </div>
                <div className={styles.body}>
                    <div className={styles.topArea}>
                        <div className={styles.filterOptionsRow}>
                            <span className={`${styles.option}
                            ${styles.all}
                            ${filterData.propertyState === 0 ? styles.selected : ""}`}
                            onClick={()=>updateFilterOptions("propertyState" , 0)}>All</span>

                            <span className={`${styles.option}
                            ${styles.avtive} ${EnumUtils.isSelected(filterData.propertyState ?? 0 , PropertyStateEnum.active) ? styles.selected : ""}`}
                            onClick={()=>updateFilterOptions("propertyState" , PropertyStateEnum.active)}>Avtive</span>

                            <span className={`${styles.option}
                            ${styles.pending} ${EnumUtils.isSelected(filterData.propertyState ?? 0 , PropertyStateEnum.pending) ? styles.selected : ""}`}
                            onClick={()=>updateFilterOptions("propertyState" , PropertyStateEnum.pending)}>Pending</span>

                            <span className={`${styles.option}
                            ${styles.sold}
                            ${EnumUtils.isSelected(filterData.propertyState ?? 0 , PropertyStateEnum.Sold) ? styles.selected : ""}`}
                            onClick={()=>updateFilterOptions("propertyState" , PropertyStateEnum.Sold)}>Sold</span>

                        </div>
                        <div className={styles.btns}>
                        <button className={styles.filterBtn}
                        onClick={()=>setShowAdvancedFilter(true)}>
                            <i className={`${styles.filterIcon} fa-solid fa-filter`}></i>
                            <span className={styles.filterText}>Filter</span>
                        </button>
                        <button className={styles.sortBtn}
                        onClick={()=>updateFilterOptions("sortByDate" , !filterData.sortByDate)}>
                            <i className="fa-solid fa-sort"></i>
                            <span className={styles.sortText}>Sort by Date</span>
                        </button>
                        </div>
                    </div>
                    <div className={styles.listingsArea}>
                        {
                            isLoading ? <div className={styles.loading}><Loading/></div> : 

                            properties.map(property=>
                            <UserPropertyCard
                                key={property.id}
                                data={property}
                            />)
                        }
                    </div>
                </div>

            {showAdvancedFilter && 
            <AdvancedFilterOptions
            close={()=>setShowAdvancedFilter(false)}
            isUser={true}
            oldfilterData={filterData}
            handleApplyFilter={handleApplyFilter}
            />}

        </article>
    );
}