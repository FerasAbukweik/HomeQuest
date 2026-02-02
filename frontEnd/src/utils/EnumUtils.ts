export class EnumUtils{
    static isSelected (allSelected : number , toCheck : number) : boolean{
        return (allSelected & toCheck) === toCheck;
    }
}