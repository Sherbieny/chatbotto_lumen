<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:json|max:2048',
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
        Artisan::call('import:qa-data');
        Artisan::call('index:qa-data');

        return response()->json(['success' => true, 'message' => 'Indexing process has started. Please wait a few minutes.']);
    }
}
