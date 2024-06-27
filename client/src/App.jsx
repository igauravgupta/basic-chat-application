import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Container, TextField, Typography, Button } from '@mui/material';

// Initialize socket outside of the component
const socket = io('http://localhost:3000/');

function App() {
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [joinRoom, setJoinRoom] = useState('');
  const [SocketID, setSocketId] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  // Handle form submission for sending message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket.connected) {
      socket.emit('message', { message, room });
      setMessage(''); // Clear input field after sending
    } else {
      console.log('Socket is not connected.');
    }
  };

  // Handle joining a room
  const joinRoomHandler = (e) => {
    e.preventDefault();
    if (joinRoom) {
      socket.emit('join-room', joinRoom); // Emit the join-room event with room name
      setRoom(joinRoom); // Set the current room to the joined room
      setJoinRoom(''); // Clear the input field after joining
    }
  };

  // Effect to handle socket events
  useEffect(() => {
    const handleConnect = () => {
      setSocketId(socket.id);
      console.log('Connected:', socket.id);
    };

    const handleReceived = (data) => {
      console.log('Received:', data);
      setReceivedMessage(data); // Update state with received message
    };

    socket.on('connect', handleConnect);
    socket.on('received', handleReceived);

    // Cleanup function to disconnect socket and remove event listeners
    return () => {
      socket.off('connect', handleConnect);
      socket.off('received', handleReceived);
    };
  }, []);

  return (
    <Container maxWidth='sm'>
      <Typography variant='h1' component='div'>
        Welcome
      </Typography>
      <Typography component='div'>
        Socket ID: {SocketID}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <TextField
          value={joinRoom}
          onChange={(e) => setJoinRoom(e.target.value)}
          id='outlined-basic'
          label='Join Room'
          variant='outlined'
        />
        <Button type='submit' variant='contained'>
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id='outlined-basic'
          label='Message'
          variant='outlined'
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id='outlined-basic'
          label='Room'
          variant='outlined'
        />
        <Button type='submit' variant='contained'>
          Send
        </Button>
      </form>

      {receivedMessage && (
        <Typography variant='body1' gutterBottom>
          Received: {receivedMessage}
        </Typography>
      )}
    </Container>
  );
}

export default App;
