import styles from './user-page.module.css'
import Header from './components/header/header';
import SideBar from './components/side-bar/side-bar';
import DashBoard from './components/pages/dashboard/dashboard';
import MyListings from './components/pages/my-listings/my-listings';
import AddNewListing from './components/pages/add-new-listing/add-new-listing';
import Profile from './components/pages/pofile/pofile';
import {useParams } from 'react-router';
import { useState, type JSX } from 'react';

export default function UserPage(){
    const {page} = useParams();
    const [showSideBar , setShowSideBar] = useState<boolean>(false);
    function toggleSideBar(){
        setShowSideBar(!showSideBar);
    }

    const pages : Record<string, JSX.Element> = {
        dashBoard : <DashBoard/>,
        myListings : <MyListings/>,
        addNewListing : <AddNewListing/>,
        profile: <Profile/>
        // errorPage : <Errorpage/>
    }

    return(
        <div className={`${styles.mainUserPageContainer} globalMainUserPageContainer`}
        onClick={()=>{
            if(window.innerWidth < 550) setShowSideBar(false)}}>
            <Header/>
            <div className={`${styles.showSideBarDiv} ${showSideBar ? `${styles.showSideBar} globalShowSideBar` : ""}`}
            onClick={(e)=>{toggleSideBar(); e.stopPropagation()}} >
                <i className={`${styles.logoIcon} logoIcon fa-solid fa-house-chimney`}></i>
            </div>
            {pages[page ?? "errorPage"] ?? pages["errorPage"]}
            <SideBar setShowSideBar={setShowSideBar}/>
        </div>
    );
}