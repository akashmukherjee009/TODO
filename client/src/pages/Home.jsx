import React, { Fragment } from 'react'
import InputTodo from '../components/InputTodo'
import Navbar from '../components/Navbar'
import ListTodos from '../components/ListTodo'

const Home = () => {
  return (
    <Fragment>
        <Navbar />
        <InputTodo />
        <ListTodos />
    </Fragment>
  )
}

export default Home
