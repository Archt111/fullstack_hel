import { useGood, useNeutral, useBad } from '../store'

const StatisticLine = (props) => {
  return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value} {props.something}</td>
      </tr>
  )
}

const Statistics = () => {
  const goods = useGood()
  const neutrals = useNeutral()
  const bads = useBad()
  const g_score = 1
  const n_score = 0
  const b_score = -1
  const all = goods + neutrals + bads
  if (all === 0) {
    return (<div>No feedback given</div>)
  }return (
      <>
        <h1>{'statistics'}</h1>
        <table>
          <tbody>
            <StatisticLine text='good' value={goods}/>
            <StatisticLine text='neutral' value={neutrals}/>
            <StatisticLine text='bad' value={bads}/>
            <StatisticLine text={'all'} value={all}/>
            <StatisticLine text={'average'} value={(goods * g_score + neutrals * n_score + bads * b_score) / all}/>
            <StatisticLine text={'positive'} value={goods * 100 / all} something={'%'}/>
          </tbody>
        </table>
      </>
  )
}

export default Statistics
