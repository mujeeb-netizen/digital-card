"use client";
import apiRequest from "@/context/apiRequest";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Flex,
  Typography,
  Form,
  Input,
  Col,
  Row,
  Select,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import React from "react";
const { Title, Text } = Typography;
const {Item} = Form
const Page = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const addUserMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "post",
        url: `signup`,
        data,
      });

      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success("user create successfully");
        router.back();
      } else {
        message.error(e.message);
      }
    },
  });

  const handleSubmit = (e) => {
    addUserMutation.mutate(e);
  };
  return (
    <div>
      <Flex justify="flex-start" align="middle" style={{ marginBlock: "3rem" }}>
        <Title style={{ marginBottom: 0 }}>Add user</Title>
      </Flex>
      <Flex>
        <Col span={14}>
          <Form
            form={form}
            name="control-ref"
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row justify="space-between">
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "this field is mendatory!",
                    },
                  ]}
                  label={
                    <Text strong style={{ fontSize: 16 }}>
                      User Name
                    </Text>
                  }
                >
                  <Input size="large" placeholder="User Name" />
                </Item>
              </Col>
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "this field is mendatory!",
                    },
                  ]}
                  label={
                    <Text strong style={{ fontSize: 16 }}>
                      Password
                    </Text>
                  }
                >
                  <Input.Password size="large" placeholder="Password" />
                </Item>
              </Col>
              <Col xs={23} sm={23} md={11} lg={11} xl={11} xxl={11}>
                <Item
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: "this field is mendatory!",
                    },
                  ]}
                  label={
                    <Text strong style={{ fontSize: 16 }}>
                      Role
                    </Text>
                  }
                >
                  <Select
                    size="large"
                    showSearch
                    placeholder="Select a Role"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        label: "Admin",
                        value: "admin",
                      },
                      { label: "Member", value: "member" },
                    ]}
                  />
                </Item>
              </Col>
            </Row>

            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={addUserMutation.isPending}
              // className={styles.btn_submit}
            >
              Create New User
            </Button>
          </Form>
        </Col>
      </Flex>
    </div>
  );
};

export default Page;
