<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" ng-app="app">
<head>
    <link href="http://69.64.57.205:8010/lince/bootstrap.min.css" rel="stylesheet" />
    <link href="http://69.64.57.205:8010/lince/style.css" rel="stylesheet" />

</head>

<body style="background: #3B3B3B">

</br></br></br>
<div align="middle" >
    <img class="img-responsive" src="http://69.64.57.205:8010/lince/logo.png"/>
</div>
</br></br>

<div class="centered">
    <table class="body-wrap">
        <tr>
            <td></td>
            <td class="container" style="background: #F3F3F4; border-radius: 0px 30px;">
                <div class="content">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="content-wrap">
                                <table  cellpadding="0" cellspacing="0" style="text-align:center;">
                                    <tr>
                                        <td class="content-block">
                                            <br>
                                            <h2>Bem vindo ao sistema Lince,  <strong>{{ $nome }}!</strong> </h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <br>
                                            Para sua segurança, proteção de sua conta e garantir a recuperação da senha em caso de problemas,
                                            <p>estamos solicitando que confirme o endereço de e-mail.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            Por favor, confirme seu endereço de e-mail: <b>{{$email}}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block aligncenter">
                                            <br>
                                            <a href="http://localhost:8000/#/confirmar_cadastro?cnpj={{$cnpj}}&id={{$token}}">
                                                <button class="btn block full-width m-b" style="background: #FBCA24; color: #ffffff;">CLIQUE AQUI PARA CONFIRMAR SEU E-MAIL</button>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr></tr>
                                    <tr></tr>
                                    <tr>
                                        <td class="content-block aligncenter">
                                            <br>
                                            <b>Não sabe por que recebeu este e-mail?</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block aligncenter">
                                            Este e-mail é enviado quando um novo cadastro é feito no sistema <strong>Lince</strong>.
                                            <p>Se este não é o seu caso, não se preocupe. Seu endereço de e-mail não pode ser usado
                                            <br>como um endereço de contato do sistema Lince sem a sua confirmação.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block aligncenter">
                                            <br>
                                            Para maiores informações, entre em contato com nosso suporte através do e-mail: suporte@linceconsultadedados.com.br
                                            <br>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block aligncenter">
                                            <br>
                                            <br>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <div class="footer">
                        <table width="100%">
                            <tr>
                                <td class="aligncenter content-block">Equipe Lince Consulta de Dados.</td>
                                <td class="aligncenter content-block pull-right">2015 - 2016</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
</div>

</body>
</html>
