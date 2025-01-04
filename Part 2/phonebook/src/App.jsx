import {useState, useEffect} from 'react';
import {Filter} from "./components/Filter.jsx";
import {Persons} from "./components/Persons.jsx";
import {PersonForm} from "./components/PersonForm.jsx";
import servertalk from './services/server.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newFilter, setNewFilter] = useState('')
  useEffect (() => {
    console.log('effect')
    servertalk
      .load()
      .then(initPersons => setPersons(initPersons))
  }, [])

  const addPerson = (newName) => {
    const newPerson = {name: newName, number:newPhone, id:persons.length+1}
    servertalk
      .create(newPerson)
      .then(p => {
        setPersons(persons.concat(p))
        setNewName('')
        setNewPhone('')
        console.log('server after adding person:', p)
      })

  }
  /*const addNew = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const existName = persons.filter(p => p.name === newName)
    existName.length > 0 ? alert(newName + ' is already added to phonebook') :addPerson(newName)
  }*/

  const addButton = (event) => {
    event.preventDefault()

    const existP= persons.find(p => p.name === newName)
    console.log('what existP is', existP)
    if (existP) {
      if (existP.number!==newPhone){
        if (window.confirm(`${existP.name} is already added to phonebook, replace the old number with a new one?`)) {
          const changedN = {...existP, number: newPhone}
          console.log('what returnedP is', changedN)
          servertalk.updatePhone(existP.id,changedN)
            .then(returnedP => {
              console.log('what returnedP is', returnedP)
              setPersons(persons.map(p => (p.id === existP.id ? returnedP : p)))
              }
            )
            }
      }
      else {alert(newName + ' with such number is already added to phonebook')}
    }
    else {addPerson(newName)}
  }

  const delButton = id => {
    const exist = persons.find(p => p.id===id)
    if (window.confirm(`Delete ${exist.name} ?`)){
      servertalk
      .deleteP(id)
      .then(() => {setPersons(persons.filter(p => p.id !== id))})
      .catch(e => {console.log('person is not in phonebook or',e)})
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter v={newFilter} onChange={setNewFilter}/>
      <h3>Add a new</h3>
      <PersonForm name={newName} phone={newPhone} addB={addButton} onChangeN={setNewName} onChangeP={setNewPhone}/>
      <h3>Numbers</h3>
      <Persons val={newFilter} plist={persons} delButton={delButton}/>
    </div>
  )
}

export default App
