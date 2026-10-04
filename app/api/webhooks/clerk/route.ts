import { Webhook } from "svix";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

type UserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
  };
};

type UserDeletedEvent = {
  type: "user.deleted";
  data: {
    id: string;
  };
};

type WebhookEvent = UserCreatedEvent | UserDeletedEvent;

async function createUserProfile(clerkUserId: string, email: string) {
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        id: clerkUserId,
        email,
        subjects: [],
      },
      { onConflict: "id" }
    );

  if (profileError) {
    console.error("Error creating profile:", profileError);
    throw profileError;
  }

  const { error: dashboardError } = await supabaseAdmin
    .from("dashboard")
    .upsert(
      {
        id: clerkUserId,
      },
      { onConflict: "id" }
    );

  if (dashboardError) {
    console.error("Error creating dashboard:", dashboardError);
    throw dashboardError;
  }

  const { error: streaksError } = await supabaseAdmin
    .from("user_streaks")
    .upsert(
      {
        user_id: clerkUserId,
      },
      { onConflict: "user_id" }
    );

  if (streaksError) {
    console.error("Error creating streaks:", streaksError);
    throw streaksError;
  }

  const { error: usageError } = await supabaseAdmin
    .from("user_usage")
    .upsert(
      {
        user_id: clerkUserId,
        plan_id: "spark",
        messages_used: 0,
        quizzes_used: 0,
        voice_minutes_used: 0,
        period_month: new Date().toISOString().slice(0, 7),
      },
      { onConflict: "user_id", ignoreDuplicates: true }
    );

  if (usageError) {
    console.error("Error creating usage:", usageError);
    throw usageError;
  }
}

async function deleteUserData(clerkUserId: string) {
  // Tables keyed directly by Clerk user id.
  const tables = [
    { name: "dashboard" as const, key: "id" as const },
    { name: "profiles" as const, key: "id" as const },
    { name: "user_keys" as const, key: "id" as const },
    { name: "user_streaks" as const, key: "user_id" as const },
    { name: "user_usage" as const, key: "user_id" as const },
    { name: "ai_conversations" as const, key: "user_id" as const },
  ];

  for (const { name, key } of tables) {
    const { error } = await supabaseAdmin
      .from(name)
      .delete()
      .eq(key, clerkUserId);

    if (error) {
      console.error(`Error deleting from ${name}:`, error);
    }
  }

  // ai_messages cascade off ai_conversations, but clean orphans defensively.
  const { data: remaining } = await supabaseAdmin
    .from("ai_conversations")
    .select("id")
    .eq("user_id", clerkUserId);
  if (remaining && remaining.length > 0) {
    const ids = remaining.map((r) => r.id);
    const { error } = await supabaseAdmin.from("ai_messages").delete().in("conversation_id", ids);
    if (error) console.error("Error deleting orphan ai_messages:", error);
  }
}

export async function POST(req: Request) {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET!);

  try {
    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const body = await req.text();
    // svix v2 `verify()` returns void and throws on invalid signatures —
    // it does NOT return the payload (v1 API did). Parse separately.
    try {
      wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch {
      return new Response("Invalid webhook signature", { status: 400 });
    }
    let evt: WebhookEvent;
    try {
      evt = JSON.parse(body) as WebhookEvent;
    } catch {
      return new Response("Invalid webhook payload", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses } = evt.data;
      const primaryEmail = email_addresses?.[0]?.email_address ?? "";

      console.log(`Creating user: ${id} (${primaryEmail})`);
      await createUserProfile(id, primaryEmail);
      console.log(`User created successfully: ${id}`);
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      if (id) {
        console.log(`Deleting user data: ${id}`);
        await deleteUserData(id);
        console.log(`User deleted successfully: ${id}`);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    // Post-verification handler failure (e.g. Supabase down) — 500 so
    // Clerk retries instead of dropping the event.
    console.error("Webhook handler error:", err);
    return new Response("Webhook handler failed", { status: 500 });
  }
}