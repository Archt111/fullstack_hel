export const Persons = ({ plist, val, delButton }) => {
  const flist = plist.filter(p => p.name.toLowerCase().includes(val.toLowerCase()));
  return flist.map(p => (
    <div key={p.id}>
      <p>
        {p.name} {p.number}
        <button type="submit" onClick={() => delButton(p.id)}>delete</button>
      </p>
    </div>
  ));
};