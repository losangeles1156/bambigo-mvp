import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logUserActivity } from '@/lib/activityLogger';

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

        await logUserActivity({
            request: req,
            activityType: 'trip_guard_subscribe_attempt',
            queryContent: { routeIdsCount: routeIds.length, activeDays, startTime, endTime, notificationMethod },
            metadata: { feature: 'trip_guard' }
        });

        const userId = mockUserId || null;

        if (!userId) {
            return NextResponse.json({
                success: false,
                requiresLogin: true,
                message: 'Trip Guard requires a member session.'
            });
        }

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
