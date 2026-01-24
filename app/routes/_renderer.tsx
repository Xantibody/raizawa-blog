import { jsxRenderer } from "hono/jsx-renderer";

export default jsxRenderer(({ children }) => <>{children}</>, { docType: true });
