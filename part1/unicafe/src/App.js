import React, { useState } from 'react'

const Button = (props) => {
  return (
    <>
      <button onClick={props.onClick}>
        {props.text}
      </button>
    </>
  )
}

const Statistic = (props) => {
  return (
    <>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    </>
  )
}

const Statistics = (props) => {
  if ( props.good === 0 && props.neutral === 0 && props.bad === 0 ) {
    return (
      <>
        <p>No feedback given</p>  
      </>
    )
  } else {
    return (
      <>
        <table>
          <tbody>
            <Statistic text="good" value ={props.good}/>
            <Statistic text="neutral" value ={props.neutral}/>
            <Statistic text="bad" value ={props.bad}/>
            <Statistic text="all" value ={props.good + props.neutral + props.bad}/>
            <Statistic text="average" value ={(props.good - props.bad)/(props.good + props.neutral + props.bad)}/>
            <Statistic text="positive" value ={(((props.good)/(props.good + props.neutral + props.bad))*100)+"%"}/>
          </tbody>
        </table>
      </>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={() => setGood(good + 1)}/>
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)}/>
      <Button text="bad" onClick={() => setBad(bad + 1)}/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App