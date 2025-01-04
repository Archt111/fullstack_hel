export const Filter = ({v, onChange}) => {
  return <p>filter shown with <input value={v} onChange={(event) => onChange(event.target.value)}/></p>
}