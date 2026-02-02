export default interface AddPropertyRequestDTO{
    title: string,
    description : string,
    address: string,
    imageUrls : string[],
    price: number,
    propertyType: number,
    propertyState: number
}