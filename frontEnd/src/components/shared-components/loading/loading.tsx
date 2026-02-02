import styles from "./loading.module.css"

export default function Loading(){
    return(
    <div className={`${styles.loading} globalLoading`}>
        <span className={styles.item}></span>
        <span className={styles.item}></span>
        <span className={styles.item}></span>
        <span className={styles.item}></span>
        <span className={styles.item}></span>
        <span className={styles.item}></span>
    </div>
    );
}