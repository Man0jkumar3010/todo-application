import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import '../style/form.css'

const Form = ({onSubmit,updateTodo}) => {
  
  const [input, setInput] = useState(updateTodo ? updateTodo.value: "");

  const handleOnChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 

    if (onSubmit) {
      onSubmit({
        id: uuidv4(),
        text: input
      });

      setInput(""); 
    }
  };

  return (
    <form className='todo-container' onSubmit={handleSubmit}>
      {updateTodo ? (
        <div>
          <input
            type="text"
            className='todo-input'
            placeholder='Enter Your task'
            value={input}
            onChange={handleOnChange}
          />
          <button className='todo-button'>Add Todo</button>
        </div>
      ) :(
        <div>
          <input
            type="text"
            className='todo-input '
            placeholder='Edit Items'
            value={input}
            onChange={handleOnChange}
          />
          <button className='todo-button'>Update</button>
        </div>
      )}
    </form>
  );
};

export default Form;
