import { defineConfig, type Preset } from "@vite-pwa/assets-generator/config";

const customPreset: Preset = {
  transparent: {
    sizes: [64, 96, 192, 512],
    favicons: [[64, "favicon.ico"]],
  },
  apple: {
    sizes: [180],
  },
  maskable: {
    sizes: [512],
  },
  assetName: (type, size) => {
    switch (type) {
      case "apple":
        return "apple-touch-icon.png";
      case "transparent":
        if (size.width === 64) return "favicon-64x64.png";
        if (size.width === 96) return "favicon-96x96.png";
        return `web-app-manifest-${size.width}x${size.height}.png`;
      case "maskable":
        return `web-app-manifest-${size.width}x${size.height}-maskable.png`;
      default:
        return `${type}-${size.width}x${size.height}.png`;
    }
  },
};

export default defineConfig({
  preset: customPreset,
  images: ["treeentertainment_v2.svg"],
});
