"use client";
import apiRequest from "@/context/apiRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Flex,
  Input,
  Col,
  Row,
  Select,
  message,
  Card,
  ColorPicker,
  InputNumber,
  Upload,
} from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { BsUpload } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { useStateValue } from "@/context/GlobalContextProvider";

const Canvas = dynamic(() => import("@/components/Canvas"), {
  ssr: false,
});
const Page = () => {
  const stageRef = useRef(null);
  const textRef = useRef(null);
  const router = useRouter();
  const [{ selectedFont, text }, dispatch] = useStateValue();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 100 });
  const [imageSrc, setImageSrc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [canvasWidth, setCanvasWidth] = useState(700);
  const [canvasHeight, setCanvasHeight] = useState(700);
  const [companyName, setCompanyName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#1677FF");
  const [bgColor, setBgColor] = useState("#f0f2f5");
  const [btnColor, setBtnColor] = useState("#1d3541");
  const hexString = React.useMemo(
    () =>
      typeof selectedColor === "string"
        ? selectedColor
        : selectedColor?.toHexString(),
    [selectedColor]
  );
  const hexBgString = React.useMemo(
    () => (typeof bgColor === "string" ? bgColor : bgColor?.toHexString()),
    [bgColor]
  );
  const hexBtnString = React.useMemo(
    () => (typeof btnColor === "string" ? btnColor : btnColor?.toHexString()),
    [btnColor]
  );
  const fontData = useQuery({
    queryKey: ["fonts"],
    queryFn: async () => {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_URL,
        {
          method: "get",
          url: `fonts`,
        },
        router
      );

      return response;
    },
  });
  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      const file = info.file;
      let reader = new FileReader();
      reader.onload = (e) => {
        file.base64 = e.target.result.split(",")[1];
        file.fileName = file.name;
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handleLogoUpload = (info) => {
    if (info.file.status === "done") {
      const file = info.file;
      let reader = new FileReader();
      reader.onload = (e) => {
        file.base64 = e.target.result.split(",")[1];
        file.fileName = file.name;
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const addTemplateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "post",
        url: `template`,
        data,
      });

      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        dispatch({ type: "SET_FONT", selectedFont: "Roboto" });
        dispatch({ type: "SET_TEXT", text: "Your Text Here" });
        setIsBold(false);
        setIsItalic(false);
        setFontSize(24);
        setTextPosition({ x: 0, y: 100 });
        setImageSrc("");
        setImageUrl("");
        setCanvasWidth(700);
        setCanvasHeight(700);
        setCompanyName("");
        setSelectedColor("#1677FF");
        setBgColor("#f0f2f5");
        setBtnColor("#1d3541");
        message.success(e.message);
        router.back();
      }
    },
  });

  const handleSubmit = () => {
    const data = {
      text_color: hexString,
      text_size: fontSize,
      bg_img: imageSrc,
      logo_img: imageUrl,
      is_bold: isBold,
      is_italic: isItalic,
      company_name: companyName,
      text_position: textPosition,
      text_font: selectedFont,
      text_placeholder: text,
      bg_color: hexBgString,
      download_btn_color: hexBtnString,
      canvas_width: canvasWidth,
      canvas_height: canvasHeight,
    };
    addTemplateMutation.mutate(data);
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <AiOutlinePlus />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <div style={{ backgroundColor: hexBgString, borderRadius: 10 }}>
      <Flex justify="flex-start" align="center" style={{ marginBlock: "1rem" }}>
        <Card bordered={false} style={{ width: "100%" }}>
          <Row justify="start" align="middle" style={{ marginBottom: 10 }}>
            <Col xs={24} sm={6} md={4} lg={4} xl={3} xxl={3}>
              <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                accept=".png,.jpg,.jpeg"
                onChange={handleLogoUpload}
                showUploadList={false}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover", borderRadius: 50 }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={7} xxl={10}>
              <Input
                placeholder="Company Name"
                size="large"
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <Input
                style={{ marginTop: 5 }}
                placeholder="Your Text Here"
                value={text}
                size="large"
                onChange={(e) =>
                  dispatch({ type: "SET_TEXT", text: e.target.value })
                }
              />
              <Flex align="center" gap={16}>
                <InputNumber
                  min={10}
                  style={{ marginTop: 5, width: "100%" }}
                  placeholder="Width"
                  value={canvasWidth}
                  size="large"
                  onChange={(e) => setCanvasWidth(e)}
                />
                X
                <InputNumber
                  min={10}
                  style={{ marginTop: 5, width: "100%" }}
                  placeholder="Height"
                  value={canvasHeight}
                  size="large"
                  onChange={(e) => setCanvasHeight(e)}
                />
              </Flex>
            </Col>
          </Row>
          <Flex justify="space-between" align="middle" wrap="wrap" gap={16}>
            <div>
              <Flex gap={16} align="center" wrap="wrap">
                <Select
                  style={{ width: "200px" }}
                  showSearch
                  placeholder="Fonts"
                  optionFilterProp="children"
                  loading={fontData.isLoading}
                  value={selectedFont}
                  onChange={(e) =>
                    dispatch({ type: "SET_FONT", selectedFont: e })
                  }
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={fontData.data?.data}
                />
                <Button
                  type={isBold ? "primary" : "default"}
                  onClick={() => setIsBold(!isBold)}
                  style={{ fontWeight: isBold ? "bold" : "normal" }}
                >
                  B
                </Button>
                <Button
                  type={isItalic ? "primary" : "default"}
                  onClick={() => setIsItalic(!isItalic)}
                  style={{ fontStyle: isItalic ? "italic" : "normal" }}
                >
                  I
                </Button>
                <InputNumber
                  min={2}
                  max={72}
                  defaultValue={24}
                  onChange={(e) => setFontSize(e)}
                />
                <ColorPicker
                  format="hex"
                  value={selectedColor}
                  showText={() => "Text Color"}
                  onChange={setSelectedColor}
                />
                <ColorPicker
                  format="hex"
                  value={bgColor}
                  showText={() => "BG Color"}
                  onChange={setBgColor}
                />
                <ColorPicker
                  format="hex"
                  value={btnColor}
                  showText={() => "Btn Color"}
                  onChange={setBtnColor}
                />
              </Flex>
            </div>
            <div>
              <Flex gap={16} align="center">
                <Upload
                  customRequest={({ file, onSuccess }) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }}
                  accept=".png,.jpg,.jpeg"
                  onChange={handleImageUpload}
                  showUploadList={false}
                >
                  <Button
                    style={{ backgroundColor: hexBtnString }}
                    type="primary"
                    icon={<BsUpload />}
                  >
                    Upload
                  </Button>
                </Upload>

                <Button
                  htmlType="button"
                  onClick={handleSubmit}
                  type="primary"
                  loading={addTemplateMutation.isPending}
                >
                  Submit
                </Button>
              </Flex>
            </div>
          </Flex>
        </Card>
      </Flex>
      <Flex
        justify="space-around"
        align="center"
        style={{
          padding: "10px",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Canvas
          stageRef={stageRef}
          imageUrl={imageSrc === "" ? "/img.png" : imageSrc}
          text={text}
          fontFamily={selectedFont}
          fontSize={fontSize}
          fontVariant={isItalic ? "italic" : "normal"}
          fontStyle={isBold ? "bold" : "normal"}
          selectedColor={hexString}
          textPosition={textPosition}
          setTextPosition={setTextPosition}
          textRef={textRef}
          width={canvasWidth}
          height={canvasHeight}
        />
      </Flex>
    </div>
  );
};

export default Page;
