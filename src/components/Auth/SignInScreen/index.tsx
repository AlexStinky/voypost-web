import * as React from 'react';
import { useContext } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Button, { ButtonProps } from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { UIContext } from '../../Unknown/UIContext';

import fire from '../../../common/firebaseApp';

const Theme = createTheme();

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

const LoginHeader = styled(Typography)<TypographyProps>(() => ({
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'bold',
  fontSize: '40px',
  lineHeight: '112px',
}));

const LoginField = styled((props: TextFieldProps) => (
  <TextField
    InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiFilledInput-root': {
    width: '375px',
    height: '55px',
    marginBottom: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '0px 12px',
    overflow: 'hidden',
    borderRadius: '4px 4px 0px 0px',
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
  },
}));

const LoginButton = styled(LoadingButton)<ButtonProps>(({ theme }) => ({
  width: '375px',
  height: '42px',
  color: theme.palette.getContrastText('#F50057'),
  backgroundColor: '#F50057',
  '&:hover': {
    backgroundColor: '#F50057',
  },
  '&:active': {
    backgroundColor: '#F50057',
  },
  '&:focus': {
    backgroundColor: '#F50057',
  },
}));

const SignInScreen: React.FC = () => {
  const { setAlert } = useContext(UIContext);

  const [loading, setLoading] = React.useState(false);

  const [values, setValues] = React.useState<State>({
    email: '',
    password: '',
    showPassword: false,
  });

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    fire
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then((response) => {
        const { user } = response;
        const data = {
          userId: user!.uid,
          email: user!.email,
        };
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleSignIn = React.useCallback(async () => {
    setAlert({
      show: true,
      severity: 'info',
      message: '',
    });
  }, [setAlert]);

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  return (
    <ThemeProvider theme={Theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <LoginHeader>Login</LoginHeader>
            <Box
              component="form"
              noValidate
              onSubmit={handleSignIn}
              sx={{
                mt: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <LoginField
                fullWidth
                label="Email"
                id="email-input"
                variant="filled"
                onChange={handleChange('email')}
              />
              <LoginField
                fullWidth
                label="Password"
                id="password-input"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                variant="filled"
                InputProps={
                  {
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{
                          pl: '300px',
                        }}
                      >
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ mb: '55px' }}
                        >
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  } as Partial<OutlinedInputProps>
                }
              />
              <LoginButton
                type="submit"
                id="login-button"
                loading={loading}
                loadingIndicator="Loading..."
                onClick={handleSubmit}
                variant="contained"
              >
                Login
              </LoginButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default SignInScreen;
