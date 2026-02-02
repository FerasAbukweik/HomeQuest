import styles from "./add-new-listing.module.css"
import uploadImg from '../../../../../../assets/images/upload-file-image.png'
import type AddPropertyRequestDTO from "../../../../../../interfaces/DTO/property/add-property";
import { useState } from "react";
import Api from "../../../../../../services/api/api";
import axios from "axios";
import { PropertyStateList } from "../../../../../../enums/property-state-enum";
import { PropertyTypesList } from "../../../../../../enums/property-types-enum";

export default function AddNewListing(){

    const [isAdded , setIsAdded] = useState<boolean>(false);

    const [form, setForm] = useState<AddPropertyRequestDTO>({
        title: "",
        address: "",
        description: "",
        price: 0,
        propertyState: 0,
        propertyType: 0,
        imageUrls: []
    });

    const [errors, setErrors] = useState({
        title: "",
        address: "",
        price: "",
        description: "",
    });

    const validation = {
        title: (v: string) => v.slice() ? "" : "Title is required",
        address: (v: string) => v.slice() ? "" : "Address is required",
        price: (v: number) => v > 0 ?
        (v > 999999999 ? "Price can'nt be larger than 99999999" : "") :
        "Price must be greater than 0",
        description: (v: string) => v.slice() ? "" : "Description is required"
    };

    function updateField(field: keyof AddPropertyRequestDTO, value: string | number) {
        setForm(curr => ({ ...curr, [field]: value }));
        if (field in validation) {
            checkValidation(field as keyof typeof validation, value);
        }
    }

    function checkValidation(field: keyof typeof validation, value?: string | number) {
        const val = value ?? form[field];
        const error = validation[field](val as never);
        setErrors(curr => ({ ...curr, [field]: error }));
    }

    async function handleSubmit() {

        const newErrors = {
            title: validation.title(form.title),
            address: validation.address(form.address),
            price: validation.price(form.price),
            description: validation.description(form.description),
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(e => e)) return;

        try {
            await Api.post("PropertysListings/Add", form);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 800);
        }
        catch (error: unknown) {
            if (axios.isAxiosError(error))
                console.error(`axios Error: ${error.response?.data?.message ?? "Unknown Error"}`)
            else
                console.error(error);
        }
    }

    return(
        <article className={`${styles.mainContianer} globalAddNewListing`}>
            <div className={styles.header}>
                <div className={styles.column}>
                    <span className={styles.addPropertyText}>Add New Property Listing</span>
                    <span className={styles.subText}>
                        Fill in the details below to add new property to your listing
                    </span>
                </div>

                <button
                    type="button"
                    className={`${styles.addBtn} greenBtn`}
                    onClick={handleSubmit}
                >
                    <i className={`${styles.plusIcon} fa-solid fa-plus`}></i>
                    <span className={styles.addText}>Add New Listing</span>
                </button>
            </div>

            <div className={styles.body}>
                <div className={`defaultContainer ${styles.topContainer}`}>
                    <span className={`${styles.propertyDetailstext} topText`}>
                        Property Details
                    </span>

                    <div className={styles.upperRow}>
                        <div className={`title_input ${styles.titleInput}`}>
                            <span className="title">Title</span>
                            <input
                                type="text"
                                placeholder="Title"
                                value={form.title}
                                onChange={e => updateField("title", e.target.value)}
                                onBlur={() => checkValidation("title")}
                                className={errors.title ? "redInputBorder" : ""}
                            />
                            {errors.title && <span className="wrong-input">* {errors.title}</span>}
                        </div>
                    </div>

                    <div className={styles.lowerRow}>
                        <div className="title_input">
                            <span className="title">Address</span>
                            <input
                                type="text"
                                placeholder="e.g., 123 Maple Street, Springfield, IL"
                                value={form.address}
                                onChange={e => updateField("address", e.target.value)}
                                onBlur={() => checkValidation("address")}
                                className={errors.address ? "redInputBorder" : ""}
                            />
                            {errors.address && <span className="wrong-input">* {errors.address}</span>}
                        </div>

                        <div className="title_input">
                            <span className="title">Price</span>
                            <input
                                type="text"
                                placeholder="$ e.g., 350000"
                                value={form.price || ""}
                                onChange={e => updateField("price", Number(e.target.value))}
                                onBlur={() => checkValidation("price")}
                                className={errors.price ? "redInputBorder" : ""}
                            />
                            {errors.price && <span className="wrong-input">* {errors.price}</span>}
                        </div>

                        <div className="title_input">
                            <label className="title">Property State</label>
                            <select
                                className={`selectedInput ${styles.selectHoustType}`}
                                value={form.propertyState}
                                onChange={e => updateField("propertyState", Number(e.target.value))}>
                                    {
                                        PropertyStateList.map(({type , val} , idx)=>{
                                            if(val === 4 || val === 8 || val === 16 || val === 32) return;
                                            return <option key={`PropertyState-${idx}`} value={val}>{type}</option>
                                        })
                                    }
                            </select>
                        </div>

                        <div className="title_input">
                            <label className="title">Property Type</label>
                            <select
                                className={`selectedInput ${styles.selectHoustType}`}
                                value={form.propertyType}
                                onChange={e => updateField("propertyType", Number(e.target.value))}>
                                {
                                    PropertyTypesList.map(({type , val} , idx)=>
                                        <option key={`PropertyType-${idx}`} value={val}>{type}</option>
                                )
                                }
                            </select>
                        </div>
                    </div>

                    <div className="title_input">
                        <span className="title">Description</span>
                        <textarea
                            className={`defaultTextArea ${errors.description ? "redInputBorder" : ""}`}
                            placeholder="Descripe the property"
                            value={form.description}
                            onChange={e => updateField("description", e.target.value)}
                            onBlur={() => checkValidation("description")}
                        />
                        {errors.description && (
                            <span className="wrong-input">* {errors.description}</span>
                        )}
                    </div>
                </div>

                <div className={`defaultContainer ${styles.bottomContainer}`}>
                    <span className="topText">Upload Images</span>
                    <div className={styles.dragAndDropArea}>
                        <img src={uploadImg} alt="" className={styles.uploadImg} />
                        <input type="file" accept="image/*" className={styles.uploadAFile} id="upload"/>
                        <div className={styles.uploadLabel}>
                            <label className={styles.uploadText} htmlFor="upload">Upload a file</label>
                            <span className={styles.uploadAFileText}>
                                or drag and drop PNG, JPG, GIF up to 10MB
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {isAdded && (
                <div className={`${styles.Added} defaultContainer`}>
                    Added
                </div>
            )}
        </article>
    );
}
