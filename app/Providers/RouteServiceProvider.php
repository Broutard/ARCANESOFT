<?php namespace App\Providers;

use App\Http\Routes;
use Arcanedev\LaravelAuth\Services\SocialAuthenticator;
use Arcanedev\LaravelAuth\Services\UserImpersonator;
use Arcanedev\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Contracts\Routing\Registrar as Router;

/**
 * Class     RouteServiceProvider
 *
 * @package  App\Providers
 * @author   ARCANEDEV <arcanedev.maroc@gmail.com>
 *
 * @method  \Arcanedev\Support\Routing\RouteRegistrar  middleware(array|string $middleware)
 */
class RouteServiceProvider extends ServiceProvider
{
    /* ------------------------------------------------------------------------------------------------
     |  Properties
     | ------------------------------------------------------------------------------------------------
     */
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\\Http\\Controllers';

    /* ------------------------------------------------------------------------------------------------
     |  Main Functions
     | ------------------------------------------------------------------------------------------------
     */
    /**
     * Define your route model bindings, pattern filters, etc.
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @param  \Illuminate\Contracts\Routing\Registrar  $router
     */
    public function map(Router $router)
    {
        $this->mapWebRoutes();

        $this->mapAuthRoutes();

        $this->mapApiRoutes();

        //
    }

    /* ------------------------------------------------------------------------------------------------
     |  Other Functions
     | ------------------------------------------------------------------------------------------------
     */
    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     */
    protected function mapWebRoutes()
    {
        $this->middleware(['web', 'impersonate', 'tracking'])
             ->namespace($this->namespace)
             ->group(function () {
                 Routes\Front\PagesRoutes::register();
                 Routes\Front\ProfileRoutes::register();

                 require_once base_path('routes/web.php');
             });
    }

    /**
     * Define the auth routes for the application.
     */
    private function mapAuthRoutes()
    {
        $this->middleware(['web', 'impersonate', 'tracking'])
             ->namespace($this->namespace.'\\Auth')
             ->prefix('auth')
             ->as('auth::')
             ->group(function () {
                 Routes\Auth\AuthenticationRoutes::register();
                 Routes\Auth\RegisterRoutes::register();
                 Routes\Auth\PasswordResetRoutes::register();

                 if (UserImpersonator::isEnabled())
                     Routes\Auth\ImpersonateRoutes::register();

                 if (SocialAuthenticator::isEnabled())
                     Routes\Auth\SocialiteRoutes::register();
             });
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     */
    protected function mapApiRoutes()
    {
        $this->middleware('api')
             ->namespace($this->namespace)
             ->prefix('api')
             ->group(base_path('routes/api.php'));
    }
}
