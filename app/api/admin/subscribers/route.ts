import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const COLLECTION_NAME = "newsletter_subscribers";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");
  if (!adminToken) return false;
  const expectedToken = process.env.ADMIN_TOKEN || "admin_authenticated";
  return adminToken.value === expectedToken;
}

function toISOString(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return null;
}

// GET - List subscribers
// Query params:
//   ?status=pending|active  (optional)
//   ?domain=getbonuscasinos.com  (optional)
//   ?limit=100  (optional, default 500)
export async function GET(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const domainFilter = searchParams.get("domain");
    const limit = parseInt(searchParams.get("limit") || "500", 10);

    const constraints = [];
    if (statusFilter === "pending" || statusFilter === "active") {
      constraints.push(where("status", "==", statusFilter));
    }
    if (domainFilter) {
      constraints.push(where("domain", "==", domainFilter));
    }

    const subscribersRef = collection(db, COLLECTION_NAME);
    const q =
      constraints.length > 0
        ? query(subscribersRef, ...constraints)
        : query(subscribersRef);

    const snapshot = await getDocs(q);

    const subscribers = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        email: data.email,
        // status missing on legacy records — treat as active for backwards compat
        status: data.status || "active",
        domain: data.domain || null,
        subscribedAt: toISOString(data.subscribedAt),
        confirmedAt: toISOString(data.confirmedAt),
        tokenExpiresAt: toISOString(data.tokenExpiresAt),
        country: data.country || null,
        countryCode: data.countryCode || null,
        language: data.language || null,
        timezone: data.timezone || null,
        deviceType: data.deviceType || null,
        referrer: data.referrer || null,
      };
    });

    // Sort by subscribedAt desc in memory (no composite index needed)
    subscribers.sort((a, b) => {
      if (!a.subscribedAt) return 1;
      if (!b.subscribedAt) return -1;
      return b.subscribedAt.localeCompare(a.subscribedAt);
    });

    const limited = subscribers.slice(0, limit);

    const counts = {
      total: subscribers.length,
      active: subscribers.filter((s) => s.status === "active").length,
      pending: subscribers.filter((s) => s.status === "pending").length,
    };

    return NextResponse.json({
      subscribers: limited,
      counts,
      returned: limited.length,
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a subscriber by id
//   ?id=<docId>
export async function DELETE(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    await deleteDoc(doc(db, COLLECTION_NAME, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
