<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Artisan;

class IndexQADataJob extends Job
{
    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Artisan::call('index:qa-data');
    }
}
