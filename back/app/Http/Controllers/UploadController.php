<?php

namespace App\Http\Controllers;

use App\Rules\QAJsonFormat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Validator;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => ['required', 'mimes:json', 'max:2048', new QAJsonFormat()],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $file = $request->file('file');
        $filePath = base_path('sample_data/qa_data.json');
        File::put($filePath, File::get($file));

        return response()->json(['success' => true]);
    }

    public function process()
    {
        Queue::push(new \App\Jobs\ImportQADataJob());
        Queue::push(new \App\Jobs\IndexQADataJob());

        return response()->json(['success' => true, 'message' => 'Indexing process has started. Please wait a few minutes.']);
    }
}
