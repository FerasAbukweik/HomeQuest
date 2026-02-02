import styles from './user-property-card.module.css'
import testImg from '../../../../../../../assets/images/main-header-image.png'
import type { UserPropertyCardResposeDTO } from '../../../../../../../interfaces/DTO/property/user-property-card';
import { useNavigate } from 'react-router';
import Api from '../../../../../../../services/api/api';
import axios from 'axios';
import React, { useMemo } from 'react';
import { EnumUtils } from '../../../../../../../utils/EnumUtils';
import { PropertyStateEnum, PropertyStateList } from '../../../../../../../enums/property-state-enum';

type dataType = {
    data : UserPropertyCardResposeDTO
    reRender? : ()=>void
}


function UserPropertyCard({ data , reRender }: dataType) {
    const navigate = useNavigate();
    const isActive = useMemo(
        () => EnumUtils.isSelected(data.state, PropertyStateEnum.active),
        [data.state]
    );

    const toggleActive = async () => {
        if(EnumUtils.isSelected(data.state , PropertyStateEnum.pending)) return;

        let newState = data.state;
        if(isActive) newState -= PropertyStateEnum.active;
        else newState += PropertyStateEnum.active;

        try {
            await Api.put(`/PropertysListings/toggleState/${data.id}`, {
                newState: newState
            });
            
            if(reRender) reRender();
        } catch (error) {
            if (axios.isAxiosError(error))
                console.error(error.response?.data ?? "Unexpected error");
            else
                console.error(error);
        }
    };

    return (
        <div className={`${styles.houseListingContainer} globalHouseListingContainer`}>
            <div className={styles.header}>
                <img src={testImg} alt="" className={styles.propertyImage} />
                <div className={`${styles.state} ${!isActive && styles.notActive}`}>
                    {
                        useMemo(()=>
                            PropertyStateList.find((obj)=>EnumUtils.isSelected(data.state , obj.val))?.type ?? "Not Active" ,
                            [data.state])
                    }
                </div>
            </div>

            <div className={styles.body}>
                <span className={styles.areaText}>{data.address}</span>
                <span className={styles.price}>${data.price}</span>
            </div>

            <div className={styles.footer}>
                <button className={styles.editBtn}>
                    <i className={`${styles.editIcon} fa-solid fa-pencil`} />
                    <span>Edit</span>
                </button>

                <button
                    className={styles.viewBtn}
                    onClick={() => navigate(`/home-details/${data.id}`)}
                >
                    <i className={`${styles.viewIcon} fa-regular fa-eye`} />
                    <span>View</span>
                </button>

                <input
                    type="checkbox"
                    className={`${styles.isActive} smallSwitch`}
                    defaultChecked={isActive}
                    onChange={toggleActive}
                />
            </div>
        </div>
    );
}


export default React.memo(UserPropertyCard);