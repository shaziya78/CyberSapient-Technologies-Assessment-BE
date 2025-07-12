export const cookiesOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: 'None',
};

export const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://cyber-sapient-technologies-assessme-jade.vercel.app",
    "guileless-meringue-086640.netlify.app"
  ],
  credentials: true,
};
