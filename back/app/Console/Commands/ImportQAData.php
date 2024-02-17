<?php

namespace App\Console\Commands;

use App\Models\QA;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class ImportQAData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:qa-data {--new-only : Import only the qa_data.json file}';

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
        Log::info('Starting import:qa-data command');
        $dirPath = base_path('sample_data');

        if (!File::isDirectory($dirPath)) {
            $this->error("Directory not found: {$dirPath}");
            return 1;
        }

        $files = $this->option('new-only') ? [new \SplFileInfo($dirPath . '/qa_data.json')] : File::files($dirPath);

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Create a temporary table
            DB::statement('CREATE TEMPORARY TABLE temp_qa AS SELECT * FROM qa WITH NO DATA');

            foreach ($files as $file) {
                if ($file->getExtension() !== 'json') {
                    continue;
                }

                $data = json_decode(file_get_contents($file->getPathname()), true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    $this->error('Invalid JSON in file ' . $file->getBasename() . ': ' . json_last_error_msg());
                    return 1;
                }

                // Create a new progress bar
                $bar = $this->output->createProgressBar(count($data));

                // Import the data into the temporary table
                foreach ($data as $item) {
                    if (!isset($item['prompt'], $item['answer'])) {
                        $this->error('Invalid data in file ' . $file->getBasename() . ': missing "prompt" or "answer"');
                        return 1;
                    }

                    DB::table('temp_qa')->insert([
                        'prompt' => $item['prompt'],
                        'answer' => $item['answer'],
                    ]);

                    // Advance the progress bar by one step
                    $bar->advance();
                }

                // Finish the progress bar
                $bar->finish();
            }

            // Insert new records into the main table, excluding duplicates
            DB::statement('INSERT INTO qa (prompt, answer, created_at, updated_at)
                            SELECT prompt, answer, NOW(), NOW() FROM temp_qa
                            WHERE (prompt, answer) NOT IN (SELECT prompt, answer FROM qa)');

            // Commit the transaction
            DB::commit();

            // Remove the temporary table
            DB::statement('DROP TABLE IF EXISTS temp_qa');
            Log::info('Finished import:qa-data command');
            $this->info("\nData imported successfully");
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
            Log::error('An error occurred while importing data: ' . $e->getMessage());
            $this->error('An error occurred while importing data: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
