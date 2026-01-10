import {useState, useEffect} from 'react';
import {Filter} from "./components/Filter.jsx";
import {Persons} from "./components/Persons.jsx";
import {PersonForm} from "./components/PersonForm.jsx";
import './index.css'
import servertalk from './services/server.jsx'

const getError = (error) =>
  error.response.data.error || error.message || 'Unknown error'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newMessage, setMessage] = useState({ text: null, type: null })

  const Notification = ({mes}) => {
  if (!mes.text) return null// just make this more clean
  setTimeout(() => setMessage({text: null, type: null }), 3000)
  return <div className={mes.type}>{mes.text}</div>
  }

  const resetForm = () => {
    setNewName('')
    setNewPhone('')
  }

  // add error catching
  useEffect(() => {
    servertalk.load()
      .then(initPersons => setPersons(initPersons))
      .catch(err => {
        setMessage({ text: getError(err), type: 'error' })
        console.error(err)
      })
  }, [])

  // remove arg in old version because it's redundant
  const addPerson = () => {
    if (!newName || !newPhone){
      setMessage({ text: 'Need both name and phone to add.', type: 'error' })
      return
    }
    
    servertalk
      .create({name: newName, number: newPhone}) // Don't have to make the json entry, just dict. cool
      .then(p => {
        setPersons(persons.concat(p))
        resetForm()
        setMessage({text: `Added ${p.name}`, type: 'success' })
      })
      .catch(err => {
        // change the verbose I made to a more standard error print from server
        setMessage({text: getError(err), type: 'error' })
        console.error('create new entry fail',err)
        resetForm()
      })
  }

  const addButton = (event) => {
    event.preventDefault()

    const name = newName.trim()
    const number = newPhone.trim()
    console.log('on the front end:', { name: name, number: number })
    // before there are two nested if-else loops, this ver removes else for cleaner code
    const existP = persons.find(p => p.name === name)
    if (existP) {
      if (existP.number === number) {
        setMessage({ text: `${name} with such number is already added to phonebook`, type: 'error' })
        resetForm()
        return
      }

      if (!window.confirm(`${existP.name} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      
      const changedN = { ...existP, number: number } // cool syntax alert!!!
      servertalk
        .updatePhone(existP.id, changedN)
        .then(returnedP => {
          // persons => persons.map instead of persons.map directly to avoid
          setPersons(persons => persons.map(p => (p.id === existP.id ? returnedP : p)))
          resetForm()
          setMessage({text: `Changed phone of ${existP.name}`, type: 'success' })
        })
        .catch(error => {
          setMessage({text: `Failed to update ${existP.name}: ${getError(error)}`, type: 'error' })
          setPersons(persons => persons.filter(p => p.id !== existP.id))
          console.log(error)
          resetForm()
        })
      return // have to remember this!
    }
    addPerson()
  }

  const delButton = id => {
    const exist = persons.find(p => p.id === id)
    if (!exist || !window.confirm(`Delete ${exist.name}?`)) return
    
    servertalk
      .deleteP(id)
      .then(() => {
        setPersons(persons => persons.filter(p => p.id !== id))
        setMessage({text: `Deleted ${exist.name}`, type: 'success' })
      })
      .catch(error => {
          setMessage({ text: getError(error), type: 'error' })
          console.error(error)
        })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification mes={newMessage} />
      <Filter v={newFilter} handleUpdate={setNewFilter} />
      <h3>Add a new</h3>
      <PersonForm
        name={newName}
        phone={newPhone}
        addB={addButton}
        onChangeN={setNewName}
        onChangeP={setNewPhone}
      />
      <h3>Numbers</h3>
      <Persons val={newFilter} plist={persons} delButton={delButton} />
    </div>
  )
}

export default App
