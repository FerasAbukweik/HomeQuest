import styles from './dashboard.module.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Api from '../../../../../../services/api/api';
import type { UserDashBoardData } from '../../../../../../interfaces/DTO/user/user-dashboard';
import Loading from '../../../../../shared-components/loading/loading';
import UserPropertyCard from '../shared-components/user-property-card/user-property-card';
import { useNavigate } from 'react-router';

export function DashBoard(){
    const navigate = useNavigate();

    const [isLoading , setIsloading] = useState<boolean>(true);
    const [userData , setUserData] = useState<UserDashBoardData | undefined>(undefined);
    const [forceRerender , setForceRerender] = useState<boolean>(false);

    useEffect(()=>{
        const controller = new AbortController();
        const fetchDashBoardData = async ()=>
            {
                try
                {
                    const respose = await Api.get("Users/DashBoardData" , {
                        signal: controller.signal
                    });
                    setUserData(respose.data);
                    setIsloading(false);
                }
                catch (error : unknown)
                {
                    if(axios.isAxiosError(error))
                    {
                        if(error.name === "CanceledError") return;
                        console.error(`error: ${error.response?.data?.message ?? "Unexpexted Error: " + error}`);
                    }
                    else if(error instanceof Error)
                        console.error(`Unexpexted Error: ${error}`)
                }
            }
            fetchDashBoardData();

            return ()=> controller.abort();
        } , [forceRerender])

    return (
        <article className="globalDashboard">
            {
                isLoading ? <div className={styles.loading}><Loading/></div> :
                
                <div className={styles.mainDashBoardContainer}>
                    <div className={styles.topArea}>
                        <div className={styles.welcomeArea}>
                            <span className={styles.welcomeText}>Welcome Back, Alex!</span>
                            <span className={styles.subText}>Heres whats happening with your properties today</span>
                        </div>
                        <button className={`${styles.addBtn} greenBtn`}
                        onClick={()=>navigate("/user-page/addNewListing")}>
                            <i className={`${styles.plusIcon} fa-solid fa-plus`}></i>
                            <span className={styles.addText}>Add New Listing</span>
                        </button>
                    </div>
                    <div className={styles.notifyData}>
                        <div className={`${styles.container} ${styles.activeListings}`}>
                            <span className={styles.headerText}>Active Listings</span>
                            <span className={styles.bodyText}>{userData?.numberOfActiveListings}</span>
                            <span className={styles.footerText}>{userData?.numOfActiveListingsLastMonth} this month</span>
                        </div>
                        <div className={`${styles.container} ${styles.totalViews}`}>
                            <span className={styles.headerText}>Total Views</span>
                            <span className={styles.bodyText}>{userData?.totalViews}</span>
                            <span className={styles.footerText}>
                                {
                                    userData?.totalViews ?? 0 > 0 ?

                                    ((userData?.totalViewsLastMonth ?? 0) * 100 / (userData?.totalViews ?? 1)).toFixed(0)
                                    : 0
                                }
                                % This Month</span>
                        </div>
                        <div className={`${styles.container} ${styles.newMessages}`}>
                            <span className={styles.headerText}>New Messages</span>
                            <span className={styles.bodyText}>0</span>
                            <span className={styles.footerText}>0 Today</span>
                        </div>
                    </div>
                    <div className={styles.recentActivityArea}>
                        <span className={styles.recentActivityText}>Recent Activity</span>
                        <div className={styles.listingsArea}>
                            {
                                userData?.propertiesCardData.map(currData => 
                                <UserPropertyCard
                                    key={currData.id}
                                    data={currData}
                                    reRender={()=>setForceRerender(curr=>!curr)}
                                ></UserPropertyCard>
                            )
                            }
                        </div>
                    </div>
                </div> 
            }
        </article>
    );
}

export default DashBoard;