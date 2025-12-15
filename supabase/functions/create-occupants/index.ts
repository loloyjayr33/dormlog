import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function generatePassword(length = 10) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

serve(async (req) => {
    const { emails, admin_id } = await req.json();

    for (const email of emails) {
        const password = generatePassword();

        // Create Auth User
        const { data: user, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

        if (error) continue;

        // Insert user role
        await supabase.from("users").insert({
            user_id: user.user.id,
            email,
            role: "Occupant",
        });

        // Log admin action
        await supabase.from("admin_actions").insert({
            admin_id,
            action_type: "Create Account",
            target_user: user.user.id,
        });

        // Log email
        await supabase.from("email_notifications").insert({
            recipient_email: email,
            email_type: "Account Creation",
            status: "Sent",
        });
    }

    return new Response(
        JSON.stringify({ success: true }),
        { headers: { "Content-Type": "application/json" } }
    );
});
