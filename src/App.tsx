import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "@liveblocks/redux";
import { VscAdd } from 'react-icons/vsc'
import { FaPen, FaTrash } from 'react-icons/fa'

import { setDraft, addTodo, deleteTodo } from "./store";

import "./App.css";

const WhoIsHere = () => {
  const othersUsersCount = useSelector(
    (state: any) => state?.liveblocks?.others.length
  );

  return (
    <div className="who_is_here">
      There are {othersUsersCount} other users online
    </div>
  );
}

const SomeoneIsTyping = () => {
  const someoneIsTyping = useSelector((state: any) =>
    state.liveblocks.others.some((user: any) => user.presence?.isTyping)
  );

  return someoneIsTyping ? (
    <div className="someone_is_typing">A user is typing</div>
  ) : null;
}

export default function App() {
  const todos = useSelector((state: any) => state.todos);
  const draft = useSelector((state: any) => state.draft);
  const dispatch = useDispatch();

  const handleEdit = (index: number) => {
    setDraft(todos[index].text)
    console.log(todos[index].text)
  }

  useEffect(() => {
    dispatch(actions.enterRoom("room-id"));

    return () => {
      dispatch(actions.leaveRoom("room-id"));
    };
  }, [dispatch]);

  return (
    <div className="container">
      <div className='wrapper'>
        <div className='users-status'>
          <SomeoneIsTyping />
          <WhoIsHere />
        </div>
        <div className='input-container'>
          <input
            className="input"
            type="text"
            placeholder="Add a new task"
            value={draft}
            onChange={(e) => dispatch(setDraft(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && draft !== '') {
                dispatch(addTodo());
              }
            }}
          ></input>
          <button className='add-button' onClick={() => {
            if (draft !== '') dispatch(addTodo())
          }}><VscAdd size={12} strokeWidth={2} /></button>
        </div>
        {todos.length < 1
          ? <div className='empty-list'>No task available</div>
          : todos.map((todo: any, index: number) => {
            return (
              <div className="todo_container" key={index}>
                <div className="todo">{todo.text}</div>
                <div className='button-container'>
                  <FaPen size={16} onClick={() => handleEdit(index)} color='#6CBE4C' />
                </div>
                <div className='button-container'>
                  <FaTrash size={16} onClick={() => dispatch(deleteTodo(index))} color='#F4340E' />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  )
}