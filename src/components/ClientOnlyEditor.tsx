"use client";

import dynamic from "next/dynamic";
import { TABS, TOOLS } from "react-filerobot-image-editor";

const FilerobotImageEditor = dynamic(
  () => import("react-filerobot-image-editor"),
  { ssr: false }
);

interface Props {
  source: string;
  label?: string;
  onSave: (imageBase64: string) => void;
  onClose: () => void;
}

export default function ClientOnlyEditor({ source, label, onSave, onClose }: Props) {
  if (typeof window === "undefined") return null;

  return (
    <FilerobotImageEditor
      source={source}
      onSave={({ imageBase64 }) => {
        if (imageBase64) onSave(imageBase64);
      }}
      onClose={onClose}
      annotationsCommon={{ fill: "#ff0000" }}
      Text={{ text: label || "Kommentar" }}
      tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK]}
      defaultTabId={TABS.ADJUST}
      defaultToolId={TOOLS.CROP}
      savingPixelRatio={1}
      previewPixelRatio={1}
    />
  );
}
