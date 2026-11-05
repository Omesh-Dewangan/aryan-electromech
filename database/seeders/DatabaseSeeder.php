<?php

namespace Database\Seeders;

use App\Models\HomepageContent;
use App\Models\Industry;
use App\Models\ProcessStep;
use App\Models\Product;
use App\Models\Service;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::query()->updateOrCreate(['id' => 1], [
            'company_name' => 'Aryan Electromech Engineers',
            'ceo_name' => 'Madhu Pandey',
            'phone' => '+91 92434 93179',
            'email' => 'aryanelectromechengg@gmail.com',
            'whatsapp_number' => '919243493179',
            'gstin' => '22ETEPP0908E1Z1',
            'address' => 'Shed No-3, Phase-1, Rawabhata Metal Park, Raipur (C.G.) PIN-493221',
            'map_embed_url' => 'https://maps.google.com/maps?q=Shed%20No-3%2C%20Phase-1%2C%20Rawabhata%20Metal%20Park%2C%20Raipur%2C%20Chhattisgarh&t=&z=14&ie=UTF8&iwloc=&output=embed',
            'logo_path' => '/images/arya-elecromech-wordmark.png',
        ]);

        HomepageContent::query()->updateOrCreate(['id' => 1], [
            'hero_kicker' => 'Low-voltage panel specialists',
            'hero_title' => 'Power systems,',
            'hero_highlight' => 'built for uptime.',
            'hero_description' => 'Custom low-voltage panels engineered for dependable operation—from the first approved drawing to final testing and commissioning.',
            'hero_image_path' => '/images/panel-lineup.png',
            'about_heading' => 'A Raipur panel shop that builds to your drawing, not a catalogue number.',
            'about_paragraph_one' => 'Aryan Electromech Engineers is an electrical engineering and panel manufacturing company led by CEO Madhu Pandey.',
            'about_paragraph_two' => 'Our team works with your project from design approval to final testing, with clear documentation and practical support for the people who operate and maintain each installation.',
            'about_image_path' => '/images/switchgear-room.jpg',
            'catalogue_heading' => 'Find the right panel for your plant',
            'catalogue_intro' => 'Browse our core range. Each assembly is configured to your approved load, layout and switchgear requirements.',
            'services_heading' => 'From concept to commissioning',
            'services_intro' => 'One team for design, manufacture and site support — so your panel is right the first time.',
            'industries_heading' => 'Panels for the plants of Chhattisgarh',
            'industries_intro' => 'Our panels are made for the industries that run the state — and for any project that needs reliable LT power and control.',
            'process_heading' => 'A clear path from brief to commissioning',
            'process_intro' => 'You stay in control at every stage, with drawings reviewed before the build and test documentation at handover.',
            'contact_heading' => 'Let’s discuss your panel requirement',
            'contact_intro' => 'Share your application, load details or drawings. Our team can help you plan the next step.',
        ]);

        $products = [
            ['AE-01', 'pcc-panel', 'PCC Panel', 'Power Control Centre', 'Power Distribution', 'A project-built power control centre for dependable low-tension distribution. Final configuration follows the approved single-line diagram and load schedule.', '/images/pcc-panel.png'],
            ['AE-02', 'mcc-panel', 'MCC Panel', 'Motor Control Centre', 'Motor Control', 'Centralized motor control and protection for plant equipment, arranged around your process and operating requirements.', '/images/mcc-panel.png'],
            ['AE-03', 'apfc-panel', 'APFC Panel', 'Automatic Power Factor Correction', 'Power Quality', 'Automatic capacitor bank switching designed around your measured load profile and power-factor correction needs.', '/images/apfc-panel.png'],
            ['AE-04', 'metering-panel', 'Metering Panel', 'Energy Metering Panel', 'Power Distribution', 'A clear metering and monitoring arrangement to help operators understand distribution and energy use.', '/images/meter-panel.png'],
            ['AE-05', 'lt-bus-duct', 'LT Bus Duct', 'Low Tension Bus Duct', 'Power Distribution', 'Low-tension bus duct solutions planned for the route, current capacity and site conditions of your installation.', '/images/bus-duct.png'],
            ['AE-06', 'power-distribution-board', 'Power Distribution Board', 'PDB / LDB / MCB DB', 'Power Distribution', 'Distribution boards assembled for organized outgoing circuits in industrial and commercial installations.', '/images/distribution-board.jpg'],
            ['AE-07', 'starter-panel', 'Starter Panel', 'DOL / Star-Delta Starter', 'Motor Control', 'Motor starter arrangements selected to suit motor duty and the control sequence required at site.', '/images/contactor.png'],
            ['AE-08', 'vfd-panel', 'VFD Panel', 'Variable Frequency Drive Panel', 'Motor Control', 'Drive panels that bring speed control, motor protection and control wiring together in one serviceable assembly.', '/images/vfd.jpg'],
            ['AE-09', 'plc-automation-panel', 'PLC & Automation Panel', 'PLC / HMI Control Panel', 'Automation', 'PLC and operator-interface panels arranged for your machine or process logic, with approved drawings before fabrication.', '/images/plc-automation.jpg'],
            ['AE-10', 'control-relay-panel', 'Control & Relay Panel', 'Protection Relay Panel', 'Automation', 'Control and protection relay assemblies laid out for clear wiring, testing and maintenance.', '/images/protection-relay.jpg'],
        ];

        foreach ($products as $index => [$code, $slug, $name, $subtitle, $category, $description, $image]) {
            Product::query()->updateOrCreate(['code' => $code], compact('slug', 'name', 'subtitle', 'category', 'description') + [
                'image_path' => $image, 'is_active' => true, 'sort_order' => $index + 1,
            ]);
        }

        $services = [
            ['Consultancy & Design', 'Load study, single-line diagram and panel sizing for your plant or project.', 'Sparkles'],
            ['Drawings & BOM', 'GA and wiring drawings with bill of materials shared for your approval before fabrication.', 'ClipboardList'],
            ['Fabrication', 'Sheet-metal work, powder coating, busbar and wiring done in-house at our Raipur shed.', 'Boxes'],
            ['Installation & Commissioning', 'Erection, testing and commissioning of panels at your site.', 'Cable'],
            ['Retrofitting', 'Upgrade old LT panels, breakers and conventional relays without a full replacement.', 'RefreshCw'],
            ['Spares & Maintenance', 'Switchgear spares, servicing and maintenance support after handover.', 'Wrench'],
        ];

        foreach ($services as $index => [$title, $detail, $icon]) {
            Service::query()->updateOrCreate(['title' => $title], ['detail' => $detail, 'icon_name' => $icon, 'is_active' => true, 'sort_order' => $index + 1]);
        }

        foreach (['Steel & Rolling Mills', 'Power Plants', 'Cement Plants', 'Ferro Alloys', 'Rice Mills', 'Coal & Iron-ore Mines', 'Water Treatment', 'Cold Storages', 'Solar Plants', 'Commercial Buildings'] as $index => $name) {
            Industry::query()->updateOrCreate(['name' => $name], ['is_active' => true, 'sort_order' => $index + 1]);
        }

        $steps = [
            ['Share requirements', 'Send your load list, single-line diagram or site brief so we can understand the application.', 'ClipboardList'],
            ['Review & approve', 'Review the GA drawings and bill of materials before fabrication begins.', 'Check'],
            ['Build & test', 'Our team fabricates, wires and routinely tests the panel at our works.', 'Factory'],
            ['Deliver & support', 'Receive the panel with test documentation and commissioning support as required.', 'Zap'],
        ];

        foreach ($steps as $index => [$title, $detail, $icon]) {
            ProcessStep::query()->updateOrCreate(['step_number' => $index + 1], ['title' => $title, 'detail' => $detail, 'icon_name' => $icon, 'is_active' => true]);
        }
    }
}
