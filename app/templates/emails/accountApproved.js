const categoryStyles = {
  comun: {
    label: "Común",
    bg: "#F3F4F6",
    color: "#6B7280",
    border: "#D1D5DB",
  },
  especial: {
    label: "Especial",
    bg: "#EFF6FF",
    color: "#2563EB",
    border: "#93C5FD",
  },
  plata: {
    label: "Plata",
    bg: "#F1F5F9",
    color: "#64748B",
    border: "#CBD5E1",
  },
  oro: {
    label: "Oro",
    bg: "#FFF8E1",
    color: "#B7791F",
    border: "#E8B439",
  },
  platino: {
    label: "Platino",
    bg: "#F8FAFC",
    color: "#475569",
    border: "#94A3B8",
  },
};

const accountApproved = (data) => {
  const { categoria } = data;
  const style = categoryStyles[categoria] || categoryStyles.comun;

  return {
    subject: "¡Tu cuenta fue aprobada en PoleBid!",

    html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body style="margin:0;padding:0;background:#f5f5f5;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr>
        <td align="center">

          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background:#ffffff;
              border-radius:16px;
              overflow:hidden;
              font-family:Arial, Helvetica, sans-serif;
            "
          >

            <!-- HEADER -->
            <tr>
              <td
                align="center"
                style="
                  background:#000000;
                  padding:32px;
                "
              >
                <h1
                  style="
                    margin:0;
                    color:#C8A64B;
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:1px;
                  "
                >
                  PoleBid
                </h1>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:48px 40px;">

                <div
                  style="
                    text-align:center;
                    font-size:56px;
                    margin-bottom:20px;
                  "
                >
                </div>

                <h2
                  style="
                    margin:0 0 20px;
                    text-align:center;
                    color:#222;
                    font-size:30px;
                  "
                >
                  ¡Cuenta aprobada!
                </h2>

                <p
                  style="
                    margin:0 0 20px;
                    text-align:center;
                    color:#666;
                    font-size:16px;
                    line-height:26px;
                  "
                >
                  Tu solicitud fue revisada y aprobada exitosamente.
                </p>

                <!-- CATEGORÍA ASIGNADA -->
                <div style="text-align:center; margin-bottom:24px;">
                  <p
                    style="
                      margin:0 0 10px;
                      color:#999;
                      font-size:13px;
                      text-transform:uppercase;
                      letter-spacing:1px;
                    "
                  >
                    Categoría asignada
                  </p>
                  <span
                    style="
                      display:inline-block;
                      background:${style.bg};
                      color:${style.color};
                      border:1px solid ${style.border};
                      border-radius:20px;
                      padding:8px 24px;
                      font-size:16px;
                      font-weight:bold;
                      letter-spacing:0.5px;
                    "
                  >
                    ${style.label}
                  </span>
                </div>

                <p
                  style="
                    margin:0 0 32px;
                    text-align:center;
                    color:#666;
                    font-size:16px;
                    line-height:26px;
                  "
                >
                  Ya podés ingresar a la app y comenzar a participar en las próximas subastas.
                </p>

                <div
                  style="
                    background:#FAF7EF;
                    border-left:4px solid #E8B439;
                    border-radius:8px;
                    padding:18px;
                    margin-bottom:32px;
                    color:#444;
                    font-size:15px;
                    line-height:24px;
                  "
                >
                  <strong>Próximo paso:</strong><br>
                  Completá tu perfil y explorá las oportunidades disponibles dentro de PoleBid.
                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td
                align="center"
                style="
                  background:#f8f8f8;
                  padding:24px;
                  color:#888;
                  font-size:12px;
                  line-height:20px;
                "
              >
                Este es un correo automático, por favor no respondas a este mensaje.
                <br><br>
                © ${new Date().getFullYear()} PoleBid · Todos los derechos reservados
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
  };
};

export default accountApproved;
