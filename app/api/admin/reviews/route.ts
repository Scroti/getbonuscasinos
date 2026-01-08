import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");

  if (!adminToken) {
    return false;
  }

  const expectedToken = process.env.ADMIN_TOKEN || "admin_authenticated";
  return adminToken.value === expectedToken;
}

// GET - Fetch reviews by casino ID
export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdmin();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const casinoId = searchParams.get("casinoId");

    const reviewsRef = collection(db, "reviews");
    let q;

    if (casinoId) {
      q = query(reviewsRef, where("casinoId", "==", casinoId));
    } else {
      q = reviewsRef;
    }

    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
    }));

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdmin();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { casinoId, name, text, rating, seed } = body;

    if (!casinoId || !name || !text || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reviewsRef = collection(db, "reviews");
    const newReview = {
      casinoId,
      name,
      text,
      rating: Number(rating),
      seed: seed || name.replace(/\s+/g, ""),
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(reviewsRef, newReview);
    return NextResponse.json({ id: docRef.id, ...newReview, createdAt: newReview.createdAt.toDate().toISOString() });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

// PUT - Update a review
export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdmin();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, text, rating, seed } = body;

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const reviewRef = doc(db, "reviews", id);
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (text !== undefined) updateData.text = text;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (seed !== undefined) updateData.seed = seed;

    await updateDoc(reviewRef, updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE - Delete a review
export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdmin();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    await deleteDoc(doc(db, "reviews", id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

