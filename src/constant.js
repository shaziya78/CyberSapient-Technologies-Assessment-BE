export const cookiesOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
};

export const corsOptions = {
  origin: ["http://localhost:5173", "https://cyber-sapient-technologies-assessme.vercel.app"],
  credentials: true,
};
