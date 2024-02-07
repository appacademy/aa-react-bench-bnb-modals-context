import * as sessionActions from '../../store/session';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInput, useSubmit } from '../../hooks';
import { FormErrors, Input } from '../formElements';
import './LoginForm.css';

function LoginForm() {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();

  useEffect(()=>{
    if (sessionUser) navigate("/");
  }, [sessionUser, navigate]);
  
  const onSuccess = () => {
    navigate("/");
  };

  const [credential, onCredentialChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [errors, onSubmit] = useSubmit({ 
    onSuccess,
    action: sessionActions.login({ credential, password })
  });

  return (
    <form onSubmit={onSubmit} className="form">
      <h1>Log In</h1>
      <FormErrors errors={errors} />
      <Input 
        label="Username or Email"
        value={credential}
        onChange={onCredentialChange}
        required
      />
      <Input 
        label="Password"
        type="password"
        value={password}
        onChange={onPasswordChange}
        required
      />
      <button type="submit" className="button">Log In</button>
    </form>
  );
}

export default LoginForm;
