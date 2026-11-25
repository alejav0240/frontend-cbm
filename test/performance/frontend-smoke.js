import http from "k6/http";
import { check, sleep } from "k6";

const baseUrl = (__ENV.STAGING_URL || "").replace(/\/+$/, "");

if (!baseUrl) {
  throw new Error("STAGING_URL is required");
}

export const options = {
  vus: 5,
  duration: "30s",
  thresholds: {
    checks: ["rate>0.99"],
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1500"],
  },
};

export default function frontendSmoke() {
  const response = http.get(`${baseUrl}/login`, {
    tags: { endpoint: "login" },
  });

  check(response, {
    "login returns HTTP 200": (result) => result.status === 200,
    "login returns HTML": (result) =>
      String(result.headers["Content-Type"] || "").includes("text/html"),
  });

  sleep(1);
}
