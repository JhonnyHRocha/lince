<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Lince | Login</title>

    <link href="{{ asset('build/css/vendor/bootstrap.min.css') }}" rel="stylesheet"/>
    <link href="{{ asset('build/css/font-awesome.css') }}" rel="stylesheet"/>
    <link href="{{ asset('build/css/animate.css') }}" rel="stylesheet"/>
    <link href="{{ asset('build/css/style.css') }}" rel="stylesheet"/>

</head>

<body class="gray-bg">

<div class="middle-box text-center loginscreen animated fadeInDown">
    <div>
        <div>

            <h1 class="logo-name">IN+</h1>

        </div>
        <h3>Bem vindo ao sistema Lince</h3>
        <form class="m-t" role="form" action="./#/home">
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Usuário" required="">
            </div>
            <div class="form-group">
                <input type="password" class="form-control" placeholder="Senha" required="">
            </div>
            <button type="submit" class="btn btn-primary block full-width m-b">Entrar</button>

            <a href="#"><small>Esqueceu a senha?</small></a>
            <p class="text-muted text-center"><small>Ainda não possui uma conta?</small></p>
            <a class="btn btn-sm btn-white btn-block" href="register.html">Criar uma conta</a>
        </form>
    </div>
</div>

<!-- Mainly scripts -->
<script src="{{asset('build/js/vendor/jquery.min.js')}}"></script>
<script src="{{asset('build/js/vendor/bootstrap.min.js')}}"></script>

</body>

</html>
