"use client";
import apiRequest from "@/context/apiRequest";
import { decryptUrl } from "@/context/decryptUrl";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useStateValue } from "@/context/GlobalContextProvider";
import Loading from "./loading";
const PublicLayout = (props) => {
  const [id, setId] = useState(null);
  const params = useParams();
  const pathname = useSearchParams();
  const [{}, dispatch] = useStateValue();
  useEffect(() => {
    if (params.id) {
      const decryptedUrl = decryptUrl(params.id, pathname.get("title"));
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${pathname.get(
        "f"
      )}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      setId(decryptedUrl);
    }
  }, []);
  const { isPending } = useQuery({
    queryKey: ["publicForm", id],
    queryFn: async () => {
      const response = await apiRequest(process.env.NEXT_PUBLIC_URL, {
        method: "get",
        url: `template?id=${id}`,
      });

      dispatch({ type: "SET_TEMPLATE", isTemplate: response });
      return response.data;
    },
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
  });
  return isPending ? (
    <Loading />
  ) : (
    <div>
      <Suspense fallback={<Loading />}> {props.children}</Suspense>
    </div>
  );
};

export default PublicLayout;
