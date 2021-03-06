import * as React from 'react'
import { RenderType } from './RenderTypes'
export interface StatsProps {
  type?: RenderType
  startTime?: number
  finishTime?: number
  FPS?: number
  shuffles?: number
  mutations: {
    attributes?: number
    childList?: number
    characterData?: number
  }
  render: {
    list?: number
    child?: number
  }
}

const asTable = ({ type, FPS, shuffles, mutations, render }: StatsProps) => ({
  type,
  FPS,
  shuffles,
  'mutations.attributes': mutations.attributes || 0,
  'mutations.childList': mutations.childList || 0,
  'mutations.characterData': mutations.characterData || 0,
  'render.list': render.list || 0,
  'render.child': render.child || 0,
})

class Stats extends React.PureComponent<{
  stats: StatsProps
}> {
  render() {
    const stats = this.props.stats
    return (
      <fieldset>
        <legend>Stats</legend>
        <div>
          <label htmlFor="Shuffles">Shuffles:</label>
          <input
            type="text"
            readOnly={true}
            name="Shuffles"
            id="Shuffles"
            value={stats.shuffles || 0}
          />
        </div>
        <div>
          <label htmlFor="FPS">Frame Rate:</label>
          <input
            type="text"
            readOnly={true}
            name="FPS"
            id="FPS"
            value={stats.FPS || ''}
          />
        </div>
        <h4>Mutations</h4>
        <div>
          <label htmlFor="Attributes">Attributes:</label>
          <input
            type="text"
            readOnly={true}
            name="Attributes"
            id="Attributes"
            value={stats.mutations.attributes || 0}
          />
        </div>
        <div>
          <label htmlFor="ChildList">ChildList:</label>
          <input
            type="text"
            readOnly={true}
            name="ChildList"
            id="ChildList"
            value={stats.mutations.childList || 0}
          />
        </div>
        <div>
          <label htmlFor="CharacterData">CharacterData:</label>
          <input
            type="text"
            readOnly={true}
            name="CharacterData"
            id="CharacterData"
            value={stats.mutations.characterData || 0}
          />
        </div>

        <h4>Render Calls</h4>
        <div>
          <label htmlFor="List">List:</label>
          <input
            type="text"
            readOnly={true}
            name="List"
            id="List"
            value={stats.render.list || 0}
          />
        </div>
        <div>
          <label htmlFor="ChildList">Child:</label>
          <input
            type="text"
            readOnly={true}
            name="Child"
            id="Child"
            value={stats.render.child || 0}
          />
        </div>
        <div className="footer">
          <button onClick={() => console.table(asTable(stats))}>
            Save Stats
          </button>
        </div>
      </fieldset>
    )
  }
}

export default Stats
