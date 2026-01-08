import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// GET - Fetch reviews by casino ID (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const casinoId = searchParams.get("casinoId");

    if (!casinoId) {
      return NextResponse.json({ error: "Casino ID is required" }, { status: 400 });
    }

    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("casinoId", "==", casinoId));
    const snapshot = await getDocs(q);

    const reviews = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        text: data.text,
        rating: data.rating,
        seed: data.seed || data.name.replace(/\s+/g, ""),
        timeAgo: formatTimeAgo(data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now())),
      };
    });

    // Sort by creation date (newest first)
    reviews.sort((a, b) => {
      const dateA = snapshot.docs.find(d => d.id === a.id)?.data().createdAt?.toDate?.() || new Date(0);
      const dateB = snapshot.docs.find(d => d.id === b.id)?.data().createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? "s" : ""} ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? "s" : ""} ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? "s" : ""} ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} week${Math.floor(diffInSeconds / 604800) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffInSeconds / 2592000)} month${Math.floor(diffInSeconds / 2592000) > 1 ? "s" : ""} ago`;
}

