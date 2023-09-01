import React, { useState } from "react";
import { Button, Divider, Form, Input, Typography, message } from "antd";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "config/firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [state, setState] = useState({ email: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleLogin = (e) => {
    e.preventDefault();

    let { email } = state;

    setIsProcessing(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        message.success("Email Sent Successfully.");
        setTimeout(() => {
          navigate("/auth/login");
        }, 4000);
      })
      .catch((err) => {
        message.error("Something went wrong while sending reset email.");
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
                Forgot Password
              </Title>

              <Divider />

              <Form layout="vertical">
                <Form.Item label="Email">
                  <Input
                    placeholder="Input your email"
                    name="email"
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
