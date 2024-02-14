<?php

namespace App\Http\Controllers;

use App\Models\QA;
use Illuminate\Http\Request;

class SuggestionsController extends Controller
{
    public function getSuggestions(Request $request)
    {
        $suggestions = QA::search($request->input('query'));

        return response()->json($suggestions);
    }
}
