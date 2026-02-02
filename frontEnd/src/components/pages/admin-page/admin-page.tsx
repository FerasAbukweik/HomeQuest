import styles from './admin-page.module.css'


export function AdminPage(){
    return(
        <div className={`${styles.mainContainer} globalAdminPageContainer`}>
            <div className={styles.header}>
                <span className={styles.topText}>Welcome back, Admin!</span>
                <span className={styles.bottomText}>Here's summary of your platorm's activity</span>
            </div>
            <div className={styles.body}>
                <div className={styles.topRow}>
                    <div className={`${styles.outlineContainer} ${styles.totalListings}`}>
                        <span className={styles.topText}>Total Listings</span>
                        <span className={styles.info}>1,234</span>
                        <span className={styles.statue}>+5,2%</span>
                    </div>
                    <div className={`${styles.outlineContainer} ${styles.activeUsers}`}>
                        <span className={styles.topText}>Active Users</span>
                        <span className={styles.info}>5.678</span>
                        <span className={styles.statue}>+1,8%</span>
                    </div>
                    <div className={`${styles.outlineContainer} ${styles.websiteVisits}`}>
                        <span className={styles.topText}>Website Visits</span>
                        <span className={styles.info}>98,7K</span>
                        <span className={styles.statue}>+12.4%</span>
                    </div>
                    <div className={`${styles.outlineContainer} ${styles.PendingApprovals}`}>
                        <span className={styles.topText}>Pending Approvals</span>
                        <span className={styles.info}>12</span>
                        <span className={styles.statue}>+3 today</span>
                    </div>
                </div>
                <div className={styles.bottomRow}>
                    <div className={`${styles.outlineContainer} ${styles.propertyListingsByCategory}`}>
                        <span className={styles.topText}>Property Listing by Category</span>
                        <span className={styles.info}>1,234 Properties</span>
                        <span className={`${styles.smallText} ${styles.statue}`}>This Month 
                            <span className={styles.number}>+112</span>
                        </span>
                        <div className={styles.progressLinesArea}>
                            <div className={`${styles.row} ${styles.forSalses}`}>
                                <span className={styles.smallText}>For Sale</span>
                                <div className={styles.progressLine}></div>
                            </div>
                            <div className={`${styles.row} ${styles.forRent}`}>
                                <span className={styles.smallText}>For Rent</span>
                                <div className={styles.progressLine}></div>
                            </div>
                            <div className={`${styles.row} ${styles.commerecial}`}>
                                <span className={styles.smallText}>Commercial</span>
                                <div className={styles.progressLine}></div>
                            </div>
                            <div className={`${styles.row} ${styles.land}`}>
                                <span className={styles.smallText}>Land</span>
                                <div className={styles.progressLine}></div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.outlineContainer} ${styles.websiteTrafic}`}>
                        <span className={styles.topText}>Website Traffic (Last 30 Days)</span>
                        <span className={styles.info}>98,700 Visits</span>
                        <span className={`${styles.smallText} ${styles.statue}`}>This Month 
                            <span className={styles.number}>+10,1k</span>
                        </span>
                        <div className={styles.diagram}>
                            {/* external lib */}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <span className={styles.title}>Recent Reports</span>
                <table className={styles.reportTable}>
                    <thead>
                        <tr>
                            <th>REPORT ID</th>
                            <th>REPORT ITEM</th>
                            <th>REASON</th>
                            <th>REPORTED BY</th>
                            <th>DATE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#4521</td>
                            <td><span className={styles.reportText}>Listing #8902</span></td>
                            <td>Mileading Phoros</td>
                            <td>John Doe</td>
                            <td>2023-10-27</td>
                            <td>
                                <i className="fa-solid fa-check"></i>
                                <i className="fa-solid fa-gavel"></i>
                            </td>
                        </tr>
                        <tr>
                            <td>#4521</td>
                            <td><span className={styles.reportText}>Listing #8902</span></td>
                            <td>Mileading Phoros</td>
                            <td>John Doe</td>
                            <td>2023-10-27</td>
                            <td>
                                <i className="fa-solid fa-check"></i>
                                <i className="fa-solid fa-gavel"></i>
                            </td>
                        </tr>
                        <tr>
                            <td>#4521</td>
                            <td><span className={styles.reportText}>Listing #8902</span></td>
                            <td>Mileading Phoros</td>
                            <td>John Doe</td>
                            <td>2023-10-27</td>
                            <td>
                                <i className="fa-solid fa-check"></i>
                                <i className="fa-solid fa-gavel"></i>
                            </td>
                        </tr>
                        <tr>
                            <td>#4521</td>
                            <td><span className={styles.reportText}>Listing #8902</span></td>
                            <td>Mileading Phoros</td>
                            <td>John Doe</td>
                            <td>2023-10-27</td>
                            <td>
                                <i className="fa-solid fa-check"></i>
                                <i className="fa-solid fa-gavel"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPage;