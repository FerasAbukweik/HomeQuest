import styles from './top-nav-bar.module.css'

export function TopNav(){
    return(
        <nav className={styles.topNav}>
            <div className={styles.logo}>
                <i className="fa-solid fa-house-chimney logoIcon"></i>
                <span className={`${styles.homeQuestText} logo-homequest-text`}>HomeQuest</span>
            </div>
            <div className={styles.midSection}>
                <span className={styles.buyBtn}>Buy</span>
                <span className={styles.rentBtn}>Rent</span>
                <span className={styles.sellBtn}>Sell</span>
            </div>
            <button className={styles.loginBtn}>Log In</button>
            <button className={styles.signupBtn}>Sign Up</button>
        </nav>
    );
}

export default TopNav;