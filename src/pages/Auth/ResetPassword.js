// import React, { useEffect, useRef, useState } from "react";
// import { Button, Divider, Form, Input, Typography, message } from "antd";
// import { confirmPasswordReset } from "firebase/auth";
// import { auth } from "config/firebase";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// const { Title, Text } = Typography;

// export default function ResetPassword({ location }) {
//   const navigate = useNavigate();
//   const [state, setState] = useState({ password: "" });
//   const [isProcessing, setIsProcessing] = useState(false);
//   const oobCode = useRef(null);
//   const handleChange = (e) =>
//     setState((s) => ({ ...s, [e.target.name]: e.target.value }));

//   useEffect(() => {
//     if (location) {
//       const queryParams = new URLSearchParams(location.search);
//       oobCode.current = queryParams.get("oobCode");
//       if (!oobCode.current) {
//         navigate("/auth/login");
//       }
//     }
//   }, []);

//   const handleLogin = (e) => {
//     e.preventDefault();

//     let { password } = state;
//     setIsProcessing(true);
//     confirmPasswordReset(auth, oobCode.current, password)
//       .then(() => {
//         message.success("Password Changed Successfully.");
//         setTimeout(() => {
//           navigate("/auth/login");
//         }, 4000);
//       })
//       .catch((err) => {
//         console.error(err);
//         message.error("Something went wrong while changing password.");
//       })
//       .finally(() => {
//         setIsProcessing(false);
//       });
//   };

import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, Form, Input, Typography, message } from "antd";
import { updatePassword } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Correct import
import { auth } from "config/firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

export default function ResetPassword({ location }) {
  const navigate = useNavigate();
  const [state, setState] = useState({ password: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const oobCode = useRef(null);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/auth/login"); // Redirect to login if user not authenticated
      }
    });
    return () => unsubscribe(); // Clean up the subscription
  }, [navigate]);

  useEffect(() => {
    if (location) {
      const queryParams = new URLSearchParams(location.search);
      oobCode.current = queryParams.get("oobCode");
      if (!oobCode.current) {
        navigate("/auth/login");
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    let { password } = state;
    setIsProcessing(true);

    // Check if a user is authenticated before updating password
    const user = auth.currentUser;
    if (!user) {
      message.error("User not authenticated.");
      setIsProcessing(false);
      return;
    }

    // Update the password using Firebase's updatePassword function
    updatePassword(user, password)
      .then(() => {
        message.success("Password Changed Successfully.");
        setTimeout(() => {
          navigate("/auth/login");
        }, 4000);
      })
      .catch((err) => {
        message.error("Something went wrong while changing password.");
        console.error(err);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  return (
    <main className="auth">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card p-3 p-md-4">
              <Title level={2} className="m-0 text-center">
                Reset Password
              </Title>

              <Divider />

              <Form layout="vertical">
                <Form.Item label="New Password">
                  <Input.Password
                    placeholder="Input your password"
                    name="password"
                    onChange={handleChange}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-100"
                  loading={isProcessing}
                  onClick={handleLogin}
                >
                  Reset Password
                </Button>
                <div style={{ marginTop: "5%", textAlign: "center" }}>
                  <Text>
                    <Link to="/auth/login">Login?</Link>
                  </Text>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
