import styles from './forget-password.module.css'
import { useState } from 'react';

export function ForgetPassword(){
    const [emailInput , setEmailInput] = useState<string>("");

    const [emailError , setEmailError] = useState<string>("");

    const emailValidation : (inp : string)=>string = (inp : string)=>{
        return (!inp ? "Email is required" :
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp) ? "" :
            "Wrong Email Format")
    }

    const checkValidation : (inp : string)=>void = (inp : string) =>{
        setEmailError(emailValidation(inp));
    }

    function handleSendLinkButton(){
        const currError = emailValidation(emailInput);
        setEmailError(currError);
        if(currError) return;

        //------------------------------
    }

    return(
        <div className={`${styles.bgImage} center-element`}>
            <div className={`${styles.mainContainer} main-container-for-centered-components column`}>
                <div className={`${styles.header} column`}>
                    <div className={styles.headerLogo}>
                        <i className="fa-solid fa-house-chimney logoIcon"></i>
                        <span className="logo-homequest-text">HomeQuest</span>
                    </div>
                    <span className={styles.headerText}>Forget Your Password</span>
                    <span className={styles.enterEmailText}>Enter your email to reset your password</span>
                </div>
                <div className={`${styles.body} column`}>
                    <label className= {`${styles.emailText} input-text`}>Email Address</label>
                    <input
                    type="text"
                    className={`${styles.emailInput} default-input`}
                    placeholder='Enter Your Email'
                    onChange={(e)=>{setEmailInput(e.target.value); checkValidation(e.target.value)}}
                    onBlur={(e)=>checkValidation(e.target.value)}/>
                    {emailError && <span className="wrong-input">* {emailError}</span>}
                    <button className={`${styles.sendLinkBtn} default-button`} onClick={()=>handleSendLinkButton()}>Send Link</button>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword;