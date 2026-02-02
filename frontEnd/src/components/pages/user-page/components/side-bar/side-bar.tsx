import styles from './side-bar.module.css'
import testImg from '../../../../../assets/images/main-header-image.png'
import { useNavigate } from 'react-router';

type SideBarType = {
    setShowSideBar : React.Dispatch<React.SetStateAction<boolean>>
}

export function SideBar({setShowSideBar} : SideBarType){
    const navigator = useNavigate();
    function navigateTo(to : string){
        navigator("/user-page/"+to);
        setShowSideBar(false);
    }

    return(
    <aside className={`${styles.sideBar} globalUserPageSideBar`}
    onClick={(e)=>e.stopPropagation()}>
        <div className={styles.header}>
            <div className={styles.logo}>
                <span className={`${styles.logoText} logo-homequest-text`}>HomeQuest</span>
            </div>
        </div>
        <ul className={styles.body}>
            <li className={`${styles.option} ${styles.dashboardOptoin}`}
                onClick={()=>navigateTo("dashBoard")}>
                <i className={`${styles.icon} fa-solid fa-border-all`}></i>
                <span className={styles.optionText}>Dashboard</span>
            </li>
            <li className={`${styles.option} ${styles.myListings}`}
            onClick={()=>navigateTo("myListings")}>
                <i className={`${styles.icon} fa-regular fa-house`}></i>
                <span className={styles.optionText}>My Listings</span>
            </li>
            <li className={`${styles.option} ${styles.addNewListing}`}
            onClick={()=>navigateTo("addNewListing")}>
                <i className={`${styles.icon} fa-solid fa-plus`}></i>
                <span className={styles.optionText}>Add new Listing</span>
            </li>
            <li className={`${styles.option} ${styles.profile}`}
            onClick={()=>navigateTo("profile")}>
                <i className={`${styles.icon} fa-regular fa-user`}></i>
                <span className={styles.optionText}>Profile</span>
            </li>
        </ul>
        <div className={styles.footer}>
            <div className={styles.row}>
                <img src={testImg} alt="" className={styles.profileImg} />
                <div className={`${styles.column} ${styles.userInfo}`}>
                    <span className={styles.Name}>Alex Morgan</span>
                    <span className={styles.email}>alex.morgan@gmail.com</span>
                </div>
            </div>
        </div>
    </aside>
    );
}

export default SideBar;