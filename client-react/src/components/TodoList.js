import React from 'react';
import TodoItem from './TodoItem';

function TodoList(props) {
  return(
    props.todos.map(todo =>(
      <TodoItem key={todo.id} todo={todo} handleChangeProps={props.handleChangeProps} />
    ))    
  )
}

export default TodoList;