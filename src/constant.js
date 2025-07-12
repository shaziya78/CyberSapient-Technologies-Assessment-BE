export const cookiesOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
};

export const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
