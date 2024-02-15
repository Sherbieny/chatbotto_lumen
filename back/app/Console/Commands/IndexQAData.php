<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class IndexQAData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'index:qa-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Index QA data for full text search';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Log::info('Starting index:qa-data command');
        // Start a database transaction
        DB::beginTransaction();

        try {
            // Drop existing indexes
            DB::statement('DROP INDEX IF EXISTS qa_prompt_index');
            DB::statement('DROP INDEX IF EXISTS qa_answer_index');

            // Create new indexes
            DB::statement('CREATE INDEX qa_prompt_index ON qa USING pgroonga (prompt) WITH (tokenizer=\'TokenMecab\')');
            DB::statement('CREATE INDEX qa_answer_index ON qa USING pgroonga (answer) WITH (tokenizer=\'TokenMecab\')');

            // Commit the transaction
            DB::commit();
            Log::info('Data indexed successfully');
            $this->info('Data indexed successfully');
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
            Log::error('An error occurred while indexing data: ' . $e->getMessage());
            $this->error('An error occurred while indexing data: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
