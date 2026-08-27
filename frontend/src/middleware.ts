export { default } from "next-auth/middleware"

export const config = { 
  // This tells the bouncer to protect the main page (/) 
  // Add other protected routes here if needed!
  matcher: ["/"] 
}