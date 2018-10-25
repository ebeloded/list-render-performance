import * as React from 'react'
import RenderTypes, { RenderType } from './RenderTypes'
import { NormalizedItems } from '../generateItems'

interface ListProps {
  type: RenderType
  orderMap: { [id: string]: number }
  orderList: string[]
  items: NormalizedItems
  onRenderList: () => void
  onRenderItem: () => void
}

export default class List extends React.PureComponent<ListProps> {
  render() {
    const {
      orderMap,
      orderList,
      items,
      onRenderList,
      onRenderItem,
    } = this.props
    onRenderList()
    return RenderTypes[this.props.type](
      orderMap,
      orderList,
      items,
      onRenderItem
    )
  }
}
