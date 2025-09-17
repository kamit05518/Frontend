import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    AOS.init({ duration: 1000, once: false ,mirror: true });
    AOS.refresh(); 
  }, []);

  const onFinish = async (values) => {
    try {
      const res = await axios.post("http://localhost:5001/api/auth/contact", values);
      toast.success(res.data.message || "Message sent successfully!");
      form.resetFields();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send message!");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="min-h-screen flex items-center  justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-pink-400 p-4">
        <div
          className="w-full max-w-md bg-white/20 backdrop-blur-md mt-20 p-6 rounded-2xl shadow-2xl border border-white/30"
          data-aos="zoom-in"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-6" data-aos="fade-up">
            Contact Us
          </h2>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label={<span className="text-white">Name</span>}
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                className="bg-white/80 rounded focus:ring-2 focus:ring-purple-400 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
                placeholder="Your name"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-white">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                className="bg-white/80 rounded focus:ring-2 focus:ring-purple-400 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
                placeholder="Your email"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-white">Message</span>}
              name="message"
              rules={[{ required: true, message: "Please enter your message" }]}
            >
              <Input.TextArea
                rows={4}
                className="bg-white/80 rounded focus:ring-2 focus:ring-purple-400 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
                placeholder="Your message"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
                data-aos="fade-up"
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Contact;
