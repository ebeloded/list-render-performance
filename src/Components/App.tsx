import React from 'react'
import { knuthShuffle as shuffle } from 'knuth-shuffle'
import { Item, NormalizedItems } from '../generateItems'
import Stats, { StatsProps } from './Stats'
import RenderTypes, { RenderType } from './RenderTypes'
import List from './List'

interface Props {
  items: NormalizedItems
}

interface State {
  // we need both list and map to make the difficulty of list rendering identical
  orderMap: { [id: string]: number }
  orderList: string[]
  numberOfShuffles: number
  renderType?: RenderType
  stats: StatsProps
  experimentState?: 'READY' | 'IN_PROGRESS' | 'FINISHED'
}

const getMapFromList = (list: string[]): { [key: string]: number } =>
  list.reduce((v, c, i) => ({ ...v, [c]: i }), {})

const getCleanStats = (): StatsProps => ({
  mutations: {},
  render: {},
})

const addOne = (v?: number): number => (v ? v + 1 : 1)

const EXPERIMENT_DURATION = 5000

export default class App extends React.PureComponent<Props, State> {
  observer?: MutationObserver
  experimentContainer: React.RefObject<HTMLDivElement>

  renderCalls: { child?: number; list?: number } = {}

  constructor(props: Props) {
    super(props)
    const orderList = Object.keys(props.items)

    this.state = {
      orderList,
      orderMap: getMapFromList(orderList),
      numberOfShuffles: 10,
      stats: getCleanStats(),
    }

    this.experimentContainer = React.createRef()
  }

  shuffleCollection = (cb: () => void) => {
    this.setState(prevState => {
      const orderList = [...shuffle(prevState.orderList)]
      return {
        orderList,
        orderMap: getMapFromList(orderList),
        stats: {
          ...prevState.stats,
          render: { ...this.renderCalls },
          shuffles: addOne(prevState.stats.shuffles),
        },
      }
    }, cb)
  }

  doShuffling = () => {
    if (performance.now() < this.state.stats.finishTime!) {
      this.shuffleCollection(() => {
        window.setTimeout(() => {
          this.doShuffling()
        }, 0)
      })
    } else {
      this.finishExperiment()
    }
  }

  startMutationsObservations = () => {
    this.observer = new MutationObserver(mutationsList => {
      this.setState(({ stats }) => {
        const mutations = { ...stats.mutations }

        mutationsList.forEach(({ type }) => {
          switch (type) {
            case 'attributes':
              mutations.attributes = addOne(mutations.attributes)
              break
            case 'characterData':
              mutations.characterData = addOne(mutations.characterData)
              break
            case 'childList':
              mutations.childList = addOne(mutations.childList)
              break
          }
        })
        return {
          stats: {
            ...stats,
            mutations,
          },
        }
      })
    })

    this.observer.observe(this.experimentContainer.current!, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
  }

  stopMutationsObservations = () => {
    this.observer && this.observer.disconnect()
  }

  startFrameRateObservations = () => {
    let frames = 0

    const refreshLoop = () => {
      window.requestAnimationFrame(() => {
        if (this.state.experimentState === 'IN_PROGRESS') {
          frames++
          this.setState(({ stats }) => ({
            stats: {
              ...stats,
              FPS: Math.round(
                (frames * 1000) / (performance.now() - stats.startTime!)
              ),
            },
          }))
          refreshLoop()
        }
      })
    }
    refreshLoop()
  }

  onRenderItem = () => {
    this.renderCalls.child = addOne(this.renderCalls.child)
  }

  onRenderList = () => {
    this.renderCalls.list = addOne(this.renderCalls.list)
  }

  startExperiment = () => {
    const startTime = performance.now()
    this.renderCalls = {}

    this.setState(
      {
        experimentState: 'IN_PROGRESS',
        stats: {
          ...getCleanStats(),
          startTime,
          finishTime: startTime + EXPERIMENT_DURATION,
          type: this.state.renderType,
        },
      },
      () => {
        // start observing DOM changes
        this.startMutationsObservations()
        // start observing Frame Rate
        this.startFrameRateObservations()
        // start shuffling
        this.doShuffling()
      }
    )
  }

  finishExperiment = () => {
    this.setState({
      experimentState: 'FINISHED',
    })
    this.stopMutationsObservations()
  }

  handleFormSetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      renderType: e.target.value as RenderType,
      experimentState: 'READY',
    })
  }

  renderExperiment = (renderType: RenderType) => {
    return (
      <List
        type={renderType}
        items={this.props.items}
        orderMap={this.state.orderMap}
        orderList={this.state.orderList}
        onRenderItem={this.onRenderItem}
        onRenderList={this.onRenderList}
      />
    )
  }

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
            <button
              style={{ float: 'right' }}
              onClick={this.startExperiment}
              disabled={
                this.state.experimentState !== 'READY' &&
                this.state.experimentState !== 'FINISHED'
              }
            >
              Start Experiment
            </button>
          </fieldset>
          <div className="experiment-container" ref={this.experimentContainer}>
            {this.state.renderType &&
              this.renderExperiment(this.state.renderType)}
          </div>
        </div>
        <div className="stats">
          <Stats stats={this.state.stats} />
        </div>
      </div>
    )
  }
}
