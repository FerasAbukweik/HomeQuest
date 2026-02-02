import React from 'react';
import type { GuestPropertyCardResponseDTO } from '../../../interfaces/DTO/property/guest-property-card';
import { UrlUtils } from '../../../utils/url-utils';
import styles from './main-page-property-card.module.css'
import {useNavigate } from 'react-router';

type dataType = {
    data : GuestPropertyCardResponseDTO
}

export function MainPagePropertyCard({data} : dataType){
    const navigator = useNavigate()
    return(
    <div className={styles.card}>
        <div className={styles.cardHeader}>
            <img src={data.imageUrl} className={styles.cardImage}
             onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = UrlUtils.noImg;
                }}/>
        </div>

        <div className={styles.cardBody}>
            <span className={styles.price}>${data.price}</span>
            <span className={styles.location}>{data.title}</span>
        </div>

        <div className={styles.cardFooter}>
            <span className={styles.specs}>{data.address}</span>
        </div>

        <button className={styles.detailsBtn}
        onClick={()=>navigator(`/home-details/${data.id}`)}>View Details</button>
    </div>
    );
}

export default React.memo(MainPagePropertyCard);