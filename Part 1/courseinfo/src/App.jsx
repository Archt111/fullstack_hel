const Header = (props) => {
    console.log(props)
    return (
        <>
            <h1>{props.name}</h1>
        </>)
}
const Part = (props) => {
    console.log(props)
    return (
        <p>
            {props.name} {props.exercises}
        </p>
    )
}
const Content = (props) => {
    console.log(props)
    return (
        <>
        <Part name={props.parts[0].name} exercises={props.parts[0].exercises} />
            <Part name={props.parts[1].name} exercises={props.parts[1].exercises} />
            <Part name={props.parts[2].name} exercises={props.parts[2].exercises} />
        </>)
}

const Total = (props) => {
    console.log(props)
    return (
        <>
        <p>Number of exercises {props.n[0].exercises + props.n[1].exercises + props.n[2].exercises}</p>
        </>)
}
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header name={course.name} />
        <Content parts={course.parts} />
      <Total n={course.parts}/>
    </div>
  )
}

export default App