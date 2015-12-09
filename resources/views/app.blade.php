<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Lince</title>

	@if(Config::get('app.debug'))
		<link href="{{ asset('build/css/vendor/bootstrap.min.css') }}" rel="stylesheet">
		<link href="{{ asset('build/css/vendor/font-awesome.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/vendor/toastr.min.css') }}" rel="stylesheet">
		<link href="{{ asset('build/css/vendor/footable.core.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/vendor/animate.css') }}" rel="stylesheet">
		<link id="loadBefore" href="{{ asset('build/css/vendor/style.css') }}" rel="stylesheet">
		<link href="{{ asset('build/css/vendor/sweetalert.css') }}" rel="stylesheet">
		<link href="{{ asset('build/css/vendor/datepicker3.css') }}" rel="stylesheet">
		<link href="{{ asset('build/css/vendor/select2.min.css') }}" rel="stylesheet">
		<link href="{{ asset('build/css/vendor/chosen.css') }}" rel="stylesheet">
		<link href="{{ asset('build/css/vendor/flaticon.css') }}" rel="stylesheet"/>
		<link href="{{ asset('build/css/vendor/jquery.jspanel.css') }}" rel="stylesheet"/>
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
<body ng-controller="MenuController" ng-class="{corLogin: ($location.path() == '/login') || ($location.path() == '/cadastro')
	|| ($location.path() == '/confirmar_cadastro') || ($location.path() == '/redefinir_senha') }">
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

		<load-template url="build/views/templates/menu_.html"></load-template>

		<div id="page-wrapper" ng-style="{corLogin: ($location.path() == '/login')}">

			<!-- Page wrapper -->
			<div ng-include="'build/views/templates/topnavbar.html'"></div>

			<!-- Main view  -->
			<div ng-view></div>

			<!-- Footer
			<div ng-include="'views/common/footer.html'"></div> -->

		</div>


	</div>

	<!-- Scripts -->
	@if(Config::get('app.debug'))

		<script src="{{asset('build/js/vendor/jquery.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/jquery-ui-1.10.4.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/bootstrap.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/jquery.metisMenu.js')}}"></script>
		<script src="{{asset('build/js/vendor/jquery.slimscroll.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/inspinia.js')}}"></script>
		<script src="{{asset('build/js/vendor/pace.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/footable.all.min.js')}}"></script>


		<script src="{{asset('build/js/vendor/angular.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-route.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-ui-router.min.js')}}"></script>

		<script src="{{asset('build/js/vendor/angular-resource.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-animate.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-messages.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/ui-bootstrap-tpls.js')}}"></script>
		<script src="{{asset('build/js/vendor/navbar.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-cookies.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/query-string.js')}}"></script>
		<script src="{{asset('build/js/vendor/angular-oauth2.min.js')}}"></script>

		<script src="{{asset('build/js/vendor/http-auth-interceptor.js')}}"></script>
		<script src="{{asset('build/js/vendor/dirPagination.js')}}"></script>

		<script src="{{asset('build/js/vendor/angular-translate.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/jasny-bootstrap.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/sweetalert.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/bootstrap-datepicker.js')}}"></script>
		<script src="{{asset('build/js/vendor/select2.full.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/chosen.jquery.js')}}"></script>
		<script src="{{asset('build/js/vendor/toastr.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/jquery.validate.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/jquery.jspanel.js')}}"></script>
		<script src="{{asset('build/js/vendor/ngMask.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/morris.js')}}"></script>
		<script src="{{asset('build/js/vendor/raphael-2.1.0.min.js')}}"></script>
		<script src="{{asset('build/js/vendor/icheck.min.js')}}"></script>
		<script src="{{asset('build/js/app.js')}}"></script>

		<!-- CONTROLLERS -->
		<script src="{{asset('build/js/controllers/menu.js')}}"></script>
		<script src="{{asset('build/js/controllers/login.js')}}"></script>
		<script src="{{asset('build/js/controllers/loginModal.js')}}"></script>

		<script src="{{asset('build/js/controllers/inicioController.js')}}"></script>
		<script src="{{asset('build/js/controllers/cadastroController.js')}}"></script>
		<script src="{{asset('build/js/controllers/clienteController.js')}}"></script>
		<script src="{{asset('build/js/controllers/financeiroController.js')}}"></script>
		<script src="{{asset('build/js/controllers/usuarioController.js')}}"></script>
		<script src="{{asset('build/js/controllers/relatorioController.js')}}"></script>
		<script src="{{asset('build/js/controllers/consultaController.js')}}"></script>


		<script src="{{asset('build/js/controllers/revendedor/revendedorLista.js')}}"></script>
		<script src="{{asset('build/js/controllers/revendedor/revendedorNovo.js')}}"></script>
		<script src="{{asset('build/js/controllers/revendedor/revendedorEditar.js')}}"></script>
		<script src="{{asset('build/js/controllers/revendedor/revendedorExcluir.js')}}"></script>

		<!-- DIRECTIVES
		<script src="{{asset('build/js/directives/loginForm.js')}}"></script>-->
		<script src="{{asset('build/js/directives/loadTemplate.js')}}"></script>
		<script src="{{asset('build/js/directives/menu-activated.js')}}"></script>
		<script src="{{asset('build/js/directives/modal.js')}}"></script>
		<script src="{{asset('build/js/directives/chart.js')}}"></script>
		<script src="{{asset('build/js/directives/exportCSV.js')}}"></script>
		<script src="{{asset('build/js/directives/sideNavigation.js')}}"></script>
		<script src="{{asset('build/js/directives/geral.js')}}"></script>

		<!-- FILTROS -->
		<script src="{{asset('build/js/filters/date-br.js')}}"></script>
		<script src="{{asset('build/js/filters/price.js')}}"></script>

		<!-- SERVICES -->
		<script src="{{asset('build/js/services/oauthFixInterceptor.js')}}"></script>
		<script src="{{asset('build/js/services/cliente.js')}}"></script>
		<script src="{{asset('build/js/services/revendedor.js')}}"></script>
		<script src="{{asset('build/js/services/user.js')}}"></script>
		<script src="{{asset('build/js/services/usuarioService.js')}}"></script>
		<script src="{{asset('build/js/services/cadastro.js')}}"></script>
		<script src="{{asset('build/js/services/financeiroService.js')}}"></script>
		<script src="{{asset('build/js/services/vendedorService.js')}}"></script>
		<script src="{{asset('build/js/services/inicioService.js')}}"></script>


		<script>
			function login(){
				var onSuccessCallback = function(data) {
					$rootScope.currentUserSignedIn = true;
					$rootScope.currentUser.name = data.name;
				};
				// Login function to the server comes here
			}
		</script>

	@else
		<script src="{{elixir('js/all.js')}}"></script>
	@endif
</>
</html>
