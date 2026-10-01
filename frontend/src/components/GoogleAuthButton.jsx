import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const GoogleAuthButton = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            credential: credentialResponse.credential,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Google authentication failed:",
          data.message
        );
        return;
      }

      console.log(
        "Google authentication successful:",
        data
      );

      navigate("/profile");
    } catch (error) {
      console.error(
        "Google authentication error:",
        error
      );
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign-In failed");
  };

  return (
    <div className="flex w-full justify-center overflow-hidden rounded-xl">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        width={420}
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
};

export default GoogleAuthButton;