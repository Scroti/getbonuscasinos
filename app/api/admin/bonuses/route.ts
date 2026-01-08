import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBonusesFromFirestore } from "@/lib/firebase/firestore";
import { collection, doc, updateDoc, getDoc, addDoc, deleteDoc } from "firebase/firestore";
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

// GET - Fetch all bonuses
export async function GET() {
  try {
    const isAuthenticated = await verifyAdmin();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bonuses = await getBonusesFromFirestore();
    return NextResponse.json({ bonuses });
  } catch (error) {
    console.error("Error fetching bonuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch bonuses" },
      { status: 500 }
    );
  }
}

// PUT - Update a bonus
export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdmin();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Bonus ID is required" },
        { status: 400 }
      );
    }

    // Get the document reference
    const bonusRef = doc(db, "bonuses", id);
    const bonusDoc = await getDoc(bonusRef);

    if (!bonusDoc.exists()) {
      return NextResponse.json(
        { error: "Bonus not found" },
        { status: 404 }
      );
    }

    // Map frontend fields to Firestore fields
    const updateFields: any = {};
    
    // Tags: convert array to comma-separated string
    if (updateData.tags !== undefined) {
      if (Array.isArray(updateData.tags)) {
        updateFields.tags = updateData.tags.join(", ");
      } else {
        updateFields.tags = updateData.tags;
      }
    }
    
    // Casino ID reference - if provided, set brandName as a Firestore reference
    if (updateData.casinoId !== undefined) {
      if (updateData.casinoId) {
        const casinoRef = doc(db, "casinos", updateData.casinoId);
        updateFields.brandName = casinoRef; // Set as Firestore reference
        updateFields.casinoId = updateData.casinoId;
        updateFields.casinoRef = updateData.casinoId; // Also set casinoRef for compatibility
      } else {
        // If casinoId is empty string, clear the reference
        updateFields.brandName = updateData.casino || "";
        updateFields.casinoId = "";
        updateFields.casinoRef = "";
      }
    }
    
    // Legacy: Casino/Brand name as string (only if casinoId not provided or empty)
    if (updateData.casino !== undefined && (!updateData.casinoId || updateData.casinoId === "")) {
      updateFields.brandName = updateData.casino;
    }
    
    // Title -> welcomeBonus (main field used in Firestore)
    if (updateData.title !== undefined) {
      updateFields.welcomeBonus = updateData.title;
    }
    
    // Description -> bonusDetails
    if (updateData.description !== undefined) {
      updateFields.bonusDetails = updateData.description;
    }
    
    // Link -> trackingLink (preferred) or link
    if (updateData.link !== undefined) {
      updateFields.trackingLink = updateData.link;
      updateFields.link = updateData.link;
    }
    
    // Image -> logo (preferred) or image
    if (updateData.image !== undefined) {
      updateFields.logo = updateData.image;
      updateFields.image = updateData.image;
    }
    
    // Other fields
    if (updateData.code !== undefined) updateFields.code = updateData.code;
    if (updateData.rating !== undefined) updateFields.rating = updateData.rating;
    if (updateData.exclusive !== undefined) updateFields.exclusive = updateData.exclusive;
    if (updateData.terms !== undefined) updateFields.terms = updateData.terms;
    if (updateData.wagering !== undefined) {
      updateFields.wager = updateData.wagering;
      updateFields.wagering = updateData.wagering;
    }
    if (updateData.minDeposit !== undefined) updateFields.minDeposit = updateData.minDeposit;
    if (updateData.maxBonus !== undefined) updateFields.maxBonus = updateData.maxBonus;
    if (updateData.order !== undefined) updateFields.order = updateData.order;

    await updateDoc(bonusRef, updateFields);

    return NextResponse.json({ success: true, message: "Bonus updated successfully" });
  } catch (error) {
    console.error("Error updating bonus:", error);
    return NextResponse.json(
      { error: "Failed to update bonus" },
      { status: 500 }
    );
  }
}

// POST - Create a new bonus
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
    const { casinoId, ...bonusData } = body;

    if (!bonusData.title || !bonusData.link) {
      return NextResponse.json(
        { error: "Title and link are required" },
        { status: 400 }
      );
    }

    // Map frontend fields to Firestore fields
    const newBonus: any = {
      welcomeBonus: bonusData.title,
      bonusDetails: bonusData.description || "",
      trackingLink: bonusData.link,
      link: bonusData.link,
      logo: bonusData.image || "",
      image: bonusData.image || "",
      tags: Array.isArray(bonusData.tags) ? bonusData.tags.join(", ") : (bonusData.tags || ""),
      terms: bonusData.terms || "18+. T&Cs apply.",
      wager: bonusData.wagering || "",
      wagering: bonusData.wagering || "",
      minDeposit: bonusData.minDeposit || "",
      maxBonus: bonusData.maxBonus || "",
      rating: bonusData.rating || 5,
      exclusive: bonusData.exclusive || false,
      order: bonusData.order !== undefined ? bonusData.order : 0,
    };

    // If casinoId is provided, set brandName as a Firestore reference
    if (casinoId) {
      const casinoRef = doc(db, "casinos", casinoId);
      newBonus.brandName = casinoRef;
      newBonus.casinoId = casinoId;
      newBonus.casinoRef = casinoId;
    } else if (bonusData.casino) {
      // Legacy: Casino/Brand name as string
      newBonus.brandName = bonusData.casino;
    }

    // Add the bonus to Firestore
    const bonusesRef = collection(db, "bonuses");
    const newBonusRef = await addDoc(bonusesRef, newBonus);

    return NextResponse.json({ 
      success: true, 
      message: "Bonus created successfully",
      id: newBonusRef.id 
    });
  } catch (error) {
    console.error("Error creating bonus:", error);
    return NextResponse.json(
      { error: "Failed to create bonus" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a bonus
export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdmin();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Bonus ID is required" },
        { status: 400 }
      );
    }

    // Get the document reference
    const bonusRef = doc(db, "bonuses", id);
    const bonusDoc = await getDoc(bonusRef);

    if (!bonusDoc.exists()) {
      return NextResponse.json(
        { error: "Bonus not found" },
        { status: 404 }
      );
    }

    // Delete the bonus
    await deleteDoc(bonusRef);

    return NextResponse.json({ success: true, message: "Bonus deleted successfully" });
  } catch (error) {
    console.error("Error deleting bonus:", error);
    return NextResponse.json(
      { error: "Failed to delete bonus" },
      { status: 500 }
    );
  }
}

