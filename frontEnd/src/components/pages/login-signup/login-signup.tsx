import styles from "./login-signup.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Api from "../../../services/api/api";
import type { loginDTO } from "../../../interfaces/DTO/login-signup/login";
import axios from "axios";
import type { SignUpDTO } from "../../../interfaces/DTO/login-signup/sighup";

export function LoginSignupPage() {
    const navigate = useNavigate();

    const [currPage, setCurrPage] = useState<boolean>(true);
    const [showPassword , setShowPassword] = useState<boolean>(false);

    const [form, setForm] = useState({
        userName: "",
        email: "",
        phone: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        userName: "",
        email: "",
        phone: "",
        password: "",
        fetchingErrors: ""
    });

    const validation = {
        userName: (v: string) => (v ? "" : "Name is required"),
        email: (v: string) =>
            !v ? "Email is required" :
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" :
            "Wrong Email Format",
        phone: (v: string) =>
            !v ? "Phone number is required" :
            /^(07)[7-9]\d{7}$/.test(v) ? "" :
            "Only JOD phone numbers allowed",
        password: (v: string) =>
            !v ? "Password is required" :
            /^\S+$/.test(v) ? "" :
            "Password cannot contain spaces",
    };

    function updateField(field: keyof typeof form, value: string) {
        setForm({ ...form, [field]: value });
        checkValidation(field , value);
    }

    function checkValidation(field: keyof typeof form, value?: string) {
        const val = value ?? form[field];
        const error = validation[field](val);
        setErrors({ ...errors, [field]: error });
    }

    function resetForm() {
        setForm({
            userName: "",
            email: "",
            phone: "",
            password: ""
        });
        setErrors({
            userName: "",
            email: "",
            phone: "",
            password: "",
            fetchingErrors: ""
        });
    }

    useEffect(()=>{
        const refreshTokens = async ()=>
        {
            try
            {
                await Api.post("Auth/RefreshTokens");
                navigate("/user-page/dashBoard");
            }
            catch(error)
            {
                if (axios.isAxiosError(error))
                    console.error(error?.response?.data?.message ?? "Unknown Error")
                else
                    console.error("Unknown error: ", error);
            }
        }

        refreshTokens();
    } , [navigate])

    async function  handleLogin() {
        try
        {
            const newErrors : typeof errors = {
                userName : "",
                email: validation.email(form.email),
                phone : "",
                password: validation.password(form.password),
                fetchingErrors: ""
            };
            setErrors(newErrors);

            if (newErrors.email || newErrors.password) return;

            const loginData : loginDTO = {
                email: form.email,
                password: form.password
            }
            const response = await Api.post("Auth/Login" , loginData);
            if(response.status === 200) navigate("/user-page/dashBoard");
         }
        catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 401)
                setErrors(curr=>({...curr , ["fetchingErrors"]: "Wrong Email or Password" }));
            else
                console.error("Unknown error: ", error);
        }
    }

    async function handleSignup() {
        try
        {
            const newErrors : typeof errors = {
                userName : validation.userName(form.userName),
                email: validation.email(form.email),
                phone : validation.phone(form.phone),
                password: validation.password(form.password),
                fetchingErrors: ""
            };
            setErrors(newErrors);

            if (newErrors.userName || newErrors.email || newErrors.phone || newErrors.password) return;

            const sighupData : SignUpDTO = {
                email: form.email,
                firstName: "",
                lastName: "",
                password: form.password,
                phoneNumber: form.phone,
                userName: form.userName
            } 
            const response = await Api.post("Users/AddUser" , sighupData);
            if(response.status === 200) navigate("/user-page/dashBoard");      
        }
        catch (error: unknown) {
            if (axios.isAxiosError(error))
                setErrors(curr=>({...curr , ["fetchingErrors"]: error?.response?.data?.message ?? "Unknown Error"}));
            else
                console.error("Unknown error: ", error);
        }
    }

    return (
        <div className="center-element bgImage">
            <div className={`${styles.mainContainer} main-container-for-centered-components`}>
                <div className={styles.header}>
                    <div className={styles.headerLogo}>
                        <i className="fa-solid fa-house-chimney logoIcon"></i>
                        <span className="logo-homequest-text">HomeQuest</span>
                    </div>

                    <div className={styles.headerText}>Find Your Next Home</div>
                    <div className={styles.loginSignupText}>Sign up or log in to continue</div>
                </div>
                <div className={`${styles.switchLoginSignup} ${!currPage && styles.switchAnimation}`}>
                    <span className={styles.selectLogin} onClick={() => { setCurrPage(true); resetForm(); }}>Log In</span>
                    <span className={styles.selectSignup} onClick={() => { setCurrPage(false); resetForm(); }}>Sign Up</span>
                </div>
                <div className={`${styles.body} column`}>
                    {currPage ? (
                        <>
                            <label className={`${styles.inputLable} input-text`}>Email Address</label>
                            <input
                                type="text"
                                className={`${styles.emailInput} default-input ${errors.email ? "redInputBorder" : ""}`}
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                onBlur={() => checkValidation("email")}/>

                            <label className={`${styles.inputLable} input-text`}>Password</label>
                            <div className={styles.passwordFiled}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`${styles.passwordInput} default-input ${errors.password ? "redInputBorder" : ""}`}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                    onBlur={() => checkValidation("password")}/>
                                <div
                                    className={styles.showHidePasswordIcon}
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword === true ? 
                                    (<i className="fa-solid fa-eye-slash"></i>) :
                                    (<i className="fa-solid fa-eye"></i>)
                                    }
                                </div>
                            </div>
                            {errors.email && <span className="wrong-input">* {errors.email}</span>}
                            {errors.password && <span className="wrong-input">* {errors.password}</span>}
                            {errors.fetchingErrors && <span className="wrong-input">* {errors.fetchingErrors}</span>}

                            <span className={styles.forgetPasswordText} onClick={()=>navigate("/forget-passwrod")}>Forget Password?</span>

                            <button className="default-button" onClick={handleLogin}>
                                Log In
                            </button>
                        </>
                    ) : (
                        <>
                            <label className={`${styles.inputLable} input-text`}>User Name</label>
                            <input
                                type="text"
                                className={`${styles.nameInput} default-input ${errors.userName ? "redInputBorder" : ""}`}
                                placeholder="Enter your User Name"
                                value={form.userName}
                                onChange={(e) => updateField("userName", e.target.value)}
                                onBlur={() => checkValidation("userName")}
                            />

                            <label className={`${styles.inputLable} input-text`}>Email Address</label>
                            <input
                                type="text"
                                className={`${styles.emailInput} default-input ${errors.email ? "redInputBorder" : ""}`}
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={(e) =>updateField("email", e.target.value)}
                                onBlur={() => checkValidation("email")}
                            />
                            <label className={`${styles.inputLable} input-text`}>Phone Number</label>
                            <input
                                type="text"
                                className={`${styles.phoneInput} default-input ${errors.phone ? "redInputBorder" : ""}`}
                                placeholder="Enter your phone number"
                                value={form.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                onBlur={() => checkValidation("phone")}
                            />
                            <label className={`${styles.inputLable} input-text`}>Password</label>
                            <div className={styles.passwordFiled}>
                                <input
                                    type={showPassword === true ? "text" : "password"}
                                    className={`${styles.passwordInput} default-input ${errors.password ? "redInputBorder" : ""}`}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                    onBlur={() => checkValidation("password")}/>
                                <div
                                    className={styles.showHidePasswordIcon}
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword === true ? 
                                    (<i className="fa-solid fa-eye-slash"></i>) :
                                    (<i className="fa-solid fa-eye"></i>)
                                    }
                                </div>
                            </div>
                            
                            {errors.userName && <span className="wrong-input">* {errors.userName}</span>}
                            {errors.email && <span className="wrong-input">* {errors.email}</span>}
                            {errors.phone && <span className="wrong-input">* {errors.phone}</span>}
                            {errors.password && <span className="wrong-input">* {errors.password}</span>}
                            {errors.fetchingErrors && <span className="wrong-input">* {errors.fetchingErrors}</span>}

                            <button className="default-button" onClick={handleSignup}>
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
                <div className={styles.footer}>
                    <div className={styles.footerLine} />
                    <div className={styles.optionsRow}>
                        <div className={styles.footerGoogleOption}>
                            <i className={`${styles.googleLogo} fa-brands fa-google`}></i>
                            <span>Google</span>
                        </div>
                        <div className={styles.footerFacebookOption}>
                            <i className={`${styles.facebookLogo} fa-brands fa-facebook`}></i>
                            <span>Facebook</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginSignupPage;