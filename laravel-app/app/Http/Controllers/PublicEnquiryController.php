<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Enquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PublicEnquiryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'mobile' => ['required', 'string', 'max:30', 'regex:/^[0-9+()\s-]{8,30}$/'],
            'company' => ['nullable', 'string', 'max:160'],
            'product_name' => ['nullable', 'string', 'max:160'],
            'message' => ['nullable', 'string', 'max:4000'],
        ]);

        Enquiry::query()->create($validated);

        return back()->with('success', 'Thank you. Your enquiry has been received.');
    }
}
