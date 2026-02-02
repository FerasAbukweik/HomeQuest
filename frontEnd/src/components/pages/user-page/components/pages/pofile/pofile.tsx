import styles from './pofile.module.css'
import testImg from '../../../../../../assets/images/main-header-image.png'

export default function Profile(){
    return(
        <article className={`${styles.mainContainer} globalProfileContainer`}>
            <div className={`defaultContainer ${styles.topContainer}`}>
                <div className={styles.profilePicDiv}>
                    <img src={testImg} className={styles.profileImg} alt="Profile Imgae" />
                    <div className={styles.cameraIcon}>
                        <i className="fa-regular fa-camera"></i>
                    </div>
                </div>
                <div className={styles.column}>
                    <span className={styles.name}>Alex Morgan</span>
                    <span className={styles.updateText}>Update your photo and personal details</span>
                </div>
                <div className={styles.btns}>
                    <button className={`${styles.cancelBtn} greenBtn`}>Cancel</button>
                    <button className={`${styles.saveChanges} greenBtn`}>Save Changes</button>
                </div>
            </div>
            <div className={`defaultContainer ${styles.personalInfoContainer}`}>
                <span className="topText">Personal Information</span>
                <div className={styles.userInfo}>
                    <div className={`title_input ${styles.info}`}>
                        <span className="title">First Name</span>
                        <input type="text"/>
                    </div>
                    <div className={`title_input ${styles.info}`}>
                        <span className="title">Last Name</span>
                        <input type="text"/>
                    </div>
                    <div className={`title_input ${styles.info}`}>
                        <span className="title">Email Address</span>
                        <input type="text"/>
                    </div>
                    <div className={`title_input ${styles.info}`}>
                        <span className="title">Phone Number</span>
                        <input type="text"/>
                    </div>
                </div>
                <div className="title_input">
                    <span className="title">Bio</span>
                    <textarea className={`defaultTextArea ${styles.bioTextArea}`} placeholder='Type your bio here'></textarea>
                </div>
            </div>
            <div className={styles.rightSideContainers}>
                <div className={`defaultContainer ${styles.preferenceContainer}`}>
                    <span className={`topText ${styles.topText}`}>Account Preference</span>
                    <div className={styles.preferenceOption}>
                        <span className={styles.text}>Email Notification</span>
                        <input type="checkBox" className={`${styles.switch} switch`}/>
                    </div>
                    <div className={styles.preferenceOption}>
                        <span className={styles.text}>SMS Notification</span>
                        <input type="checkBox" className={`${styles.switch} switch`}/>
                    </div>
                    <div className={styles.preferenceOption}>
                        <span className={styles.text}>Two-Factor Authentication</span>
                        <input type="checkBox" className={`${styles.switch} switch`}/>
                    </div>
                </div>

                <div className={`defaultContainer ${styles.deleteAccountContainer}`}>
                    <span className={styles.deleteAccountText}>Delete Account</span>

                    <p className={styles.deleteAccountAlarm}>
                        Permanently delete ypur account This action is irreversible and will erase all your data
                    </p>
                    <button className={styles.deleteAccountBtn}>Delete my account</button>
                </div>
            </div>
            <div className={`defaultContainer ${styles.changePasswordContainer}`}>
                <span className={`topText ${styles.topText}`}>Change Password</span>
                <div className={styles.inputArea}>
                    <div className={`title_input ${styles.info}`}>
                        <span className="title">Current Password</span>
                        <input type="text" />
                    </div>
                    <div className={`title_input ${styles.info}`}>
                        <span className="title">New Password</span>
                        <input type="text" />
                    </div>
                </div>
                <button className={`${styles.changPassBtn} greenBtn`}>Change Password</button>
            </div>
        </article>
    );
}