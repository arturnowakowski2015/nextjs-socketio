import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

function useSocket(url: string) {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    fetch(url).finally(() => {
      const socketio = io();
      socketio.on('connect', () => {
        console.log('connect');
        socketio.emit('hello');
      });
      socketio.on('disconnect', () => {
        console.log('disconnect');
      });
      setSocket(socketio);
    });
    function cleanup() {
      socket.disconnect();
    }
    return cleanup;
  }, []);
  return socket;
}

const Hello = () => {
  const [counter, setCounter] = useState(0);
  useEffect(() => {}, []);
  const increment = () => {
    setCounter(counter + 1);
  };

  return <button onClick={increment}> {counter} </button>;
};

export default () => {
  const socket = useSocket('/api/socketio');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    if (socket) {
      socket.on('hello', data => {
        console.log('hello', data);
        setMessage(data);
      });
      socket.on('a user connected', () => {
        setUser('a user connected');
      });
    }
  }, [socket]);
  return (
    <>
      <h1>Socket.io</h1>
      <h1>Socket Message: {message}</h1>
      <p>User Onle Visible when you open in Sencond Tab</p>
      <h1>User: {user}</h1>
      <Hello />
    </>
  );
};
