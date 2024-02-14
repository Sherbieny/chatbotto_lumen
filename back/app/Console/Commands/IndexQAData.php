<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

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
        DB::statement('DROP INDEX IF EXISTS qa_prompt_index');
        DB::statement('DROP INDEX IF EXISTS qa_answer_index');

        DB::statement('CREATE INDEX qa_prompt_index ON qa USING pgroonga (prompt) WITH (tokenizer=\'TokenMecab\')');
        DB::statement('CREATE INDEX qa_answer_index ON qa USING pgroonga (answer) WITH (tokenizer=\'TokenMecab\')');

        $this->info('Data indexed successfully');

        return 0;
    }
}
