import type { PropertyStateEnum } from "../../../enums/property-state-enum";
import type { GuestPropertyCardResponseDTO } from "./guest-property-card";

export interface UserPropertyCardResposeDTO extends GuestPropertyCardResponseDTO{
    state : PropertyStateEnum
}