const Header = ({course}) => <h1>{course}</h1>
const Part = ({part}) => <p>{part.name} {part.exercises}</p>
const Content = ({parts}) => {
    return (
    <>
        {parts.map((part) => (<Part key={part.id} part={part} />))}
    </>)
}
const Total = ({parts}) => {
    const sum = parts.reduce((s,part) => s+part.exercises,0)
    return <p><b>total of {sum} exercises</b></p>
}

const OneCourse = ({course}) => {
    return (
        <>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts}/>
        </>
    )
}
const Course = ({courses}) => {
    return (
        <div>
            {courses.map((course) => (<OneCourse key={course.id} course={course}/>))}
        </div>)
}
export default Course