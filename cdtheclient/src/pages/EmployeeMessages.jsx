import { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, TextField, Button, Avatar } from '@mui/material';

const EmployeeMessages = () => {
  const [messages, setMessages] = useState([
    
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([{
        id: Date.now(),
        sender: 'You',
        text: newMessage,
        time: 'Just now',
        unread: false
      }, ...messages]);
      setNewMessage('');
    }
  };

  return (
   <div className='pl-50'>
     <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Messages</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </Box>

      <List>
        {messages.map(message => (
          <ListItem key={message.id} divider sx={{ bgcolor: message.unread ? '#f0f8ff' : 'inherit' }}>
            <Avatar sx={{ mr: 2 }}>{message.sender.charAt(0)}</Avatar>
            <ListItemText
              primary={message.sender}
              secondary={
                <>
                  <Typography component="span" display="block">{message.text}</Typography>
                  <Typography component="span" variant="caption" color="text.secondary">
                    {message.time}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
   </div>
  );
};

export default EmployeeMessages;