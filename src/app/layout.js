import "./globals.css";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { GlobalContextProvider } from "@/context/GlobalContextProvider";
import reducer, { initState } from "@/context/reducer";
import QueryProvider from "@/context/QueryProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
export const metadata = {
  title: "EV-CARD",
  description: "Event Card Template Generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#143642",
                // fontFamily: "Montserrat",
              },
              components: {
                Segmented: {
                  colorBgElevated: "#E4E835",
                },
              },
            }}
          >
            <GlobalContextProvider reducer={reducer} initialState={initState}>
              <AntdRegistry>{children}</AntdRegistry>
            </GlobalContextProvider>
          </ConfigProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
