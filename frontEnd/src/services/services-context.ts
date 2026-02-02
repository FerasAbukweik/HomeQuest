import { createContext } from "react";
import type IPropertiesServices from "./properties-services/properties-services-interface";

export type servicesObject = {
    propertiesServices : IPropertiesServices
}

export const servicesContext = createContext<servicesObject | undefined>(undefined);