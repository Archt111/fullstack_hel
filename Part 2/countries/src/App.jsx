import {useState, useEffect} from "react";
import talk from './services/server.jsx'
import {DisplayCountry,Display} from './components/display.jsx'

const App = () => {
  const [all, setAll] = useState([])
  const [foundList, setFound] = useState([])
  const [shownCountry, setCountry] = useState(null)
  const [buttonClicked, setClick] = useState(false)

  useEffect(() => {
    talk.load().then(clist => {
      setAll(clist)
      console.log(all)
    })}, [])

  useEffect(() => {
    console.log('list len, button status, showncountry', foundList.length,buttonClicked,shownCountry)
    if(foundList.length===1 || buttonClicked){
      console.log('list len, button status, showncountry', foundList.length,buttonClicked,shownCountry)
      talk.weatherGet(shownCountry.capital)
          .then(wInfo => {
            const changedC = { ...shownCountry}
            console.log('bf having weather:',shownCountry)
            changedC['weather'] = wInfo
            console.log('after having weather:',changedC)
            setCountry(changedC)
          })
    }
    setClick(false)
  }, [foundList,buttonClicked])

  const onSearch = (val) => {
    console.log(val)
    const filtered =all.filter(c => c.name.common.toLowerCase().includes(val.toLowerCase()))
    setFound(filtered)
    console.log('after filtered list', foundList)

    filtered.length === 1
      ? setCountry(filtered[0])
      : setCountry(null)
    }
    console.log(shownCountry)
  return (
    <div>
      <p>find countries<input type="text" onChange={event => onSearch(event.target.value)}/></p>
      <Display foundList={foundList} setCountry={setCountry} setClick={setClick}/>
      <DisplayCountry country={shownCountry}/>
    </div>
  )
}

export default App