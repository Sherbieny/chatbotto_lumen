<?php

namespace App\Http\Controllers;

use App\Models\QA;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        $query = $request->input('query');

        // Search for matching prompts
        $prompts = QA::search($query);

        // If no matching prompts, return a generic response
        if (empty($prompts)) {
            return response()->json([
                'message' => 'その質問に対する答えはわかりません。'
            ]);
        }

        // Get the answer for the first matching prompt
        $answer = QA::getAnswer($prompts[0]);

        // If no answer, return a generic response
        if (empty($answer)) {
            return response()->json([
                'message' => 'その質問に対する答えはわかりません。'
            ]);
        }

        return response()->json([
            'message' => $answer
        ]);
    }
}
