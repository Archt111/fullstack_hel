import { useAnecdoteFilter, useAnecdoteActions } from '../store'

const Filter = () => {
  const filter = useAnecdoteFilter()
  const { setFilter } = useAnecdoteActions()
  console.log('[Filter] render; current filter =', `"${filter}"`)

  const handleChange = (event) => {
    const value = event.target.value
    console.log('[Filter.handleChange] input changed to:', `"${value}"`)
    setFilter(value)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input value={filter} onChange={handleChange} />
    </div>
  )
}

export default Filter
