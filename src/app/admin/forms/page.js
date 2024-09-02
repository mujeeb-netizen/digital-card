"use client";
import React, { useState } from "react";
import { Row, Button, Typography, Table, message, Image, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { AiTwotoneEdit, AiTwotoneDelete, AiTwotoneCopy } from "react-icons/ai";
import apiRequest from "@/context/apiRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useStateValue } from "@/context/GlobalContextProvider";
const { Title } = Typography;
const Page = () => {
  const router = useRouter();
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(1);
  const [{}, dispatch] = useStateValue();
  const formData = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "get",
          url: `templates`,
        },
        router
      );

      return response;
    },
  });

  const delFormMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "delete",
        url: `template`,
        data,
      });

      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        message.success(e.message);
        formData.refetch();
      } else {
        message.error(e.message);
      }
    },
  });

  const handleDelete = async (id, company_name) => {
    await delFormMutation.mutate({ id, company_name });
  };
  const columns = [
    {
      title: "Logo",
      dataIndex: "logo_img",
      key: "logo_img",
      render: (e) => (
        <Image
          fallback="/img.png"
          src={e}
          width={50}
          height={50}
          style={{objectFit:"cover", borderRadius: "50px" }}
        />
      ),
    },
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (e) => moment(e).format("YYYY-MM-DD"),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "company_name",
      render: (e) => (
        <div>
          <Tooltip placement="top" title="Copy to Clipboard">
            <Button
              htmlType="button"
              style={{ marginLeft: 5 }}
              type="dashed"
              icon={<AiTwotoneCopy style={{ paddingBottom: 4 }} size={28} />}
              size="large"
              onClick={(d) => {
                d.stopPropagation();
                if (typeof window !== "undefined") {
                  const hostname = window.location.host;
                  navigator.clipboard.writeText(
                    `${hostname}/public/ev-form/${e.url}?title=${e.company_name}&f=${e.text_font}`
                  );
                  message.success("Link copied!");
                }
              }}
            />
          </Tooltip>

          <Button
            htmlType="button"
            style={{ marginLeft: 5 }}
            type="dashed"
            icon={<AiTwotoneEdit style={{ paddingBottom: 4 }} size={28} />}
            size="large"
            onClick={async () => {
              await dispatch({ type: "SET_EDIT_TEMPLATE", editTemplate: e });
              router.push(`/admin/forms/edit-form/${e._id}`);
            }}
          />

          <Button
            htmlType="button"
            style={{ marginLeft: 5 }}
            type="dashed"
            icon={
              <AiTwotoneDelete
                color="red"
                style={{ paddingBottom: 4 }}
                size={28}
              />
            }
            onClick={() => {
              handleDelete(e._id, e.company_name);
            }}
            size="large"
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBlock: "3rem" }}
      >
        <Title style={{ marginBottom: 0 }}>Manage Templates</Title>

        <Button
          size="large"
          type="primary"
          onClick={() => router.push("/admin/forms/add-form")}
        >
          Add New Form
        </Button>
      </Row>
      <Row>
        <Table
          style={{ width: "100%" }}
          columns={columns}
          dataSource={formData?.data?.data}
          loading={formData.isLoading}
          size="middle"
          scroll={{ x: true }}
          pagination={{
            current: offset,
            pageSize: pageSize,
            position: ["bottomRight"],
            total: 1,
            showSizeChanger: false,
          }}
          onChange={(e) => {
            setPageSize(e.pageSize), setOffset(e.current);
          }}
        />
      </Row>
    </div>
  );
};

export default Page;
