import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Service Role needed if bypassing RLS, or Anon if RLS allows INSERT)
// Ideally for "subscribing", we should use the authenticated user's client if we had auth.
// For MVP, we'll use the service role key if available, or just anon key 
// assuming RLS policies allow inserts for now or if we pass a user_id.
// ACTUALLY: The table has `user_id uuid references users(id) not null`. 
// We need a valid user_id. Since we don't have full auth yet, the frontend likely doesn't send a token.
// WE WILL MOCK THE USER ID for MVP (or use a predefined guest user).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            routeIds,
            activeDays = [1, 2, 3, 4, 5],
            startTime = '07:00',
            endTime = '23:30',
            notificationMethod = 'line',
            mockUserId // Optional: allow frontend to pass a mock ID for testing
        } = body;

        // Validation
        if (!routeIds || !Array.isArray(routeIds) || routeIds.length === 0) {
            return NextResponse.json({ error: 'Missing routeIds' }, { status: 400 });
        }

        // --- USER ID HANDLING (MVP HACK) ---
        // In a real app, we get this from the session (req.cookies).
        // For this MVP, we will try to find a 'guest' user or creating one if needed is too complex.
        // Let's assume we use a hardcoded 'demo-user-id' UUID if not provided.
        // But the DB references `users(id)`. We need a real ID that exists in `users` table.
        // Let's query for ANY user to attach this to, or use a specific one.

        let userId = mockUserId;

        if (!userId) {
            // Fallback: lookup a user with email 'guest@bambigo.com' or similar, 
            // OR just pick the first user found.
            const { data: users, error: userError } = await supabase
                .from('users')
                .select('id')
                .limit(1);

            if (userError || !users || users.length === 0) {
                // Create a dummy user if none exists (unlikely in dev but good for safety)
                console.warn('No users found. Creating temp user not supported in this route yet.');
                return NextResponse.json({ error: 'No valid user found to attach subscription to.' }, { status: 500 });
            }
            userId = users[0].id;
        }
        // -----------------------------------

        const { data, error } = await supabase
            .from('trip_subscriptions')
            .insert({
                user_id: userId,
                route_ids: routeIds,
                active_days: activeDays,
                active_start_time: startTime,
                active_end_time: endTime,
                notification_method: notificationMethod,
                is_active: true
            })
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            subscription: data ? data[0] : null,
            message: 'Trip Guard Activated'
        });

    } catch (error) {
        console.error('Subscription API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
