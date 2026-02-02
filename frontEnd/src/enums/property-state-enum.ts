export enum PropertyStateEnum
{
    ForSale = 1,
    ForRent = 2,
    Sold = 4,
    Rejected = 8,
    pending = 16,
    active = 32
}; 



export const PropertyStateList = [
  { type: "For Sale", val: 1 },
  { type: "For Rent", val: 2 },
  { type: "Sold", val: 4 },
  { type: "Rejected", val: 8 },
  { type: "Pending", val: 16},
  { type: "Active", val: 32}
];