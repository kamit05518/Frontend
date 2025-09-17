import React from "react";
import { Layout } from "antd";

const { Header } = Layout;

const HeaderBar = () => {
  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 0 }}>Dashboard</h1>
      <span>Welcome, Admin</span>
    </Header>
  );
};

export default HeaderBar;
