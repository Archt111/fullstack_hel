import {useState, useEffect} from 'react';
import {Filter} from "./components/Filter.jsx";
import {Persons} from "./components/Persons.jsx";
import {PersonForm} from "./components/PersonForm.jsx";
import './index.css'
import servertalk from './services/server.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newMessage, setMessage] = useState({ text: null, type: null })

  const Notification = ({mes}) => {
    if (mes.text === null) {
      return null
    }
    setTimeout(() => setMessage({text: null, type: null }), 3000)
    return <div className={mes.type}>{mes.text}</div>
  }

  const resetForm = () => {
    setNewName('')
    setNewPhone('')
  }

  useEffect(() => {
    servertalk.load().then(initPersons => setPersons(initPersons))
  }, [])

  const addPerson = (newName) => {
    const newPerson = {name: newName, number: newPhone }
    servertalk
      .create(newPerson)
      .then(p => {
        setPersons(persons.concat(p))
        resetForm()
        setMessage({text: `Added ${p.name}`, type: 'success' })
      })
      .catch(error => {
        setMessage({text: `Failed to add ${newName}: ${error.message}`, type: 'error' })
      })
  }

  const addButton = (event) => {
    event.preventDefault()

    const existP = persons.find(p => p.name === newName)
    if (existP) {
      if (existP.number !== newPhone) {
        if (window.confirm(`${existP.name} is already added to phonebook, replace the old number with a new one?`)) {
          const changedN = { ...existP, number: newPhone }

          servertalk
            .updatePhone(existP.id, changedN)
            .then(returnedP => {
              setPersons(persons.map(p => (p.id === existP.id ? returnedP : p)))
              resetForm()
              setMessage({text: `Changed phone of ${existP.name}`, type: 'success' })
            })
            .catch(error => {
              setMessage({text: `Failed to update ${existP.name}: ${error.message}`, type: 'error' })
              setPersons(persons.filter(p => p.id !== existP.id))
              resetForm()
            })
        }
      } else {
        setMessage({text: `${newName} with such number is already added to phonebook`,type:'error'})
        resetForm()
      }
    } else {
      addPerson(newName)
    }
  }

  const delButton = id => {
    const exist = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${exist.name}?`)) {
      servertalk
        .deleteP(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setMessage({text: `Deleted ${exist.name}`, type: 'success' })
        })
        .catch(error => {
          setMessage({text: `Failed to delete ${exist.name}: ${error.message}`, type: 'error' })
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification mes={newMessage} />
      <Filter v={newFilter} onChange={setNewFilter} />
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
