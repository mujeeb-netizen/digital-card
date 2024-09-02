"use client";
import { Layout, Menu, Typography, Row, Spin } from "antd";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsBoxArrowLeft, BsFillPeopleFill } from "react-icons/bs";
import { AiFillFileText } from "react-icons/ai";
import Link from "next/link";
import { useStateValue } from "@/context/GlobalContextProvider";
const {Title} = Typography
const {Sider, Content, Footer} = Layout
const AdminLayout = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [token, setToken] = useState(null);
  const [{ selectedFont }, dispatch] = useStateValue();
  useEffect(() => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${selectedFont}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [selectedFont]);
  useEffect(() => {
    const stored = localStorage.getItem("@auth_token");
    if (stored) {
      setToken(stored);
    } else {
      router.push("/");
    }
  }, []);
  const getItem = (label, key, icon, children, style, type) => {
    return {
      label,
      key,
      icon,
      children,
      style,
      type,
    };
  };
  if (!token) {
    return (
      <div className="loadingContainer">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      <Layout style={{ height: "100vh" }}>
        <Sider
          style={{ overflow: "scroll" }}
          width={230}
          breakpoint="lg"
          theme="light"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            setCollapsed(collapsed);
          }}
        >
          <Row justify="center" style={{ marginBlock: 40 }}>
            <Title style={{ fontSize: collapsed ? 12 : 34 }}>
              EV-CARD
            </Title>
          </Row>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              height: "80vh",
            }}
          >
            <Menu
              style={{ fontSize: "16px", fontWeight: "500" }}
              theme="light"
              mode="inline"
              defaultSelectedKeys={[pathname]}
              onClick={(e) => router.push(e.key)}
              items={[
                getItem(
                  "Users",
                  "/admin/users",
                  <BsFillPeopleFill size={collapsed ? 16 : 24} />,
                  null,
                  { marginBottom: "30px" }
                ),
                getItem(
                  "EV_Template",
                  "/admin/forms",
                  <AiFillFileText size={collapsed ? 16 : 24} />,
                  null,
                  { marginBottom: "30px" }
                ),
              ]}
            />

            {collapsed ? (
              <Row
                justify="center"
                style={{ cursor: "pointer", marginBlock: 10 }}
                onClick={async () => {
                  await localStorage.removeItem("@admin");
                  await localStorage.removeItem("@auth_token");
                  router.push("/");
                }}
              >
                <BsBoxArrowLeft size={16} color="red" />
              </Row>
            ) : (
              <Row
                justify="center"
                style={{ cursor: "pointer", marginBlock: 10 }}
                onClick={async () => {
                  await localStorage.removeItem("@admin");
                  await localStorage.removeItem("@auth_token");
                  router.push("/");
                }}
              >
                <BsBoxArrowLeft size={24} color="red" />
                <Title
                  style={{ color: "red", marginLeft: 10 }}
                  level={5}
                >
                  Log Out
                </Title>{" "}
              </Row>
            )}
          </div>
        </Sider>
        <Layout style={{ backgroundColor: "#f0f2f5" }}>
          <Content>
            <div
              style={{
                padding: collapsed ? "10px" : "10px 50px",
                height: "100%",
                overflowY: "auto",
              }}
            >
              {props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            <Link href="https://www.urbanoasis.sa/" target="_blank">
              Urban Oasis ©{new Date().getFullYear()} Powered by Urban Oasis
            </Link>
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminLayout;
