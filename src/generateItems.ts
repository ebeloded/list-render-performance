import Chance from 'chance'
const chance = new Chance()

export interface Item {
  index: number
  id: string
  name: string
  origin: string
  destination: string
  date: string
}

export type NormalizedItems = Readonly<{ [name: string]: Item }>

export default function generateItems(n: number): NormalizedItems {
  const items: { [name: string]: Item } = {}
  let id
  for (let index = 0; index < n; index++) {
    id = chance.guid()
    items[id] = {
      index,
      id,
      name: chance.name(),
      origin: chance.city(),
      destination: chance.city(),
      date: chance.date().toDateString(),
    }
  }
  return items
}
