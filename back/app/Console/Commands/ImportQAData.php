<?php

namespace App\Console\Commands;

use App\Models\QA;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ImportQAData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:qa-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import QA data from JSON file to database';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $filePath = base_path('sample_data/qa_data.json');

        if (!File::exists($filePath)) {
            $this->error("File not found: {$filePath}");
            return 1;
        }

        $data = json_decode(File::get($filePath), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error('Invalid JSON: ' . json_last_error_msg());
            return 1;
        }

        QA::truncate();

        foreach ($data as $item) {
            QA::create([
                'prompt' => $item['prompt'],
                'answer' => $item['answer'],
            ]);
        }

        $this->info('Data imported successfully');

        return 0;
    }
}
