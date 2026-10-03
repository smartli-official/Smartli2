import { supabaseAdmin } from "@/lib/supabase";

async function createUserProfile(clerkUserId: string, email: string) {
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: clerkUserId, email, subjects: [] }, { onConflict: "id" });

  if (profileError) throw profileError;

  const { error: dashboardError } = await supabaseAdmin
    .from("dashboard")
    .upsert({ id: clerkUserId }, { onConflict: "id" });

  if (dashboardError) throw dashboardError;

  const { error: streaksError } = await supabaseAdmin
    .from("user_streaks")
    .upsert({ user_id: clerkUserId }, { onConflict: "user_id" });

  if (streaksError) throw streaksError;

  const { error: usageError } = await supabaseAdmin
    .from("user_usage")
    .upsert(
      {
        user_id: clerkUserId,
        period_month: new Date().toISOString().slice(0, 7),
      },
      { onConflict: "user_id", ignoreDuplicates: true }
    );

  if (usageError) throw usageError;
}

export async function POST() {
  try {
    const res = await fetch("https://api.clerk.com/v1/users?limit=100", {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    });

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch users from Clerk" },
        { status: 500 }
      );
    }

    const users = await res.json();
    const results: { id: string; email: string; status: string }[] = [];

    for (const user of users) {
      const email = user.email_addresses?.[0]?.email_address ?? "";
      try {
        await createUserProfile(user.id, email);
        results.push({ id: user.id, email, status: "synced" });
      } catch (err) {
        results.push({ id: user.id, email, status: "failed" });
        console.error(`Failed to sync user ${user.id}:`, err);
      }
    }

    return Response.json({ synced: results.length, results });
  } catch (err) {
    console.error("Backfill error:", err);
    return Response.json({ error: "Backfill failed" }, { status: 500 });
  }
}