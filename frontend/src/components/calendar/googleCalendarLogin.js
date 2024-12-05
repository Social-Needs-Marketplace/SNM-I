import { useGoogleLogin } from '@react-oauth/google';
import { Button } from "@mui/material";
import { updateGoogleLogin } from "../../api/calendarAPI";

const GoogleCalendarLogin = ({ onSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log("Google login successful:", codeResponse);
      await updateGoogleLogin(codeResponse); // Save login information
      if (onSuccess) onSuccess();
    },
    flow: 'auth-code',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });

  const authenticate = async () => {
    await login();
  };

  return (
    <Button onClick={authenticate} variant="outlined">
      Authenticate with Google Calendar
    </Button>
  );
};

export default GoogleCalendarLogin;
