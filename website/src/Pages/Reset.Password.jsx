import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token } = useParams(); // Reset token from URL

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      return message.error("Passwords do not match!");
    }

    try {
      const res = await fetch("http://localhost:5001/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: values.password
        })
      });

      const result = await res.json();
      if (res.ok) {
        message.success("Password reset successfully!");
        navigate("/login");
      } else {
        message.error(result.message || "Reset failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Server error. Try again later.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-pink-700 p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl">
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Reset Your Password 🔐
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Form.Item
            name="password"
            label={<span className="text-white">New Password</span>}
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 6, message: "Minimum 6 characters required" }
            ]}
          >
            <Input.Password
              className="bg-transparent text-white border-b border-pink-200 placeholder-pink-200"
              style={{ backgroundColor: "transparent" }}
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<span className="text-white">Confirm Password</span>}
            rules={[{ required: true, message: "Please confirm your password" }]}
          >
            <Input.Password
              className="bg-transparent text-white border-b border-pink-200 placeholder-pink-200"
              style={{ backgroundColor: "transparent" }}
              placeholder="Confirm new password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              className="w-full bg-white text-pink-600 font-semibold hover:bg-pink-200 transition"
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

export default ResetPassword;
