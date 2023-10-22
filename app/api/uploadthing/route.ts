import { createNextRouteHandler } from "uploadthing/next";

import { myFileRouter } from "./core";

export const { GET, POST } = createNextRouteHandler({
  router: myFileRouter,
});
