import styles from "./main.module.css";
import TopNav from "../../shared-components/top-nav-bar/top-nav-bar";
import Footer from "../../shared-components/footer/footer";
import MainPagePropertyCard from "../../shared-components/mini-property-details/main-page-property-card";
import {useContext, useEffect, useRef, useState } from "react";
import type { FilterPropertiesRequestDTO } from "../../../interfaces/DTO/infinit-scroll/filter-guest-properties-request"; 
import type { InfinitScrollDTO } from "../../../interfaces/DTO/infinit-scroll/infinit-scroll";
import Loading from "../../shared-components/loading/loading";
import type { GuestPropertyCardResponseDTO } from "../../../interfaces/DTO/property/guest-property-card";
import type { FilterPropertiesData } from "../../../interfaces/DTO/property/guest-filter-data";
import AdvancedFilterOptions from "../../shared-components/advanced-filter-departments/advanced-filter-departments";
import { servicesContext } from "../../../services/services-context";

export function Main() {
  const services = useContext(servicesContext)?.propertiesServices;

  const [properties, setProperties] = useState<GuestPropertyCardResponseDTO[]>([]);
  const [showAdvancedFilterOptions , setShowAdvancedFilterOptions] = useState<boolean>(false);
  const [isLoading , setIsLoading] = useState<boolean>(false);
  const isMoreAvaiable = useRef<boolean>(true);const [filterData , setFilterData] = useState<FilterPropertiesData>({
    minPrice: null,
    maxPrice: null,
    createdFrom: null,
    createdTo: null,
    title : null,
    sortByDate: false,
    propertyType: 0,
    propertyState: 0,
  })
  const isFetchingProperties = useRef<boolean>(false);
  const sectionSize = 1;
  const infinitScrollData = useRef<InfinitScrollDTO>({
    alreadyTaken: 0,
    sectionSize,
  });
  const observerRef = useRef<IntersectionObserver>(
    new IntersectionObserver(entries => {
      if (
          entries[0].isIntersecting && 
          isMoreAvaiable.current
      ) {
          setFilterData(curr => ({ ...curr }));
      }
    }));


  const initPropertiesState = ()=>{
    setProperties([]);
    infinitScrollData.current.alreadyTaken =  0;
    isMoreAvaiable.current = true;
  }

  const handleApplyAdvancedFilter = (newFilterData : FilterPropertiesData)=>{
    initPropertiesState();
    setFilterData({...newFilterData});
    setShowAdvancedFilterOptions(false);
  }

  const updateFilterData = (toUpdate : keyof typeof filterData ,newVal : string | number | boolean)=>
    {
      setFilterData(curr=>({...curr , [toUpdate]:(newVal ? newVal : null)}))
    }
    

  useEffect(() => {
    const fetchGuestProperties = async () => {
      try
      {
        if(!services) throw new Error("services isn't defined");
        if (!isMoreAvaiable.current || isFetchingProperties.current) return;

        isFetchingProperties.current = true;
        setIsLoading(true);

        const requestData : FilterPropertiesRequestDTO = {
          filterData: filterData,
          infinitScrollData: infinitScrollData.current
        }
        const responseData = await services.FilterGuestProperties(requestData);

        if (!responseData) throw new Error("Failed to fetch data");

        setProperties(prev => [
          ...prev,
          ...responseData.propertiesListings,
        ]);

        if(responseData.currTaken == null) throw new Error("curr taken can'nt be null");
        infinitScrollData.current.alreadyTaken = responseData.currTaken;

        isMoreAvaiable.current = responseData.isMoreAvaiable ?? false;
      } catch (error) {
        console.error(error);
      }
      finally{
        isFetchingProperties.current = false;
        setIsLoading(false);
      }
    };

    fetchGuestProperties();
  }, [filterData , services]);

  useEffect(() => {
    if (!observerRef.current) return;

    const lastElement = document.querySelector(
      `.${styles.cards}>:last-child`
    );

    if (!lastElement) return;

    observerRef.current.disconnect();
    observerRef.current.observe(lastElement);
  }, [properties]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <TopNav />
        <div className={styles.headerImage}>
          <span className={styles.title}>Find Your Dream Home</span>
          <span className={styles.subtitle}>
            The key to your new home is just a search away. Start exploring properties now.
          </span>

          <div className={styles.searchBox}>
            <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Enter city, neighborhood, or address"
              onChange={(e)=>{
                initPropertiesState();
                updateFilterData("title" , e.target.value)
              }}
            />
            <button className={styles.searchBtn}>Search</button>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.optionsRow}>
          <select className={styles.option} defaultValue="">
            <option value="">Property Type</option>
            <option value="1">All</option>
          </select>

          <select className={styles.option} defaultValue="">
            <option value="">Price Range</option>
          </select>

          <button className={styles.option}
            onClick={(e)=>
            {
              e.stopPropagation();
              setShowAdvancedFilterOptions(true);
            }}>
            Advanced Filter
          </button>
        </div>

        <span className={styles.featuredTitle}>Featured Properties</span>

        <div className={styles.cards}>
          {properties.map((data) =>
            <MainPagePropertyCard key={data.id} data={data} />
          )}
        </div>
        {isLoading && <Loading/>}
      </div>

      <Footer />

      {
        showAdvancedFilterOptions && 
        <AdvancedFilterOptions
          handleApplyFilter={handleApplyAdvancedFilter}
          isUser={false}
          oldfilterData={filterData}
          close={()=>{setShowAdvancedFilterOptions(false)}}
        />
      }
    </div>
  );
}

export default Main;