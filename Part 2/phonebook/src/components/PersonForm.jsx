export const PersonForm = ({name, phone, addB, onChangeN, onChangeP}) => {
  return (
    <form onSubmit={addB}>
      <div>name: <input value={name} onChange={(event) => onChangeN(event.target.value)}/></div>
      <div>number: <input value={phone} onChange={(event) => onChangeP(event.target.value)}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}