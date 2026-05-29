const accountApproved = () => ({
  subject: "¡Tu cuenta fue aprobada!",
  html: `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>¡Bienvenido a PoleBid!</h2>
      <p>Tu cuenta fue revisada y aprobada exitosamente.</p>
      <p>Ya podés ingresar a la plataforma y completar tu registro.</p>
    </div>
  `,
});

export default accountApproved;
