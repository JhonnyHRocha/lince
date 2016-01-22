<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" ng-app="app">
<head>
    <link href="http://app.linceconsultadedados.com.br:8010/lince/bootstrap.min.css" rel="stylesheet" />
    <link href="http://app.linceconsultadedados.com.br:8010/lince/style.css" rel="stylesheet" />

</head>

<body style="background: #3B3B3B">

</br></br></br>
<div align="middle" >
    <img class="img-responsive" src="http://app.linceconsultadedados.com.br:8010/lince/logo.png"/>
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
                                <table  cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td class="content-block">
                                            <br>
                                            <h3>Prezado(a) <strong>{{$nome}},</strong> </h3>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <br>
                                            <p>Recentemente, você iniciou uma redefinição de senha para seu cadastro do sistema Lince.
                                                <br>Para concluir o processo, clique no botão abaixo e informe o seguinte token: <h3 style="text-align:center;"><strong>{{$token}}</strong></h3>
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block aligncenter">
                                            <br>
                                            <a href="http://app.linceconsultadedados.com.br/#/redefinir_senha?usuario={{$login}}">
                                                <button class="btn block full-width m-b" style="background: #FBCA24; color: #ffffff;">CLIQUE AQUI PARA REDEFINIR SUA SENHA</button>
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
                                            <p>
                                                Caso não tenha feito essa solicitação, é provável que outro usuário tenha inserido
                                                <br>seu endereço de e-mail por engano e sua conta inda está protegida. Se você acredita
                                                <br>que uma pessoa não autorizadda acessou sua conta, é possível redefinr sua senha
                                                <br>através do painel do sistema.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                <br><br>
                                                Atencionsamente,
                                                <br>Suporte da Equipe Lince Consulta de Dados
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                            <br>
                                            <font size="1">Para maiores informações, entre em contato com nosso suporte através do e-mail: suporte@linceconsultadedados.com.br</font>
                                            <br>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block aligncenter">
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
