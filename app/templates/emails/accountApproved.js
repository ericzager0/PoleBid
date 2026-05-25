const accountApproved = ({ name }) => ({
  subject: "¡Tu cuenta fue aprobada!",
  html: `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>¡Bienvenido, ${name}!</h2>
      <p>Tu cuenta fue revisada y aprobada exitosamente.</p>
      <p>Ya podés ingresar a la plataforma.</p>
    </div>
  `,
});

export default accountApproved;
