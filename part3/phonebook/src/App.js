import React, { useState, useEffect } from 'react'
import personService from './services/persons.js'

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Filter = ({filters, handleFiltersChange}) => {
  return (
    <>
      <div>
        filter shown with <input value={filters} onChange={handleFiltersChange}/>
      </div>
    </>
  )
}

const PersonForm = (props) => {
  return (
    <>
      <form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Persons = ({filterShow, removePerson}) => {
  return (
    <>
      {filterShow.map(person => <div key={person.name}>{person.name} {person.number} <button onClick={() => removePerson(person.name, person.id)}>delete</button></div>)}
    </>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filters, setFilters ] = useState('')
  const [ status, setStatus] = useState(false)
  const [ successMessage, setSuccessMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const current = persons.filter(person => person.name === newName);
    const newObject = { name: newName, number: newNumber }

    if(persons.some(person => person.name === newName)) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one`)) {
        personService
          .update(current[0].id, newObject)
          .then(response => {
            setPersons(persons.map(person => person.id !== current[0].id ? person : response.data))
            setNewName('')
            setNewNumber('')
            setTimeout(() => {
              alert(`Update ${current[0].name} success!`)
            }, 300)
           })
           .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== current[0].id));
            console.log(error.response.data)
          })
      }
    } else {
      personService
        .create(newObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${newName}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          console.log(error.response.data)
        })
    }
  }

  const removePerson = (name, id) => {
    if(window.confirm(`Delete ${name} ?`)){
      personService
       .remove(id)
       .then(response => {
         setPersons(persons.filter(person => person.id !== id))
         setTimeout(() => {
           alert(`Delete ${name} success!`)
         }, 300)
       })
       .catch(error => {
        setErrorMessage(`Information of ${name} has already been removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
       })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFiltersChange = (event) => {
    if(persons.some(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))) {
      setStatus(true)
    } else {
      setStatus(false)
    }

    console.log(event.target.value)
    setFilters(event.target.value)
  }

  const filterShow = status ? persons.filter(person => person.name.toLowerCase().includes(filters.toLowerCase())) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter filters={filters} handleFiltersChange={handleFiltersChange}/>
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons filterShow={filterShow} removePerson={removePerson}/>
    </div>
  )
}

export default App