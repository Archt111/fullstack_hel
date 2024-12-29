import { useState } from 'react'

const Button =({onClick, text}) => (
    <button onClick={onClick}> {text}</button>
)
// more stats
const StatisticLine = (props) => {
  console.log(props)
  return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value} {props.something}</td>
      </tr>
)
}
const Statistics = (props) => {
  console.log(props)
  const g_score = 1
  const n_score = 0
  const b_score = -1
  const all = props.goods+props.neutrals+props.bads
  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
      <>
        <table>
        <StatisticLine text="good" value={props.goods}/>
        <StatisticLine text="neutral" value={props.neutrals}/>
        <StatisticLine text="bad" value={props.bads}/>
        <StatisticLine text={'all'} value={all}/>
        <StatisticLine text={'average'}
                       value={(props.goods * g_score + props.neutrals * n_score + props.bads * b_score) / all}/>
        <StatisticLine text={'positive'} value={props.goods * 100 / all} something={'%'}/>
        </table>
      </>
  )
}

const App = () => {

  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
      <div>
        <h1>{'give feedback'}</h1>
        <Button onClick={() => setGood(good + 1)} text='good'/>
        <Button onClick={() => setNeutral(neutral + 1)} text={'neutral'}/>
        <Button onClick={() => setBad(bad + 1)} text={'bad'}/>

        <h1>{'statistics'}</h1>
        <Statistics goods={good} neutrals={neutral} bads={bad}/>
      </div>
  )
}
export default App