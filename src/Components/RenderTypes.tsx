import React from 'react'
import { NormalizedItems } from '../generateItems'
import ListItem from './ListItem'

export type RenderType = 'Stupid' | 'Classic' | 'FlexOrder'

type RenderTypesMap = {
  [name in RenderType]: (
    orderMap: { [id: string]: number },
    orderList: string[],
    items: NormalizedItems,
    onRenderItem: () => void
  ) => JSX.Element
}

const RenderTypes: RenderTypesMap = {
  Stupid: (_orderMap, orderList, items, onRenderItem) => (
    <ul className="list-wrap">
      {orderList.map((id, index) => (
        <li key={index}>
          <ListItem item={items[id]} onRender={onRenderItem} />
        </li>
      ))}
    </ul>
  ),

  Classic: (_orderMap, orderList, items, onRenderItem) => (
    <ul className="list-wrap">
      {orderList.map(id => (
        <li key={id}>
          <ListItem item={items[id]} onRender={onRenderItem} />
        </li>
      ))}
    </ul>
  ),

  FlexOrder: (orderMap, _orderList, items, onRenderItem) => (
    <ul className="list-wrap flex">
      {Object.keys(items).map(id => (
        <li key={id} style={{ order: orderMap[id] }}>
          <ListItem item={items[id]} onRender={onRenderItem} />
        </li>
      ))}
    </ul>
  ),
}

export default RenderTypes
