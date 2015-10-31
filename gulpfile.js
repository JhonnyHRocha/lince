var elixir = require('laravel-elixir'),
    liveReload = require('gulp-livereload'),
    clean = require('rimraf'),
    gulp = require('gulp');


var config = {
    assets_path: './resources/assets',
    build_path: './public/build'
};

config.bower_path = config.assets_path + '/../bower_components';

//CAMINHO DOS ARQUIVOS DE JAVASCRIPT E JAVASCRIPT DE TERCEIROS QUE VAO FICAR NA PASTA PUBLIC
config.build_path_js = config.build_path + '/js';
config.build_vendor_path_js = config.build_path_js + '/vendor';
config.vendor_path_js = [
    config.bower_path + '/jquery/dist/jquery.min.js',
    config.bower_path + '/bootstrap/dist/js/bootstrap.min.js',
    config.bower_path + '/angular/angular.min.js',
    config.bower_path + '/angular-route/angular-route.min.js',
    config.bower_path + '/angular-resource/angular-resource.min.js',
    config.bower_path + '/angular-animate/angular-animate.min.js',
    config.bower_path + '/angular-messages/angular-messages.min.js',
    config.bower_path + '/angular-bootstrap/ui-bootstrap-tpls.js',
    config.bower_path + '/angular-strap/dist/modules/navbar.min.js',
    config.bower_path + '/angular-cookies/angular-cookies.min.js',
    config.bower_path + '/query-string/query-string.js',
    config.bower_path + '/angular-oauth2/dist/angular-oauth2.min.js',
    config.bower_path + '/angular-http-auth/src/http-auth-interceptor.js',
    config.bower_path + '/angularUtils-pagination/dirPagination.js',


    //INSPINIA
    config.bower_path + '/inspinia/js/jquery-ui-1.10.4.min.js',
    config.bower_path + '/inspinia/js/plugins/metisMenu/jquery.metisMenu.js',
    config.bower_path + '/inspinia/js/plugins/slimscroll/jquery.slimscroll.min.js',
    config.bower_path + '/inspinia/js/plugins/pace/pace.min.js',
    config.bower_path + '/inspinia/js/inspinia.js',
    config.bower_path + '/inspinia/js/plugins/jasny/jasny-bootstrap.min.js',
    config.bower_path + '/inspinia/js/plugins/sweetalert/sweetalert.min.js',
    config.bower_path + '/inspinia/js/plugins/datapicker/bootstrap-datepicker.js',
    config.bower_path + '/inspinia/js/plugins/select2/select2.full.min.js',
    config.bower_path + '/inspinia/js/plugins/chosen/chosen.jquery.js',
    config.bower_path + '/inspinia/js/plugins/toastr/toastr.min.js',
    config.bower_path + '/angular-translate/angular-translate.min.js',
    config.bower_path + '/angular-ui-router/release/angular-ui-router.min.js',
];

//CAMINHO DOS ARQUIVOS DE CSS E CSS DE TERCEIROS QUE VAO FICAR NA PASTA PUBLIC
config.build_path_css = config.build_path + '/css';
config.build_vendor_path_css = config.build_path_css + '/vendor';
config.vendor_path_css = [
    config.bower_path + '/bootstrap/dist/css/bootstrap.min.css',
    config.bower_path + '/bootstrap/dist/css/bootstrap-theme.min.css',
    config.bower_path + '/inspinia/css/sweetalert.css',
    config.bower_path + '/inspinia/css/datepicker3.css',
    config.bower_path + '/inspinia/css/toastr.min.css',
    config.bower_path + '/inspinia/css/select2.min.css',
    config.bower_path + '/inspinia/css/chosen/chosen.css',
        config.bower_path + '/inspinia/css/chosen/chosen-sprite@2x.png',


];

//CAMINHO DOS ARQUIVOS DE HTML E HTML DE TERCEIROS QUE VAO FICAR NA PASTA PUBLIC
config.build_path_html = config.build_path + '/views';
config.build_path_font = config.build_path + '/fonts';
config.build_path_images = config.build_path + '/images';


gulp.task('copy-font', function () {
    gulp.src([
        config.assets_path + '/fonts/**/*'
    ])
        .pipe(gulp.dest(config.build_path_font))
        .pipe(liveReload());
});

gulp.task('copy-image', function () {
    gulp.src([
        config.assets_path + '/images/**/*'
    ])
        .pipe(gulp.dest(config.build_path_images))
        .pipe(liveReload());
});

gulp.task('copy-html', function () {
    gulp.src([
        config.assets_path + '/js/views/**/*.html'
    ])
        .pipe(gulp.dest(config.build_path_html))
        .pipe(liveReload());
});

gulp.task('copy-styles', function(){
    gulp.src([
        config.assets_path + '/css/**/*.css'
    ])
        .pipe(gulp.dest(config.build_path_css))
        .pipe(liveReload());

    //TERCEIROS
    gulp.src(config.vendor_path_css)
        .pipe(gulp.dest(config.build_vendor_path_css))
        .pipe(liveReload());
});

gulp.task('copy-scripts', function(){
    gulp.src([
     config.assets_path + '/js/**/*.js'
    ])
        .pipe(gulp.dest(config.build_path_js))
        .pipe(liveReload());

    //TERCEIROS
    gulp.src(config.vendor_path_js)
        .pipe(gulp.dest(config.build_vendor_path_js))
        .pipe(liveReload());
});

gulp.task('clear-build-folder', function(){
    clean.sync(config.build_path);
});

gulp.task('default', ['clear-build-folder'], function(){
    gulp.start('copy-html', 'copy-font', 'copy-image');
    elixir(function(mix){
        mix.styles(config.vendor_path_css.concat([config.assets_path + '/css/**/*.css']),
        'public/css/all.css', config.assets_path);
        mix.scripts(config.vendor_path_js.concat([config.assets_path + '/js/**/*.js']),
            'public/js/all.js', config.assets_path);
        mix.version(['js/all.js', 'css/all.css']);
    });
});

gulp.task('watch-dev', ['clear-build-folder'], function(){
    liveReload.listen();
    gulp.start('copy-styles', 'copy-scripts', 'copy-html', 'copy-font', 'copy-image');
    gulp.watch(config.assets_path + '/**', ['copy-styles', 'copy-scripts', 'copy-html']);
});