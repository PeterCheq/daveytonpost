function getPortUrl() {
  //  Check if we're in a browser enviroment
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // priority order for production Urls
    // 1. Custome domain (recomendated for production)

    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }
    // 2. Server port IP address
    if (process.env.NEXT_PUBLIC_SERVER_URL) {
      return process.env.NEXT_PUBLIC_SERVER_URL;
    }
    // 3. Vercel Url (auto-generated)
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    // 4. Vercel project Url (more reliable)
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    throw new Error(
      "No production URL configured. Please set NEXT_PUBLIC_APP_URL environment variable."
    );
  }
  return "http://localhost:3000";
}

export default getPortUrl;
