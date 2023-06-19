import { useState, useEffect } from "react"
import axios from 'axios'

import "./App.css"



function App() {
 
  const[tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState("all")

  function getTasks(filter){
    axios.get("http://localhost:3333/tasks/" + filter)
         .then((response) => {
          setTasks(response.data)
         })
         .catch((error)=> {
          console.log(error)
         })
  }

  useEffect(() => {
    getTasks(filter)
  },[filter])

  function addTask(event){
    event.preventDefault()

    if(inputValue.trim() === ""){
      return
    }

    axios.post("http://localhost:3333/tasks",{name: inputValue})
         .then((response) => {
          setTasks([...tasks,response.data])
         })
         .catch((erro)=> {
          console.log(erro)
         })

    setTasks([
      ...tasks,
      {id: Date.now(),
      name: inputValue,
      completed: false,
      }
    ])

    setInputValue("")
  }

  function handleChange(event){
    setInputValue(event.target.value)
  }

  function completeTask(id,taskCompleted){
    axios.patch("http://localhost:3333/tasks/" + id + "/" + taskCompleted)
    .then (() => {
     getTasks(filter)
    })
    .catch((error) => console.log(error))

  }

  function deleteTask(taskId){
    axios.delete("http://localhost:3333/tasks/" + taskId)
         .then (() => {
          const filteredTasks = tasks.filter((task) => task.id !== taskId)
          setTasks(filteredTasks)
         })
         .catch((error) => console.log(error))
  }

  return (
    <div className="container">
      <form className="form" onSubmit={(event) => addTask(event)}>
        <input placeholder="Nova Tarefa" onChange={(event)=>
           handleChange(event)}
           value={inputValue}/>
        <button>Nova Tarefa </button>
        </form>

        <div className="filters">
          <button className={filter === "all"       ? "selected" : ""} onClick={() => setFilter("all")}>todas</button>
          <button className={filter === "pending"   ? "selected" : ""} onClick={() => setFilter("pending")}>pendentes</button>
          <button className={filter === "completed" ? "selected" : ""} onClick={() => setFilter("completed")}>completas</button>
        </div>

        <ul className="task-list" >
          {tasks.map(task => (
            <li key={task.id}>
              
              <input
          type="checkbox"
          id={task.id}
          value={task.completed}
          checked={task.completed}
          onChange={() => completeTask(task.id, task.completed)}
        />
              <span>{task.name}</span>
              <button onClick={() => deleteTask(task.id)}>Deletar</button>
            </li>
          ))}
        </ul>
    </div>
  )
}
export default App
