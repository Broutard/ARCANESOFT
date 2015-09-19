<?php namespace App\Tests;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

/**
 * Class ExampleTest
 * @package App\Tests
 */
class ExampleTest extends TestCase
{
    /** @test */
    public function it_can_see_the_home_page()
    {
        $this->visit('demo')->see('ARCANESOFT');
    }

    /** @test */
    public function it_must_have_a_home_route()
    {
        $response = $this->route('GET', 'public::home');

        $this->assertEquals(301, $response->status());
    }
}
