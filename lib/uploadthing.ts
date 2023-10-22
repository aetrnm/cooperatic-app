import { generateComponents } from "@uploadthing/react";

import type { myFileRouter } from "@/app/api/uploadthing/core";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<myFileRouter>();
