<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Artisan;

class ImportQADataJob extends Job
{
    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Artisan::call('import:qa-data --new-only');
    }
}
