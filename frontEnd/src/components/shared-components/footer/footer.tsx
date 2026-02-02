import styles from './footer.module.css'

export function Footer(){
    return(
    <footer className={styles.footer}>
        <div className={styles.footerContainer}>
            <div className={styles.footerRow}>

                <div>
                    <div className={styles.logo}>
                        <i className={`${styles.locoIcon} fa-solid fa-house-chimney`}></i>
                        <span className={styles.logoText}>HomeQuest</span>
                    </div>
                    <div className={styles.footerText}>
                        Your partner in finding the perfect place to call home.
                    </div>
                </div>

                <div>
                    <span className={styles.footerTitle}>Company</span>
                    <span className={styles.footerLink}>About</span>
                    <span className={styles.footerLink}>Careers</span>
                    <span className={styles.footerLink}>Blog</span>
                </div>

                <div>
                    <span className={styles.footerTitle}>Explore</span>
                    <span className={styles.footerLink}>Buy a home</span>
                    <span className={styles.footerLink}>Rent a home</span>
                    <span className={styles.footerLink}>Sell a home</span>
                </div>

                <div>
                    <span className={styles.footerTitle}>Legal</span>
                    <span className={styles.footerLink}>Privacy Policy</span>
                    <span className={styles.footerLink}>Terms & Conditions</span>
                </div>
            </div>

            <div className={styles.line}></div>

            <div className={styles.copy}>
                &copy; 2023 HomeQuest — All Rights Reserved
            </div>
        </div>
    </footer>
    );
}

export default Footer;