<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function getSettings()
    {
        return response()->json(Setting::all());
    }

    public function saveSettings(Request $request)
    {
        foreach ($request->all() as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                ['label' => $setting['label'], 'value' => $setting['value']]
            );
        }

        return response()->json(['success' => true]);
    }
}
