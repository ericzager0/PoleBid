const verificationCode = ({ code }) => ({
  subject: "Tu código de verificación",
  html: `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Verificá tu email</h2>
      <p>Tu código de verificación es:</p>
      <h1 style="letter-spacing: 8px; color: #4F46E5;">${code}</h1>
      <p>Expira en 15 minutos.</p>
    </div>
  `,
});

export default verificationCode;
