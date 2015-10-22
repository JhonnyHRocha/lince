<?php

namespace Lince\Providers;

use Illuminate\Support\ServiceProvider;

class LinceRepositoryProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            \Lince\Repositories\ClienteRepository::class,
            \Lince\Repositories\ClienteRepositoryEloquent::class
        );

        $this->app->bind(
            \Lince\Repositories\RevendedoresRepository::class,
            \Lince\Repositories\RevendedoresRepositoryEloquent::class
        );

        $this->app->bind(
            \Lince\Repositories\VendasRepository::class,
            \Lince\Repositories\VendasRepositoryEloquent::class
        );
    }
}
