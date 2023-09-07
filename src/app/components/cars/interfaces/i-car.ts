export interface ICar {
  id: number,
  modelId: number,
  price: {
    pricePerDay: number,
    pricePerMonth: number,
  },
  categoryId: number,
  carSpecifications: number[],
  description: string,
  additionalEquipment: [
    {
      id: number,
      name: string
    }
  ],
  image: string

}
