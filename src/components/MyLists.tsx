'use client';

import Link from 'next/link';
import classNames from 'classnames';
import { CreateList } from '@/components/CreateList';
import { randomColor } from '@/utils/randomColor';
import { useState, useEffect } from 'react';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';
import { MY_EMAIL_KEY } from '@/constants/email';

export type TodoList = {
  id: number;
  created_at: string;
  name: string;
  email: string;
};

const GET_TODO_LISTS_QUERY = gql`
  query GetTODOLists($email: String!) {
    getTODOLists(email: $email) {
      id
      name
    }
  }
`;

const DELETE_TODO_LIST_MUTATION = gql`
  mutation DeleteTODOList($deleteTodoListId: Int!) {
    deleteTODOList(id: $deleteTodoListId)
  }
`;

export function MyLists() {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);

  useEffect(() => {
    client
      .request<{ getTODOLists: TodoList[]; }>(GET_TODO_LISTS_QUERY, {
        email: MY_EMAIL_KEY,
      })
      .then((data) => {
        console.log(data);
        setTodoLists(data.getTODOLists);
      });
  }, []);

  const onCreateHandler = (newTodoList: TodoList) => {
    setTodoLists([...todoLists, newTodoList]);
  };

  const onDeletedHandler = (id: string) => {
    client
      .request<{ deleteTODOList: boolean; }>(DELETE_TODO_LIST_MUTATION, {
        deleteTodoListId: parseInt(id),
      })
      .then((data) => {
        if (data.deleteTODOList) {
          setTodoLists(todoLists.filter((item) => item.id.toString() !== id));
        }
      });
  };

  return (
    <div className="flex flex-col gap-8 text-center">
      <h1 className="text-4xl">{todoLists.length > 0 ? 'My TODO lists' : 'No lists yet!'}</h1>
      <ul className='flex flex-col gap-4'>
        {todoLists.map((item) => (
          <li key={item.id} className='flex gap-2 items-center'>
            <Link
              href={item.id.toString()}
              className={classNames(
                'grow py-2 pl-4 pr-2 bg-gray-900 rounded-lg flex justify-between items-center min-h-16 text-black hover:scale-[1.02] transform transition duration-300 ease-in-out',
                randomColor(),
              )}
            >
              {item.name}
            </Link>
            <button onClick={() => onDeletedHandler(item.id.toString())} className="btn btn-danger">
              Delete
            </button>
          </li>
        ))}
      </ul>
      <CreateList onCreate={onCreateHandler} />
    </div>
  );
};
