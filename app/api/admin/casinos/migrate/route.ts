import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBonusesFromFirestore } from "@/lib/firebase/firestore";
import { collection, doc, addDoc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";
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

// POST - Migrate casinos from bonus brandNames
export async function POST() {
  try {
    const isAuthenticated = await verifyAdmin();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all bonuses
    const bonuses = await getBonusesFromFirestore();
    
    // Extract unique brand names
    const brandNameMap = new Map<string, { bonus: any; count: number }>();
    
    bonuses.forEach((bonus) => {
      const brandName = bonus.brandName || bonus.casino || bonus.title;
      if (brandName && brandName.trim()) {
        if (!brandNameMap.has(brandName)) {
          brandNameMap.set(brandName, { bonus, count: 0 });
        }
        brandNameMap.get(brandName)!.count++;
      }
    });

    const casinosCreated: string[] = [];
    const bonusesUpdated: string[] = [];
    const errors: string[] = [];

    // Create casinos for each unique brand name
    for (const [brandName, { bonus }] of brandNameMap.entries()) {
      try {
        // Generate slug
        const slug = brandName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Check if casino with this slug already exists
        const casinosRef = collection(db, "casinos");
        const q = query(casinosRef, where("slug", "==", slug));
        const existingCasinos = await getDocs(q);

        let casinoId: string;

        if (!existingCasinos.empty) {
          // Casino already exists, use its ID
          casinoId = existingCasinos.docs[0].id;
        } else {
          // Create new casino
          const casinoData = {
            name: brandName,
            slug: slug,
            logo: bonus.image || '',
            description: bonus.description || '',
            rating: bonus.rating || 0,
            website: bonus.link || '',
          };

          const casinoRef = await addDoc(collection(db, "casinos"), casinoData);
          casinoId = casinoRef.id;
          casinosCreated.push(brandName);
        }

        // Update all bonuses with this brandName to reference the casino
        const bonusesRef = collection(db, "bonuses");
        const bonusQuery = query(bonusesRef);
        const bonusDocs = await getDocs(bonusQuery);

        for (const bonusDoc of bonusDocs.docs) {
          const bonusData = bonusDoc.data();
          const bonusBrandName = bonusData.brandName || bonusData.casino || bonusData.title || '';
          
          if (bonusBrandName === brandName && !bonusData.casinoId && !bonusData.casinoRef) {
            // Create a Firestore reference to the casino
            const casinoRef = doc(db, "casinos", casinoId);
            
            await updateDoc(doc(db, "bonuses", bonusDoc.id), {
              brandName: casinoRef, // Set brandName as a Firestore reference
              casinoId: casinoId,
              casinoRef: casinoId, // Also set casinoRef for compatibility
            });
            bonusesUpdated.push(bonusDoc.id);
          }
        }
      } catch (error) {
        const errorMsg = `Error processing ${brandName}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed",
      stats: {
        casinosCreated: casinosCreated.length,
        bonusesUpdated: bonusesUpdated.length,
        errors: errors.length,
      },
      casinosCreated,
      bonusesUpdated: bonusesUpdated.slice(0, 10), // Limit to first 10 for response size
      errors: errors.slice(0, 10), // Limit to first 10 for response size
    });
  } catch (error) {
    console.error("Error migrating casinos:", error);
    return NextResponse.json(
      { 
        error: "Failed to migrate casinos",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

