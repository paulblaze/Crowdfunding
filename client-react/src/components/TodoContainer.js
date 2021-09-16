import React from 'react';
import TodoList from './TodoList';

class TodoContainer extends React.Component {

  state = {
    todos: [
      {
        id: 1,
        title: "Setup development environment",
        completed: true
      },
      {
        id: 2,
        title: "Develop website and add content",
        completed: false
      },
      {
        id: 3,
        title: "Deploy to live server",
        completed: true
      }
    ]
   };

  handleChange = (id) => {
    console.log(id);
  }

  render() {
    return(
      <React.Fragment>
      <React.StrictMode>        
        <TodoList todos={this.state.todos} handleChangeProps={this.handleChange} />
      </React.StrictMode>  
      </React.Fragment>
    )
  }
}

export default TodoContainer;