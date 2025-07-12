export const cookiesOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
};

export const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://cyber-sapient-technologies-assessme.vercel.app",
  ],
  credentials: true,
};
