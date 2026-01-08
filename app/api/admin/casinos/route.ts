import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCasinosFromFirestore, getCasinoById } from "@/lib/firebase/casinos";
import { collection, doc, updateDoc, addDoc, getDoc } from "firebase/firestore";
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

// GET - Fetch all casinos
export async function GET() {
  try {
    const isAuthenticated = await verifyAdmin();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const casinos = await getCasinosFromFirestore();
    return NextResponse.json({ casinos });
  } catch (error) {
    console.error("Error fetching casinos:", error);
    return NextResponse.json(
      { error: "Failed to fetch casinos" },
      { status: 500 }
    );
  }
}

// POST - Create a new casino
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
    const { name, ...otherData } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Casino name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    const slug = body.slug || name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const casinoData = {
      name,
      slug,
      ...otherData,
    };

    const casinosRef = collection(db, "casinos");
    const docRef = await addDoc(casinosRef, casinoData);

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      message: "Casino created successfully" 
    });
  } catch (error) {
    console.error("Error creating casino:", error);
    return NextResponse.json(
      { error: "Failed to create casino" },
      { status: 500 }
    );
  }
}

// PUT - Update a casino
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
        { error: "Casino ID is required" },
        { status: 400 }
      );
    }

    // Get the document reference
    const casinoRef = doc(db, "casinos", id);
    const casinoDoc = await getDoc(casinoRef);

    if (!casinoDoc.exists()) {
      return NextResponse.json(
        { error: "Casino not found" },
        { status: 404 }
      );
    }

    // Generate slug from name if name is being updated and slug is not provided
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    await updateDoc(casinoRef, updateData);

    return NextResponse.json({ success: true, message: "Casino updated successfully" });
  } catch (error) {
    console.error("Error updating casino:", error);
    return NextResponse.json(
      { error: "Failed to update casino" },
      { status: 500 }
    );
  }
}

