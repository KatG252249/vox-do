import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", 
  },
});

export const config = {
  // Protects the main dashboard page.
  matcher: ["/"], 
};