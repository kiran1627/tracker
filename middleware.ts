import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/habits/:path*",
    "/goals/:path*",
    "/tasks/:path*",
    "/calendar/:path*",
    "/progress/:path*",
    "/notes/:path*",
    "/achievements/:path*",
    "/settings/:path*"
  ],
};
