<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class QATableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get the path to the JSON file
        $weightsDataPath = base_path('sample_data/qa_data.json');

        // Read the JSON file and convert it to an array
        $weightsData = json_decode(File::get($weightsDataPath), true);

        // Insert the data into the weights table
        foreach ($weightsData as $item) {
            DB::table('qa')->insert([
                'prompt' => $item['prompt'],
                'answer' => $item['answer']
            ]);
        }
    }
}
