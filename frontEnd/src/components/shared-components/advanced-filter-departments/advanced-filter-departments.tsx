import {useState } from "react";
import styles from "./advanced-filter-departments.module.css";
import type { advancedFilterOptions } from "../../../interfaces/DTO/property/advanced-filter-data"; 
import type { FilterPropertiesData } from "../../../interfaces/DTO/property/guest-filter-data";
import { PropertyTypesList } from "../../../enums/property-types-enum";
import { PropertyStateList } from "../../../enums/property-state-enum";
import { EnumUtils } from "../../../utils/EnumUtils";


export default function AdvancedFilterOptions({
  handleApplyFilter,
  isUser,
  oldfilterData,
  close
}: advancedFilterOptions) {

    const [filterData , setFilterData] = useState<FilterPropertiesData>(oldfilterData);

    const addToSelected = (key: "propertyType" | "propertyState" , toAdd: number) => {
        const currVal = filterData[key];
        if(isSelected(currVal ?? 0 , toAdd)) return; 

        setFilterData(curr => (
            {
                ...curr , 
                [key] : (currVal ?? 0) + toAdd
            }
        ))
    }

    const removeFromSelected = (key: "propertyType" | "propertyState" , toAdd: number) => {
        const currVal = filterData[key];
        if(!isSelected(currVal ?? 0 , toAdd)) return; 
        
        setFilterData(curr => (
            {
                ...curr , 
                [key] : currVal! - toAdd
            }
        ))
    }

    const setOption = (key: string, value: unknown) => {
        setFilterData(curr=>( { ...curr, [key]: value }));
    };

  const handleApply = () => {
    handleApplyFilter(filterData);
  };

    const isSelected = (allSelected : number , toCheck : number)=>{
    return (allSelected & toCheck) == toCheck;
  }

  const convertToIOSDate = (localDate : string) : string=>{
    const currDate = new Date(localDate);
    return currDate.toISOString();
  }

  return (
  <div
    className={`${styles.mainContainer} globalAdvancedFilterDepartments`}>
    <div className={styles.header}>
        <span className={styles.text}>Advanced Filter</span>
        <i className={`${styles.x_icon} fa-solid fa-xmark`}
        onClick={()=>close()}></i>
    </div>

    <div className={styles.body}>
        <div className={styles.inputwrapper}>
            <div className={styles.title_input}>
                <label className={styles.title} htmlFor="minPrice">MIN PRICE</label>
                <input
                type="number"
                id="minPrice"
                placeholder="Min Price"
                value={filterData.minPrice ?? ""}
                onChange={(e) => setOption("minPrice", e.target.value ? Math.min(99999999 , Number(e.target.value)) : null)}/>
            </div>

            <div className={styles.title_input}>
                <label className={styles.title} htmlFor="maxPrice">MAX PRICE</label>
                <input
                id="maxPrice"
                type="number"
                placeholder="Max Price"
                value={filterData.maxPrice ?? ""}
                onChange={(e) => setOption("maxPrice", e.target.value ? Math.min(99999999 , Number(e.target.value)) : null)}/>
            </div>

            <div className={styles.title_input}>
                <label className={styles.title} htmlFor="startDate">START DATE</label>
                <input
                id="startDate"
                type="date"
                value={filterData.createdFrom ?? ""}
                onChange={(e) =>
                    setOption("createdFrom", e.target.value ? convertToIOSDate(e.target.value) : null)
                    }/>
            </div>

            <div className={styles.title_input}>
            <label className={styles.title} htmlFor="endDate">END DATE</label>
            <input
            type="date"
            value={filterData.createdTo ?? ""}
            onChange={(e) => 
                setOption("createdTo", e.target.value ? convertToIOSDate(e.target.value) : null)
            }/>
            </div>

            <div className={styles.selectWrapper}>
                <div className={styles.selectArea}>

                    <div className={styles.selectedOptions}>
                        {
                            PropertyTypesList.map(({type, val} , idx)=>{
                                if(!isSelected(filterData.propertyType ?? 0 , Number(val))) return;
                                return(
                                    <div className={styles.option} key={`selected-property-type-${idx}`}>
                                        {type}
                                        <i className={`${styles.x_icon} fa-solid fa-xmark`}
                                        onClick={()=>removeFromSelected("propertyType", val ? Math.min(99999999 , val) : 0)}></i>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <select
                    value=""
                    onChange={(e) =>
                        addToSelected("propertyType", e.target.value ? Math.min(99999999 , Number(e.target.value)) : 0)}>

                        <option value="" disabled>Property Type</option>
                        {
                            PropertyTypesList.map(({type , val} , idx)=>{
                            if(EnumUtils.isSelected(Number(filterData.propertyType) , val)) return;

                                return(
                                    <option key={`property-type-option-${idx}`} value={val}>
                                        {type}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>

                <div className={styles.selectArea}>

                    <div className={styles.selectedOptions}>
                        {
                            PropertyStateList.map(({type, val} , idx)=>{
                                if(!isSelected(filterData.propertyState ?? 0 , Number(val))) return;

                                return(
                                    <div className={styles.option} key={`selected-property-state-${idx}`}>
                                        {type}
                                        <i className={`${styles.x_icon} fa-solid fa-xmark`}
                                        onClick={()=>removeFromSelected("propertyState", val ? Math.min(99999999 , val) : 0)}></i>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <select
                    value=""
                    onChange={(e) =>
                        addToSelected("propertyState", e.target.value ? Math.min(99999999 , Number(e.target.value)) : 0)}>

                    <option value="" disabled>Property State</option>
                    {
                            PropertyStateList.map(({type , val} , idx)=>{
                                if(!isUser && (val === 4 || val === 8 || val === 16 || val === 32)) return;
                                if(EnumUtils.isSelected(Number(filterData.propertyState) , val)) return;

                                return(
                                    <option key={`property-state-option-${idx}`} value={val}>
                                        {type}
                                    </option>
                                )
                            })
                        }
                </select>
                </div>
            </div>
        </div>

        <div className={styles.checkboxWrapper}>
            <div className={styles.checkBox}>
                <input
                id="sortByDate"
                type="checkbox"
                checked={filterData.sortByDate ?? false}
                onChange={(e) => setOption("sortByDate", e.target.checked ? e.target.checked : null)}/>
                <label htmlFor="sortByDate" className={styles.title}>Sort by date</label>
            </div>
        </div>
    </div>
        <div className={styles.footer}>
            <button className={styles.filterBtn} onClick={handleApply}>
                Apply Filter
            </button>
            <button className={styles.resetBtn}>Reset all filters</button>
        </div>
    </div>

  );
}