"use client";

import { useState } from 'react';
import { Heart } from '@/components/icons/Heart';
import { Close } from '@/components/icons/Close';
import { AddTodo } from '@/components/AddTodo';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';
import Link from 'next/link';

export type Todo = {
  id: number;
  desc: string;
  finished: boolean;
};

type TodosProps = {
  listId: number;
  list: Todo[];
};

const ADD_TODO_MUTATION = gql`
  mutation AddTODO($listId: Int!, $desc: String!) {
    addTODO(listId: $listId, desc: $desc) {
      id
      desc
      finished
    }
  }
`;

const REMOVE_TODO_MUTATION = gql`
  mutation RemoveTODO($id: Int!, $listId: Int!) {
    removeTODO(id: $id, listId: $listId)
  }
`;

const FINISH_TODO_MUTATION = gql`
  mutation FinishTODO($id: Int!, $listId: Int!) {
    finishTODO(id: $id, listId: $listId) {
      id
      desc
      finished
    }
  }
`;

export const Todos = ({ list = [], listId }: TodosProps) => {
  const [todos, setTodos] = useState<Todo[]>(list);

  const onAddHandler = (desc: string) => {
    client
      .request<{ addTODO: Todo; }>(ADD_TODO_MUTATION, {
        listId,
        desc,
      })
      .then((data) => {
        setTodos([...todos, data.addTODO]);
      });
  };

  const onRemoveHandler = (id: number) => {
    client
      .request<{ removeTODO: boolean; }>(REMOVE_TODO_MUTATION, {
        id,
        listId,
      })
      .then((data) => {
        if (data.removeTODO) {
          setTodos(todos.filter((item) => item.id !== id));
        }
      });
  };

  const onFinishHandler = (id: number) => {
    client
      .request<{ finishTODO: Todo; }>(FINISH_TODO_MUTATION, {
        id,
        listId,
      })
      .then((data) => {
        setTodos(todos.map((item) => (item.id === id ? data.finishTODO : item)));
      });
  };

  return (
    <div>
      <Link href="/">
        <h2 className="text-center text-5xl mb-10">My TODO list</h2>
      </Link>
      <ul>
        {todos.map((item) => (
          <li
            key={item.id}
            className="py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16"
          >
            <p className={item.finished ? 'line-through' : ''}>{item.desc}</p>
            {!item.finished && (
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-accent"
                  onClick={() => onFinishHandler(item.id)}
                >
                  <Heart />
                </button>
                <button
                  className="btn btn-square btn-error"
                  onClick={() => onRemoveHandler(item.id)}
                >
                  <Close />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <AddTodo onAdd={onAddHandler} />
    </div>
  );
};
