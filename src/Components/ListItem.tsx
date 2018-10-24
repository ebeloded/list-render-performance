import * as React from 'react'
import { Item } from '../generateItems'

import './ListItem.scss'

interface Props {
  item: Item
}

export default class ListItemClass extends React.PureComponent<Props> {
  render() {
    const { id, name, index, origin, destination, date } = this.props.item
    console.log('render list item in class')
    return (
      <div id={id} className="list-item">
        <img
          className="ava"
          src={`https://robohash.org/robo_${index}.png?size=66x66&bgset=bg1`}
        />
        <div>
          <span className="name">{name}</span>
          <div className="travel">
            <span>
              From <b>{origin}</b>
            </span>
            <span>
              To: <b>{destination}</b>
            </span>
          </div>
          <div>
            Date of Travel: <i>{date}</i>
          </div>
          <span className="index">{index}</span>
        </div>
      </div>
    )
  }
}
