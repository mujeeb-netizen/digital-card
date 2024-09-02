"use client";
import {
  Button,
  Flex,
  Card,
  Typography,
  message,
  Row,
  Col,
  Image,
  Input,
  Tooltip,
  Layout,
} from "antd";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { AiTwotoneCopy } from "react-icons/ai";
import Link from "next/link";
import { useStateValue } from "@/context/GlobalContextProvider";
const Canvas = dynamic(() => import("@/components/Canvas"), {
  ssr: false,
});
const { Title, Text } = Typography;
const { Content, Footer } = Layout;
export default function Home() {
  const stageRef = useRef();
  const [format, setFormat] = useState("png");
  const [text, setText] = useState("");
  const [{ isTemplate }, dispatch] = useStateValue();
  const publicTemplateData = isTemplate;
  const handleDownload = () => {
    const stage = stageRef.current.getStage();
    const stageWidth = stage.width();
    const stageHeight = stage.height();
    const scaleFactor = 1; // Adjust this value to scale the image if needed

    const dataURL = stage.toDataURL({ pixelRatio: 3 });

    switch (format) {
      case "png":
      case "jpeg":
        saveAs(dataURL, `ev-card.${format}`);
        break;
      case "pdf":
        const pdf = new jsPDF({
          orientation: stageWidth > stageHeight ? "landscape" : "portrait",
          unit: "px",
          format: [stageWidth * scaleFactor, stageHeight * scaleFactor],
        });

        pdf.addImage(dataURL, "JPEG", 0, 0, stageWidth, stageHeight);
        pdf.save("canvas_image.pdf");
        break;
      default:
        console.error("Invalid format:", format);
        break;
    }
  };

  const handleCopyToClipboard = async () => {
    const stage = stageRef.current.getStage();
    const dataURL = stage.toDataURL({ pixelRatio: 2 }); // Adjust pixel ratio as needed

    // Convert dataURL to Blob
    await fetch(dataURL)
      .then((res) => res.blob())
      .then(async (blob) => {
        // Copy blob to clipboard
        setTimeout(async () => {
          await navigator.clipboard
            .write([new ClipboardItem({ "image/png": blob })])
            .then(() => {
              message.success("Image copied to clipboard");
              // Optionally, you can provide feedback to the user here
            })
            .catch((error) => {
              alert(error);
              console.error("Error copying image to clipboard:", error);
              // Optionally, you can handle errors here
            });
        });
      })
      .catch((error) => {
        console.error("Error converting dataURL to blob:", error);
      });
  };

  return publicTemplateData?.data === null ? (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <Card bordered={false} style={{ width: "50%" }}>
        <Title level={2}>Template no longer exist</Title>
        <Text>
          Try contacting the owner of the Template if you think this is a
          mistake.
        </Text>
      </Card>
    </Flex>
  ) : (
    <Layout
      style={{
        backgroundColor: publicTemplateData?.data?.bg_color
          ? publicTemplateData?.data?.bg_color
          : "none",
      }}
    >
      <div style={{ backgroundColor: "white", padding: "1rem" }}>
        <Row justify="space-between" align="middle" gutter={[10, 10]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Flex align="center" gap={16}>
              <Image
                style={{
                  borderRadius: "50%",
                  border: "1px solid black",
                  width: "50px",
                  height: "50px",
                }}
                fallback="/img.png"
                src={publicTemplateData?.data?.logo_img}
              />
              <Title level={2} style={{ margin: 0 }}>
                {publicTemplateData?.data?.company_name}
              </Title>
            </Flex>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Flex gap={16} justify="end" align="center">
              <Input
                style={{ width: "50%" }}
                placeholder={publicTemplateData?.data?.text_placeholder}
                size="large"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Tooltip placement="top" title="Copy to Clipboard">
                <Button
                  type="dashed"
                  size="large"
                  onClick={handleCopyToClipboard}
                  icon={
                    <AiTwotoneCopy style={{ paddingBottom: 4 }} size={28} />
                  }
                />
              </Tooltip>
              <Button
                style={{
                  backgroundColor: publicTemplateData?.data?.download_btn_color,
                }}
                type="primary"
                size="large"
                onClick={handleDownload}
              >
                Download
              </Button>
            </Flex>
          </Col>
        </Row>
      </div>
      <Content>
        <Flex
          justify={
            window.innerWidth < 500 &&
            publicTemplateData?.data?.canvas_width / 2 > 450
              ? ""
              : "space-around"
          }
          align="center"
          style={{
            padding: "10px",
            height: "100%",
            minHeight: "80vh",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Canvas
            stageRef={stageRef}
            imageUrl={publicTemplateData?.data?.bg_img}
            text={
              text === "" ? publicTemplateData?.data?.text_placeholder : text
            }
            fontSize={publicTemplateData?.data?.text_size}
            fontVariant={
              publicTemplateData?.data?.is_italic ? "italic" : "normal"
            }
            fontStyle={publicTemplateData?.data?.is_bold ? "bold" : "normal"}
            fontFamily={publicTemplateData?.data?.text_font}
            selectedColor={publicTemplateData?.data?.text_color}
            textPosition={publicTemplateData?.data?.text_position}
            draggable={false}
            width={publicTemplateData?.data?.canvas_width}
            height={publicTemplateData?.data?.canvas_height}
          />
        </Flex>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <Link href="https://www.urbanoasis.sa/" target="_blank">
          Urban Oasis ©{new Date().getFullYear()} Powered by Urban Oasis
        </Link>
      </Footer>
    </Layout>
  );
}
