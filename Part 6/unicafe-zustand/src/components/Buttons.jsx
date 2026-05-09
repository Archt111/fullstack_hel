import { useFeedbackActions } from '../store'

const Button = ({onClick, text}) => (
    <button onClick={onClick}> {text}</button>
)

const Buttons = () => {
  const { incrementGood, incrementNeutral, incrementBad, reset } = useFeedbackActions()

  return (
      <div>
        <h1>{'give feedback'}</h1>
        <Button onClick={incrementGood} text='good'/>
        <Button onClick={incrementNeutral} text={'neutral'}/>
        <Button onClick={incrementBad} text={'bad'}/>
        <Button onClick={reset} text={'reset statistics'}/>
      </div>
  )
}

export default Buttons
