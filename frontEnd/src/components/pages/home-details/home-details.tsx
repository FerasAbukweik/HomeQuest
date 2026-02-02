import styles from './home-details.module.css';
import TopNav from '../../shared-components/top-nav-bar/top-nav-bar';
import testImage from '../../../assets/images/main-header-image.png';
import { useParams } from 'react-router';
import { useContext, useEffect, useRef, useState } from 'react';
import type { PropertyDTO } from '../../../interfaces/DTO/property/perperty';
import Loading from '../../shared-components/loading/loading';
import { UrlUtils } from '../../../utils/url-utils';
import { servicesContext } from '../../../services/services-context';

enum Pages{
    overview = 1,
    features = 2,
    virtual_tour = 3
}

const headerText = {
            [Pages.overview] : "About This Property",
            [Pages.features]: "Property features",
            [Pages.virtual_tour]: "Property Virtual Tour"
        }

export function HomeDetails() {
    const services = useContext(servicesContext)?.propertiesServices

    const {id} = useParams();
    const data = useRef<PropertyDTO | undefined>(undefined);
    const [isLoading , setIsLoading] = useState<boolean>(true);
    const [currPage , setCurrPage] = useState<Pages>(Pages.overview);
    const [isCopied , setIsCopied] = useState<boolean>(false)

    const handleShare = ()=>{
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
    }

    useEffect(()=>{
        const fetchPropertyData = async ()=>{
            try
            {
                if(!services) throw new Error("Services isn't defined");
                if(!id) throw new Error("no id");
                
                const responseData = await services.GetPropertyDetails(id);
                if(!responseData) throw new Error("Faild to fetch data");

                data.current = {...responseData , createdAt: new Date(responseData.createdAt)};
                setIsLoading(false);
            }
            catch (error : unknown){
                if(error instanceof Error) console.error(error.message ?? error);
                console.error(error)
            }
        }

        fetchPropertyData();
    } , [id , services])

    return (
        <div className={styles.mainContainer}>
            <TopNav/>
            {isLoading ? <div className={styles.loading}><Loading/></div> :
            <>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <div className={`${styles.titleData} column`}>
                            <span className={styles.address}>{data.current?.address ?? ""}</span>
                            <div className={styles.title}>{data.current?.title ?? ""}</div>
                            <div className={styles.subTitle}>created At: {data.current?.createdAt.toLocaleDateString() ?? ""}</div>
                        </div>
                        <div className={styles.shareSaveBtns}>
                            <button className={`${styles.saveBtn} ${styles.smallBtn}`}>
                                <i className={`${styles.heartIcon} fa-regular fa-heart`}></i>
                                <span className={styles.saveBtnText}> Save</span>
                            </button>
                            <button className={`${styles.shareBtn} ${styles.smallBtn}`} onClick={()=>handleShare()}>
                                {
                                    isCopied ?
                                    <>
                                        <span className={styles.shareBtnText}>Copied !</span>
                                    </> :
                                    <>
                                        <i className={`${styles.shareIcon} fa-solid fa-share-nodes`}></i>
                                        <span className={styles.shareBtnText}> Share</span>
                                    </>
                                }
                                
                            </button>
                        </div>
                    </div>
                    <div className={styles.images}>
                        {
                            data.current?.imagesUrls.map((image , idx)=>{
                                return(
                                    <img
                                        src={image}
                                        className={styles.image}
                                        key={idx}
                                        onError={(e)=>{
                                            const el = e.target as HTMLImageElement;
                                            el.src = UrlUtils.noImg 
                                        }}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.homeDetails}>
                        <div className={styles.detailsOptions}>
                            <span className={`${currPage === Pages.overview ? styles.selectedOption : ""} ${styles.overviewOption}`}
                            onClick={()=>setCurrPage(Pages.overview)}>Overview</span>
                            <span className={`${currPage === Pages.features ? styles.selectedOption : ""} ${styles.featuresOption}`}
                            onClick={()=>setCurrPage(Pages.features)}>Features</span>
                            <span className={`${currPage === Pages.virtual_tour ? styles.selectedOption : ""} ${styles.virtualTourOption}`}
                            onClick={()=>setCurrPage(Pages.virtual_tour)}>Virtual Tour</span>
                        </div>
                        <div className={styles.content}>
                            <span className={styles.aboutText}>
                                {
                                    headerText[currPage] ?? ""
                                }
                            </span>
                            <p className={styles.detailsParagraph}>
                                {(()=>{
                                    switch (currPage){
                                        case Pages.overview: return data.current?.description ?? "no Description"
                                        case Pages.features: return ""
                                        case Pages.virtual_tour: return ""
                                    }
                                })()}
                            </p>
                            {currPage === Pages.overview && (()=>
                                <>
                                    <span className={styles.keyFeaturesText}>Key Features</span>
                                    <div className={styles.keyFeaturesArea}>
                                        <span className={styles.keyFeature}>Single Family</span>
                                        <span className={styles.keyFeature}>Built In 1895</span>
                                        <span className={styles.keyFeature}>Centeral Heating</span>
                                        <span className={styles.keyFeature}>Air Conditioning</span>
                                        <span className={styles.keyFeature}>2-car Garage</span>
                                        <span className={styles.keyFeature}>Pricate Yard</span>
                                    </div>
                                </>
                            )()}
                        </div>

                        <div className={styles.location}>
                            <span className={styles.locationText}>Location</span>
                            <img src={testImage} alt="" className={styles.locationOnMap} />
                        </div>
                    </div>

                    <div className={styles.extraDetails}>
                        <span className={styles.price}>${data.current?.price ?? "Unknown Error"}</span>
                        <div className={styles.line}></div>
                        <div className={styles.homeFeatures}>
                            <span className={styles.homeFeature}>4 Beds</span>
                            <span className={styles.homeFeature}>3 Baths</span>
                            <span className={styles.homeFeature}>2,400 Sqft</span>
                        </div>
                        <div className={styles.line}></div>
                        <button className={`${styles.smallBtn} ${styles.contactBtn}`}>Contact Agent</button>
                        <button className={`${styles.smallBtn} ${styles.tourBtn}`}>Request a Tour</button>
                        <div className={styles.line}></div>
                        <img src={testImage} alt="" className={styles.agentImage} />
                        <span className={styles.agentName}>Jane Doe</span>
                    </div>
                </div>
            </>}
        </div>
    );
}

export default HomeDetails;
