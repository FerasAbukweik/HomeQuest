import styles from './header.module.css'
import testImg from '../../../../../assets/images/main-header-image.png'

export function Header(){
    return(
    <div className={`${styles.header} globaUserPageHeader`}>
        <div className={styles.inputDev}>
            <input type="text" className={styles.searchInput} placeholder={'Search for properties....'}/>
            <i className={`${styles.searchIcon} fa-solid fa-magnifying-glass`}></i>
        </div>
        <i className={`${styles.bellIcon} fa-regular fa-bell`}></i>
        <div className={styles.profileImgDiv}>
            <img src={testImg} alt="" className={styles.profileImg} />
        </div>
    </div>
    );
}

export default Header;