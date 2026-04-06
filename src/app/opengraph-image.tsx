import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "My Blog — 个人技术博客";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #18181b 0%, #27172e 50%, #18181b 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "800",
              background: "linear-gradient(to right, #a78bfa, #e879f9, #f472b6)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            MyBlog
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a1a1aa",
              letterSpacing: "0.05em",
            }}
          >
            分享前端开发、技术思考与学习笔记
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
