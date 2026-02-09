import { createRoute } from "honox/factory";
import { SITE_URL } from "../lib/config";
import { HTTP_OK } from "../lib/http";

export default createRoute((c) => {
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml`;

  return c.body(robotsTxt, HTTP_OK, {
    "Content-Type": "text/plain; charset=utf-8",
  });
});
