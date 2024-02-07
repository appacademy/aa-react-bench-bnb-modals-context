import * as sessionActions from '../../store/session';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInput, useSubmit } from '../../hooks';
import { FormErrors, Input } from '../formElements';

function SignupForm() {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();

  useEffect(()=>{
    if (sessionUser) navigate("/");
  }, [sessionUser, navigate]);

  const onSuccess = () => {
    navigate("/");
  };

  const [email, onEmailChange] = useInput("");
  const [username, onUsernameChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [confirmPassword, onConfirmPasswordChange] = useInput("");
  const [errors, onSubmit] = useSubmit({ 
    onSuccess,
    action: sessionActions.signup({ email, username, password }),
    validate: () => {
      if (password !== confirmPassword) {
        return ['Confirm Password field must be the same as the Password field'];
      }
    }
  });

  return (
    <form onSubmit={onSubmit} className="form">
      <h1>Sign Up</h1>
      <FormErrors errors={errors} />
      <Input 
        label="Email"
        value={email}
        onChange={onEmailChange}
        required
      />
      <Input 
        label="Username"
        value={username}
        onChange={onUsernameChange}
        required
      />
      <Input 
        label="Password"
        type="password"
        value={password}
        onChange={onPasswordChange}
        required
      />
      <Input 
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        required
      />
      <button type="submit" className="button">Sign Up</button>
    </form>
  );
}

export default SignupForm;
