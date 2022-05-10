import React, { useContext, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useApi } from '../../hooks/useApi';
import UserContext from '../../contexts/userContext';
import { useNavigate } from 'react-router-dom';

const style = {
  
  
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  
  p: 4,
};

export const MainPage = () => {
  const api = useApi();
  const { user, setUser } = useContext(UserContext);
  const [emailEnter, setEmailEnter] = useState('');
  const [passwordEnter, setPasswordEnter] = useState('');

  const navigate = useNavigate();

  const emailChange  = (event) => {
    setEmailEnter(event.target.value);
  };

  const passwordChange  = (event) => {
    setPasswordEnter(event.target.value);
  };

  const enterNew = (event) => {
     event.preventDefault();

      const {
        target: {email, password},
        } = event;

       
        api.signUp({email: email.value, password: password.value})
        .then(() => api.signIn({email: email.value, password: password.value}))
        .then((user) => {
          
          const { token, data } = user;
          setUser(data);
          localStorage.setItem('token',token);
       
        });

        navigate('/main');
       

  };

  const enter = () => {
       
       api.signIn({email: emailEnter, password: passwordEnter}).
       then(({data, token}) => {
          api._token = token;
          setUser(data);
          localStorage.setItem('token', token)
          
       });
       

       navigate('/main');
       

  };

  return (
    <div>
        <h2 className='text'>Добро пожаловать в SchoolJSGram :)</h2>

        <Box sx={style}>
        <form onSubmit={enterNew}>
      <Grid container spacing={2}>
      <Grid item xs={12}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Вход
      </Typography>
      </Grid>

      
      <Grid item xs={12}>
        <TextField fullWidth label='email' name="email" variant='outlined' onChange={emailChange} required />
      </Grid>

      <Grid item xs={12}>
      <TextField fullWidth label='Пароль' name="password" variant='outlined' type="password" onChange={passwordChange} required />
      </Grid>

      <Grid item xs={6}>
            <Button fullWidth variant="contained" onClick={enter} > Вход</Button>
      </Grid>
      <Grid item xs={6}>
            <Button fullWidth variant="contained"  type='submit'>Регистрация</Button>
      </Grid>


      </Grid>
      </form>
      </Box>
    </div>
  )
}
