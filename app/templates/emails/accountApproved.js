const accountApproved = (loginUrl) => ({
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
                  ✅
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

                <p
                  style="
                    margin:0 0 32px;
                    text-align:center;
                    color:#666;
                    font-size:16px;
                    line-height:26px;
                  "
                >
                  Ya podés ingresar a la plataforma y comenzar a participar en las próximas subastas.
                </p>

                <div
                  style="
                    background:#FAF7EF;
                    border-left:4px solid #C8A64B;
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

                <div style="text-align:center;">
                  <a
                    href="${loginUrl}"
                    style="
                      display:inline-block;
                      background:#C8A64B;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 32px;
                      border-radius:8px;
                      font-size:16px;
                      font-weight:bold;
                    "
                  >
                    Ingresar a PoleBid
                  </a>
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
});

export default accountApproved;