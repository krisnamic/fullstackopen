import React from 'react';
import ReactDOM from 'react-dom';
import courses from './Course.js';

const Header = ({ course }) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Total = ({ course }) => {
  const total = course.parts.reduce((s, p) => s + p.exercises, 0)
  return(
    <p><strong>total of {total} exercises</strong></p>
  ) 
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>    
  )
}

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map(data => (
        <div key={data.id}>
          <Part part={data}/>
        </div>
      ))}
    </div>
  )
}

const App = () => {
  return (
    <div>
      {courses.map(data => (
        <div key={data.id}>
          <Header course={data}/>
          <Content course={data}/>
          <Total course={data}/>
        </div>
      ))}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))