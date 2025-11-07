<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo mensaje de contacto - XpressUTC</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #22c55e; margin-top: 0;">Nuevo mensaje de contacto</h1>
        <p style="margin: 0; color: #666;">Has recibido un nuevo mensaje desde el formulario de contacto de XpressUTC</p>
    </div>

    <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Nombre:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">{{ $name }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Correo:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                    <a href="mailto:{{ $email }}" style="color: #22c55e; text-decoration: none;">{{ $email }}</a>
                </td>
            </tr>
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Asunto:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">{{ $subject }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Mensaje:</td>
                <td style="padding: 10px 0; white-space: pre-wrap;">{{ $message }}</td>
            </tr>
        </table>
    </div>

    <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666;">
        <p style="margin: 0;">Este mensaje fue enviado desde el formulario de contacto de XpressUTC.</p>
        <p style="margin: 5px 0 0 0;">Puedes responder directamente a este correo para contactar al remitente.</p>
    </div>
</body>
</html>

