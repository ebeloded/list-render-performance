import React from 'react'
import { knuthShuffle as shuffle } from 'knuth-shuffle'
import ListItem from './ListItem'
import { Item, NormalizedItems } from '../generateItems'

interface Props {
  items: NormalizedItems
}

type RenderType = 'Stupid' | 'Classic' | 'FlexOrder'

interface State {
  // we need both list and map to make the difficulty of list rendering identical
  orderMap: { [id: string]: number }
  orderList: string[]
  numberOfShuffles: number
  renderType?: RenderType
}

const RenderTypes: {
  [name in RenderType]: (
    orderMap: { [id: string]: number },
    orderList: string[],
    items: NormalizedItems
  ) => JSX.Element
} = {
  Stupid: (_orderMap, orderList, items) => (
    <ul className="list-wrap">
      {orderList.map((id, index) => (
        <li key={index}>
          <ListItem item={items[id]} />
        </li>
      ))}
    </ul>
  ),

  Classic: (orderMap, orderList, items) => (
    <ul className="list-wrap">
      {orderList.map(id => (
        <li key={id}>
          <ListItem item={items[id]} />
        </li>
      ))}
    </ul>
  ),

  FlexOrder: (orderMap, orderList, items) => (
    <ul className="list-wrap flex">
      {Object.keys(items).map(id => (
        <li key={id} style={{ order: orderMap[id] }}>
          <ListItem item={items[id]} />
        </li>
      ))}
    </ul>
  ),
}

export default class App extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    const orderList = Object.keys(props.items)
    this.state = {
      orderList,
      orderMap: orderList.reduce((v, c, i) => ({ ...v, [c]: i }), {}),
      numberOfShuffles: 10,
      renderType: 'Stupid',
    }
    console.log(this.state)
  }

  updateNumberOfShuffles = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      numberOfShuffles: Number(target.value),
    })
  }

  shuffle = () => {
    this.setState(prevState => {
      const orderList = [...shuffle(prevState.orderList)]

      return {
        orderList,
        orderMap: orderList.reduce((v, c, i) => ({ ...v, [c]: i }), {}),
      }
    })
  }

  handleFormSetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      renderType: e.target.value as RenderType,
    })
  }

  renderExperiment = (renderType: RenderType) =>
    RenderTypes[renderType](
      this.state.orderMap,
      this.state.orderList,
      this.props.items
    )

  render() {
    return (
      <div className="experiment-and-stats">
        <div className="experiment">
          <fieldset>
            <legend>List Render</legend>
            {Object.keys(RenderTypes).map(render_type => {
              return (
                <label key={render_type}>
                  <input
                    type="radio"
                    name="render_type"
                    id="render_type"
                    value={render_type}
                    onChange={this.handleFormSetChange}
                  />
                  {render_type}
                </label>
              )
            })}
            <button style={{ float: 'right' }} onClick={this.shuffle}>
              Shuffle
            </button>
          </fieldset>

          {this.state.renderType &&
            this.renderExperiment(this.state.renderType)}
        </div>
        <div className="stats">
          <fieldset>
            <legend>Stats</legend>
            <span className="loading">✈️</span>
          </fieldset>
        </div>
      </div>
    )
  }
}
