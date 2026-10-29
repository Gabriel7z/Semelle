import type { NextConfig } from "next"
import { pagesBasePath } from "./src/lib/site"

const dev = process.env.NODE_ENV === "development"
const basePath = dev ? "" : pagesBasePath

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  ...(basePath ? { basePath } : {}),
}

export default nextConfig
