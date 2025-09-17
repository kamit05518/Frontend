import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Forget.css";

const ForgetPassword = ({ onClose }) => {
  const [form] = Form.useForm();
  const [inputType, setInputType] = useState("email");

  // Detect if it's email or phone
  const detectType = (value) => {
    if (/^\d{10}$/.test(value)) {
      setInputType("phone");
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setInputType("email");
    } else {
      setInputType("");
    }
  };

  const onFinish = async (values) => {
    const payload =
      inputType === "email"
        ? { email: values.contact }
        : { phone: values.contact };

    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/forgot-password",
        payload
      );
      message.success(res.data.message || "Verification sent!");
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="forget-background">
      <div className="forget-form-container">
        <button
          className="close-button"
          onClick={onClose || (() => window.history.back())}
        >
          <CloseOutlined />
        </button>
        <h2 className="forget-title">Reset Your Password</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email or Phone Number"
            name="contact"
            rules={[
              { required: true, message: "Please enter email or phone" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.reject();
                  if (
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                    /^\d{10}$/.test(value)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Enter valid email or 10-digit phone");
                },
              },
            ]}
          >
            <Input
              placeholder="Enter your email or phone number"
              onChange={(e) => detectType(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Verification
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgetPassword;
