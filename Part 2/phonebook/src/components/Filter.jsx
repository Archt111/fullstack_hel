export const Filter = ({v, handleUpdate}) => {
  return <p>filter shown with <input value={v} onChange={(event) => handleUpdate(event.target.value)}/></p>
}