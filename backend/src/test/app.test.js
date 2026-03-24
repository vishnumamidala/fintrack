import { describe, expect, it } from "vitest";
import { notFoundMiddleware } from "../middleware/notFoundMiddleware.js";

describe("notFoundMiddleware", () => {
  it("returns a consistent JSON error payload", () => {
    const req = { originalUrl: "/missing-route" };
    const response = {
      statusCode: null,
      payload: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.payload = body;
        return this;
      },
    };

    notFoundMiddleware(req, response);

    expect(response.statusCode).toBe(404);
    expect(response.payload.success).toBe(false);
    expect(response.payload.error.message).toContain("/missing-route");
  });
});
