<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Laravel</title>

	@if(Config::get('app.debug'))
		<!--<link href="{{ asset('build/css/app.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/components.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/flaticon.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/font-awesome.css') }}" rel="stylesheet"/>-->

		<link href="{{ asset('build/css/vendor/bootstrap.min.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/vendor/metisMenu.min.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/vendor/timeline.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/vendor/sb-admin-2.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/vendor/morris.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/vendor/font-awesome.min.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/vendor/bootstrap-social.css') }}" rel="stylesheet"/>
	@else
		<link href="{{ elixir('css/all.css') }}" rel="stylesheet"/>
	@endif

	<!-- Fonts -->
	<link href='//fonts.googleapis.com/css?family=Roboto:400,300' rel='stylesheet' type='text/css'>

	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->
</head>
<body>
	<div id="wrapper">
	<!--<nav class="navbar navbar-default">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">
					<span class="sr-only">Toggle Navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#">Lince</a>
			</div>

			<div class="collapse navbar-collapse" id="navbar">
				<ul class="nav navbar-nav">
					<li><a href="{{ url('/') }}">Welcome</a></li>
				</ul>

				<ul class="nav navbar-nav navbar-right">
					@if(auth()->guest())
						@if(!Request::is('auth/login'))
							<li><a href="{{ url('/auth/login') }}">Login</a></li>
						@endif
						@if(!Request::is('auth/register'))
							<li><a href="{{ url('/auth/register') }}">Register</a></li>
						@endif
					@else
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{{ auth()->user()->name }} <span class="caret"></span></a>
							<ul class="dropdown-menu" role="menu">
								<li><a href="{{ url('/auth/logout') }}">Logout</a></li>
							</ul>
						</li>
					@endif
				</ul>
			</div>
		</div>
	</nav>-->

	<!-- Navigation -->
		<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#/home">Lince</a>
			</div>
			<!-- /.navbar-header -->

			<ul class="nav navbar-top-links navbar-right">
				<!-- /.dropdown -->
				<li class="dropdown">
					<a class="dropdown-toggle" data-toggle="dropdown" href="#">
						<i class="fa fa-user fa-fw"></i>  <i class="fa fa-caret-down"></i>
					</a>
					<ul class="dropdown-menu dropdown-user">
						<li><a href="#"><i class="fa fa-user fa-fw"></i> Perfil de Usuário</a>
						</li>
						<li><a href="#"><i class="fa fa-gear fa-fw"></i> Configurações</a>
						</li>
						<li class="divider"></li>
						<li><a href="login.html"><i class="fa fa-sign-out fa-fw"></i> Logout</a>
						</li>
					</ul>
					<!-- /.dropdown-user -->
				</li>
				<!-- /.dropdown -->
			</ul>
			<!-- /.navbar-top-links -->
			<div class="navbar-default sidebar" role="navigation">
				<div class="sidebar-nav navbar-collapse">
					<ul class="nav" id="side-menu">
						<li>
							<a href="#/home"><i class="fa fa-home fa-fw"></i> Início</a>
						</li>

						<li>
							<a href="index.html"><i class="fa fa-eye fa-fw"></i> Consultas</a>
						</li>

						<li>
							<a href="/#/cadastros/"><i class="fa fa-male fa-fw"></i> Cadastros<span class="fa arrow"></span></a>
							<ul class="nav nav-second-level">
								<li>
									<a href="/#/clientes">Cadastro de Clientes</a>
								</li>
								<li>
									<a href="/#/usuarios">Cadastro de Usuários</a>
								</li>
								<li>
									<a href="/#/revendedores">Cadastro de Revendedores</a>
								</li>
							</ul>
							<!-- /.nav-second-level -->
						</li>

						<li>
							<a href="/#/financeiro"><i class="fa fa-money fa-fw"></i> Financeiro <span class="fa arrow"></span></a>
							<ul class="nav nav-second-level">
								<li>
									<a href="flot.html">Comissão a Pagar</a>
								</li>
								<li>
									<a href="flot.html">Emissão de Boletos</a>
								</li>
								<li>
									<a href="flot.html">Resumo Mensal</a>
								</li>
							</ul>
							<!-- /.nav-second-level -->
						</li>

						<li>
							<a href="/#/relatorios"><i class="fa fa-file-pdf-o fa-fw"></i> Relatórios <span class="fa arrow"></span></a>
							<ul class="nav nav-second-level">
								<li>
									<a href="flot.html">Consultas</a>
								</li>
								<li>
									<a href="flot.html">Relatório por Cliente</a>
								</li>
								<li>
									<a href="flot.html">Relatório por Usuários</a>
								</li>
								<li>
									<a href="flot.html">Relatório de Vendas</a>
								</li>
								<li>
									<a href="flot.html">Relatório de Vendas por Revendedor</a>
								</li>
							</ul>
							<!-- /.nav-second-level -->
						</li>
					</ul>
				</div>
				<!-- /.sidebar-collapse -->
			</div>
			<!-- /.navbar-static-side -->
		</nav>

		<div id="page-wrapper">
			<div ng-view></div>
		</div>


	</div>

	<!-- Scripts -->
	@if(Config::get('app.debug'))
		<script src="{{asset('build/js/vendor/jquery.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-route.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-resource.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-animate.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-messages.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/ui-bootstrap.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/navbar.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-cookies.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/query-string.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-oauth2.min.js')}}"></script>

		<script src="{{asset('build/js/vendor/bootstrap.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/metisMenu.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/sb-admin-2.js')}}"></script>
		<script src="{{asset('build/js/vendor/raphael-min.js')}}"></script>
		<script src="{{asset('build/js/vendor/morris.min.js')}}"></script>
		<!--<script src="{{asset('build/js/vendor/morris-data.js')}}"></script>-->

		<script src="{{asset('build/js/app.js')}}"></script>

		<!-- CONTROLLERS -->
		<script src="{{asset('build/js/controllers/home.js')}}"></script>
		<script src="{{asset('build/js/controllers/login.js')}}"></script>
		<script src="{{asset('build/js/controllers/cliente/clienteLista.js')}}"></script>
		<script src="{{asset('build/js/controllers/cliente/clienteNovo.js')}}"></script>
		<script src="{{asset('build/js/controllers/cliente/clienteEditar.js')}}"></script>
		<script src="{{asset('build/js/controllers/cliente/clienteExcluir.js')}}"></script>
		<script src="{{asset('build/js/controllers/revendedor/revendedorLista.js')}}"></script>
		<script src="{{asset('build/js/controllers/revendedor/revendedorNovo.js')}}"></script>
		<script src="{{asset('build/js/controllers/revendedor/revendedorEditar.js')}}"></script>
		<script src="{{asset('build/js/controllers/revendedor/revendedorExcluir.js')}}"></script>

		<!-- FILTROS -->
		<script src="{{asset('build/js/filters/date-br.js')}}"></script>

		<!-- SERVICES -->
		<script src="{{asset('build/js/services/cliente.js')}}"></script>
		<script src="{{asset('build/js/services/revendedor.js')}}"></script>
		<script src="{{asset('build/js/services/user.js')}}"></script>
	@else
		<script src="{{elixir('js/all.js')}}"></script>
	@endif
</body>
</html>
