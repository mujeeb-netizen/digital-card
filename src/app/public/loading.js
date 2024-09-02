"use client";
import { Flex, Spin } from "antd";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <Spin />
    </Flex>
  );
}
