export const InvoiceMail = (nama, alamat, notelp, invoice, tanggal, data, ongkir, total, email, potongan, PPN) => {
    return(
        `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:sans-serif">
            <head>
                <meta charset="UTF-8">
                <meta content="width=device-width, initial-scale=1" name="viewport">
                <meta name="x-apple-disable-message-reformatting">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta content="telephone=no" name="format-detection">
                <title>Document</title>
                <style type="text/css">
                    html {
                        font-family: sans-serif;
                    }
                    @media screen and (max-width: 768px) {
                        html {
                            font-size: 1px !important;
                        }
                    }
                </style>
            </head>
            <body style='font-size:5vw;'>
                <table class="table" role="presentation" style="width: 100%;
                    border-collapse: collapse;
                    border-spacing: 0;
                    background-color: #ffffff; border: 1px solid #cccccc; padding: 20px 0;">
                    <tr>
                        <td style="padding: 0;" align="center">
                            <table role="presentation" class="table maintable" style="width: 100%;
                                border-collapse: collapse;
                                border-spacing: 0;
                                background-color: #ffffff; border: 1px solid #cccccc; width: 800px;">
                                <tr>
                                    <td style="padding: 0; background-color: #384aeb;
                                        color: #ffffff;" class="header">
                                        <p style='margin-left: 10px;
                                            font-size: 30px;'>
                                            BukuBook
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0;" class="body" align="center">
                                        <table class="initable" style="width: 100%;
                                            border-collapse: collapse;
                                            border-spacing: 0;
                                            background-color: #ffffff; font-size:20px;">
                                            <tr>
                                                <td style="padding: 0; font-size: 25px;
                                                    padding-bottom: 20px;
                                                    color: #384aeb;" align="center" class="invoice" colspan="2">Invoice No. ${invoice}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0; font-size: 20px;
                                                padding-bottom: 25px;" align="center" class="ty" colspan="2">Hai, ${nama} <br>Terima kasih telah mempercayai kami</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0; padding-bottom: 10px; padding-left: 25px;" class="info infol">
                                                    Nama: ${nama}
                                                </td>
                                                <td style="padding: 0; padding-bottom: 10px; padding-right: 25px;" align="right" class="infor">
                                                    Tanggal: ${tanggal}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0; padding-bottom: 10px; padding-left: 25px;" class="info infol">
                                                    Alamat: ${alamat}
                                                </td>
                                                <td style="padding: 0; padding-bottom: 10px; padding-right: 25px;" align="right" class="infor">
                                                    Invoice: ${invoice}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0; padding-bottom: 10px; padding-left: 25px;" class="info infol">
                                                    Nomor HP: ${notelp}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0; padding-bottom: 10px; padding-left: 25px;" class="info infol">
                                                    Email: ${email}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding:0 25px;">
                                                    <table class="tabledetail" style="width: 100%;
                                                        border-collapse: collapse;
                                                        border-spacing: 0;
                                                        background-color: #ffffff; border: 1px solid #333333;
                                                        padding: 10px; font-size:20px;">
                                                        <tr>
                                                            <th class="thdetail" style='border: 1px solid #333333;
                                                                padding: 10px;'>
                                                                #
                                                            </th>
                                                            <th class="thdetail" style='border: 1px solid #333333;
                                                                padding: 10px;'>
                                                                Deskripsi
                                                            </th>
                                                            <th class="thdetail" style='border: 1px solid #333333;
                                                                padding: 10px;'>
                                                                Jumlah
                                                            </th>
                                                            <th class="thdetail" style='border: 1px solid #333333;
                                                                padding: 10px;'>
                                                                Subtotal
                                                            </th>
                                                        </tr>
                                                        ${data}
                                                        <tr>
                                                            <td style="padding: 0;" colspan="2">
        
                                                            </td>
                                                            <td style="padding: 0; border: 1px solid #333333;
                                                                padding: 10px;" class="tddetail" align="center">
                                                                Ongkir
                                                            </td>
                                                            <td style="padding: 0; border: 1px solid #333333;
                                                                padding: 10px;" class="tddetail" align="center">
                                                                Rp ${ongkir}
                                                            </td>
                                                        </tr>
                                                        ${potongan}
                                                        <tr>
                                                            <td style="padding: 0;" colspan="2">
        
                                                            </td>
                                                            <td style="padding: 0; border: 1px solid #333333;
                                                                padding: 10px;" class="tddetail" align="center">
                                                                PPN
                                                            </td>
                                                            <td style="padding: 0; border: 1px solid #333333;
                                                                padding: 10px;" class="tddetail" align="center">
                                                                Rp ${PPN}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 0;" colspan="2">
        
                                                            </td>
                                                            <td style="padding: 0; border: 1px solid #333333;
                                                                padding: 10px;" class="tddetail" align="center">
                                                                Total
                                                            </td>
                                                            <td style="padding: 0; border: 1px solid #333333;
                                                                padding: 10px;" class="tddetail" align="center">
                                                                Rp ${total}
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0; background-color: #002347;
                                        color: #7b838a; font-size:20px;" class="footer" align="center">
                                        <p>
                                            BukuBook
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
        `
    )
}