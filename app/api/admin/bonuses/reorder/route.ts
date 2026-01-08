import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getBonusesFromFirestore } from "@/lib/firebase/firestore";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");

  if (!adminToken) {
    return false;
  }

  const expectedToken = process.env.ADMIN_TOKEN || "admin_authenticated";
  return adminToken.value === expectedToken;
}

// POST - Reorder bonuses
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdmin();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // If reorderAll is true, reorder all bonuses sequentially
    if (body.reorderAll) {
      const bonuses = await getBonusesFromFirestore();
      
      // Sort bonuses by current order
      bonuses.sort((a, b) => {
        const orderA = (a as any).order ?? Number.MAX_SAFE_INTEGER;
        const orderB = (b as any).order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });

      // Update all bonuses with sequential order (0, 1, 2, 3, ...)
      const updatePromises = bonuses.map((bonus, index) => {
        const bonusRef = doc(db, "bonuses", bonus.id);
        return updateDoc(bonusRef, { order: index });
      });

      await Promise.all(updatePromises);

      return NextResponse.json({ 
        success: true, 
        message: `Reordered ${bonuses.length} bonuses sequentially` 
      });
    }

    // Otherwise, swap two bonuses
    const { bonusId1, bonusId2, order1, order2 } = body;

    if (!bonusId1 || !bonusId2 || order1 === undefined || order2 === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update both bonuses with swapped orders
    const bonusRef1 = doc(db, "bonuses", bonusId1);
    const bonusRef2 = doc(db, "bonuses", bonusId2);

    await Promise.all([
      updateDoc(bonusRef1, { order: order1 }),
      updateDoc(bonusRef2, { order: order2 }),
    ]);

    return NextResponse.json({ success: true, message: "Bonuses reordered successfully" });
  } catch (error) {
    console.error("Error reordering bonuses:", error);
    return NextResponse.json(
      { error: "Failed to reorder bonuses" },
      { status: 500 }
    );
  }
}

