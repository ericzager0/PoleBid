const verificationCode = ({ code }) => ({
  subject: "Verificá tu cuenta en PoleBid",

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

                <h2
                  style="
                    margin:0 0 16px;
                    text-align:center;
                    color:#222;
                    font-size:28px;
                  "
                >
                  Verificá tu email
                </h2>

                <p
                  style="
                    margin:0 0 32px;
                    text-align:center;
                    color:#666;
                    font-size:16px;
                    line-height:24px;
                  "
                >
                  Ingresá el siguiente código para completar la verificación de tu cuenta.
                </p>

                <div
                  style="
                    background:#FAF7EF;
                    border:2px solid #E8B439;
                    border-radius:12px;
                    padding:28px;
                    text-align:center;
                    margin-bottom:30px;
                  "
                >
                  <span
                    style="
                      font-size:42px;
                      font-weight:bold;
                      letter-spacing:12px;
                      color:#111;
                    "
                  >
                    ${code}
                  </span>
                </div>

                <p
                  style="
                    text-align:center;
                    color:#666;
                    font-size:14px;
                    margin:0;
                  "
                >
                  Este código expirará en <strong>15 minutos</strong>.
                </p>

                <p
                  style="
                    text-align:center;
                    color:#999;
                    font-size:13px;
                    margin-top:24px;
                    line-height:20px;
                  "
                >
                  Si no solicitaste este código, simplemente ignorá este correo.
                </p>

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
                "
              >
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

export default verificationCode;