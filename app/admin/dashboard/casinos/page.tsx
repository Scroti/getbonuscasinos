"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Edit, Save, X, Plus, Loader2, MessageCircle, Trash2, Star } from "lucide-react";
import Image from "next/image";
import { Casino } from "@/lib/data";

export default function AdminCasinosPage() {
  const router = useRouter();
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Casino>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({ name: "", text: "", rating: 5, seed: "" });
  const [newCasino, setNewCasino] = useState<Partial<Casino>>({
    name: "",
    slug: "",
    logo: "",
    description: "",
    rating: 0,
    website: "",
    paymentMethods: [],
    currencies: [],
    withdrawalLimits: "",
    winLimits: "",
    gameProviders: [],
    gameTypes: [],
    supportLanguages: [],
    supportMethods: [],
    supportEmail: "",
    supportLiveChat: false,
    positives: [],
    negatives: [],
  });

  // Predefined payment methods list
  const paymentMethodsList = [
    "VISA", "Mastercard", "American Express", "Discover", "Maestro", "JCB",
    "Skrill", "Neteller", "PayPal", "PaysafeCard", "ecoPayz", "MuchBetter",
    "Bank Transfer", "Bitcoin", "Ethereum", "Litecoin", "Bitcoin Cash", "Tether",
    "Ripple", "Binance Pay", "Trustly", "Sofort", "Giropay", "iDEAL",
    "POLi", "Boleto", "PIX", "AstroPay", "PagoEfectivo", "Neosurf",
    "Rapid Transfer", "Interac", "eCheck", "Wire Transfer", "Revolut", "Aircash",
    "Google Pay", "Apple Pay", "Samsung Pay"
  ];

  // Predefined customer support options
  const supportOptionsList = [
    "Website", "Mobile App", "Desktop App", "Email", "Phone", "Live Chat",
    "WhatsApp", "Telegram", "Facebook Messenger", "Twitter", "Instagram"
  ];

  // Predefined game providers list
  const gameProvidersList = [
    "Pragmatic Play", "NetEnt", "Microgaming", "Evolution Gaming", "Play'n GO",
    "Betsoft", "Yggdrasil", "Quickspin", "Red Tiger", "Big Time Gaming",
    "NoLimit City", "Relax Gaming", "Push Gaming", "Thunderkick", "ELK Studios",
    "Blueprint Gaming", "IGT", "Novomatic", "Playtech", "Amatic",
    "Endorphina", "Hacksaw Gaming", "Nolimit City", "Kalamba Games", "Iron Dog Studio",
    "Gamevy", "Gamomat", "Merkur Gaming", "Wazdan", "Booming Games",
    "1x2 Gaming", "2 By 2 Gaming", "4ThePlayer", "7Mojos", "Absolute Live Gaming",
    "AdoptIt Publishing", "All41 Studios", "Amusnet Interactive", "Apollo Games",
    "Arcadem", "Aruze Gaming", "Asylum Labs", "AvatarUX", "B3W Group",
    "BB Games", "Belatra Games", "BetGames", "Betixon", "Betradar",
    "BGaming", "Booming Games", "Booming Games", "Booming Games", "CandleBets",
    "Casino Technology", "CT Interactive", "D-Tech", "Dragon Gaming", "Dream Tech",
    "EGT", "Electric Elephant", "Evoplay", "EZugi", "Felt Gaming",
    "Fugaso", "GameArt", "Gamebeat", "Gameburger Studios", "Gamevy",
    "Gamzix", "Genii", "Golden Hero", "Golden Race", "Green Jade Games",
    "Habanero", "Hacksaw Gaming", "High 5 Games", "Hölle Games", "Inbet Games",
    "Inspired", "Iron Dog Studio", "ISoftBet", "Jade Rabbit Studio", "JFTW",
    "KA Gaming", "Kalamba Games", "Kiron Interactive", "Leap Gaming", "Light & Wonder",
    "Mancala Gaming", "Mascot Gaming", "Max Win Gaming", "Merkur Gaming", "MGA Games",
    "MrSlotty", "Neko Games", "NetGame Entertainment", "Nolimit City", "Northern Lights Gaming",
    "Onlyplay", "Oryx Gaming", "PG Soft", "Platipus", "PlayPearls",
    "Playson", "Pragmatic Play Live", "Print Studios", "Pulse 8 Studios", "Rabcat",
    "ReelPlay", "Reevo", "Reflex Gaming", "Relax Gaming", "Retro Gaming",
    "Revolver Gaming", "Rival", "Ruby Play", "Salsa Technology", "Sapad Gaming",
    "Saucify", "SBTech", "Scientific Games", "Sg Interactive", "Silverback Gaming",
    "Skywind Group", "Slot Factory", "Slotmill", "Smartsoft Gaming", "Snowborn Games",
    "Spinomenal", "Spribe", "Stakelogic", "Stakelogic Live", "Stakelogic Live",
    "Swintt", "Switch Studios", "Synot Games", "Tom Horn Gaming", "True Flip",
    "True Lab", "Turbo Games", "Vivo Gaming", "Wazdan", "Wizard Games",
    "XPG", "Yggdrasil", "Zitro"
  ];

  // Predefined game types list
  const gameTypesList = [
    "Slots", "Table Games", "Live Casino", "Video Poker", "Bingo",
    "Keno", "Scratch Cards", "Virtual Sports", "Sports Betting", "Lottery",
    "Blackjack", "Roulette", "Baccarat", "Poker", "Craps",
    "Sic Bo", "Dragon Tiger", "Andar Bahar", "Teen Patti", "Casino Hold'em",
    "Caribbean Stud", "Three Card Poker", "Red Dog", "Pai Gow", "Pai Gow Poker",
    "Baccarat Squeeze", "Lightning Roulette", "Mega Ball", "Monopoly Live", "Deal or No Deal",
    "Wheel of Fortune", "Dream Catcher", "Cash or Crash", "Gonzo's Treasure Hunt", "Crazy Time"
  ];

  // Helper to convert array to comma-separated string
  const arrayToString = (arr: string[] | undefined): string => {
    return arr && arr.length > 0 ? arr.join(", ") : "";
  };

  // Helper to convert comma-separated or newline-separated string to array
  const stringToArray = (str: string): string[] => {
    if (!str) return [];
    // Handle both comma-separated and newline-separated values
    return str.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 0);
  };

  // Handle payment methods checkbox toggle
  const handlePaymentMethodToggle = (method: string, isNew: boolean = false) => {
    if (isNew) {
      const current = newCasino.paymentMethods || [];
      const updated = current.includes(method)
        ? current.filter((m) => m !== method)
        : [...current, method];
      setNewCasino({ ...newCasino, paymentMethods: updated });
    } else {
      const current = editData.paymentMethods || [];
      const updated = current.includes(method)
        ? current.filter((m) => m !== method)
        : [...current, method];
      setEditData({ ...editData, paymentMethods: updated });
    }
  };

  // Handle support methods checkbox toggle
  const handleSupportMethodToggle = (method: string, isNew: boolean = false) => {
    if (isNew) {
      const current = newCasino.supportMethods || [];
      const updated = current.includes(method)
        ? current.filter((m) => m !== method)
        : [...current, method];
      setNewCasino({ ...newCasino, supportMethods: updated });
    } else {
      const current = editData.supportMethods || [];
      const updated = current.includes(method)
        ? current.filter((m) => m !== method)
        : [...current, method];
      setEditData({ ...editData, supportMethods: updated });
    }
  };

  // Handle game providers checkbox toggle
  const handleGameProviderToggle = (provider: string, isNew: boolean = false) => {
    if (isNew) {
      const current = newCasino.gameProviders || [];
      const updated = current.includes(provider)
        ? current.filter((p) => p !== provider)
        : [...current, provider];
      setNewCasino({ ...newCasino, gameProviders: updated });
    } else {
      const current = editData.gameProviders || [];
      const updated = current.includes(provider)
        ? current.filter((p) => p !== provider)
        : [...current, provider];
      setEditData({ ...editData, gameProviders: updated });
    }
  };

  // Handle game types checkbox toggle
  const handleGameTypeToggle = (type: string, isNew: boolean = false) => {
    if (isNew) {
      const current = newCasino.gameTypes || [];
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      setNewCasino({ ...newCasino, gameTypes: updated });
    } else {
      const current = editData.gameTypes || [];
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      setEditData({ ...editData, gameTypes: updated });
    }
  };

  useEffect(() => {
    fetchCasinos();
  }, []);

  const fetchCasinos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/casinos");
      
      if (response.status === 401) {
        router.push("/admin");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch casinos");
      }

      const data = await response.json();
      setCasinos(data.casinos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load casinos");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (casinoId: string) => {
    try {
      setLoadingReviews(true);
      const response = await fetch(`/api/admin/reviews?casinoId=${casinoId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleAddReview = async (casinoId: string) => {
    if (!newReview.name || !newReview.text) {
      setError("Name and text are required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const seed = newReview.seed || newReview.name.replace(/\s+/g, "");
      const response = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newReview, casinoId, seed }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create review");
      }

      await fetchReviews(casinoId);
      setShowReviewForm(null);
      setNewReview({ name: "", text: "", rating: 5, seed: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create review");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async (reviewId: string, casinoId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      await fetchReviews(casinoId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (casino: Casino) => {
    setEditingId(casino.id);
    setEditData({
      name: casino.name,
      slug: casino.slug || "",
      logo: casino.logo || "",
      description: casino.description || "",
      rating: casino.rating || 0,
      website: casino.website || "",
      paymentMethods: casino.paymentMethods || [],
      currencies: casino.currencies || [],
      withdrawalLimits: casino.withdrawalLimits || "",
      winLimits: casino.winLimits || "",
      gameProviders: casino.gameProviders || [],
      gameTypes: casino.gameTypes || [],
      supportLanguages: casino.supportLanguages || [],
      supportMethods: casino.supportMethods || [],
      supportEmail: casino.supportEmail || "",
      supportLiveChat: casino.supportLiveChat || false,
      positives: casino.positives || [],
      negatives: casino.negatives || [],
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setReviews([]);
    setShowReviewForm(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      setSaving(true);
      setError("");

      // Convert string arrays back to arrays if they're strings
      const dataToSave: any = { ...editData };
      
      // Convert array fields that might be strings back to arrays
      const arrayFields = ['licenses', 'paymentMethods', 'currencies', 'gameProviders', 'gameTypes', 'supportLanguages', 'supportMethods', 'positives', 'negatives'];
      arrayFields.forEach(field => {
        if (typeof dataToSave[field] === 'string') {
          dataToSave[field] = stringToArray(dataToSave[field]);
        }
      });

      const response = await fetch("/api/admin/casinos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          ...dataToSave,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update casino");
      }

      await fetchCasinos();
      setEditingId(null);
      setEditData({});
      setReviews([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCasino = async () => {
    if (!newCasino.name) {
      setError("Casino name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Convert string arrays back to arrays if they're strings
      const dataToSave: any = { ...newCasino };
      
      // Convert array fields that might be strings back to arrays
      const arrayFields = ['licenses', 'paymentMethods', 'currencies', 'gameProviders', 'gameTypes', 'supportLanguages', 'supportMethods', 'positives', 'negatives'];
      arrayFields.forEach(field => {
        if (typeof dataToSave[field] === 'string') {
          dataToSave[field] = stringToArray(dataToSave[field]);
        }
      });

      const response = await fetch("/api/admin/casinos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create casino");
      }

      await fetchCasinos();
      setShowAddForm(false);
      setNewCasino({
        name: "",
        slug: "",
        logo: "",
        description: "",
        rating: 0,
        website: "",
        paymentMethods: [],
        currencies: [],
        withdrawalLimits: "",
        winLimits: "",
        gameProviders: [],
        gameTypes: [],
        supportLanguages: [],
        supportMethods: [],
        supportEmail: "",
        supportLiveChat: false,
        positives: [],
        negatives: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create casino");
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleMigrate = async () => {
    try {
      setMigrating(true);
      setError("");
      setMigrationResult(null);

      const response = await fetch("/api/admin/casinos/migrate", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to migrate casinos");
      }

      const data = await response.json();
      setMigrationResult(data);
      
      // Refresh casinos list
      await fetchCasinos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to migrate casinos");
    } finally {
      setMigrating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Manage Casinos</h1>
              <p className="text-muted-foreground">
                View, add, and edit casinos in the database
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleMigrate}
              variant="outline"
              disabled={migrating}
            >
              {migrating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {migrating ? "Migrating..." : "Migrate from Bonuses"}
            </Button>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)} 
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showAddForm ? "Cancel" : "Add Casino"}
            </Button>
            <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>

        {error && (
          <Card className="p-4 bg-destructive/10 border-destructive">
            <p className="text-destructive">{error}</p>
          </Card>
        )}

        {migrationResult && (
          <Card className="p-4 bg-emerald-500/10 border-emerald-500">
            <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
              Migration Completed Successfully!
            </h3>
            <div className="text-sm text-emerald-600 dark:text-emerald-300 space-y-1">
              <p>✅ Casinos created: {migrationResult.stats?.casinosCreated || 0}</p>
              <p>✅ Bonuses updated: {migrationResult.stats?.bonusesUpdated || 0}</p>
              {migrationResult.stats?.errors > 0 && (
                <p className="text-amber-600 dark:text-amber-400">
              ⚠️ Errors: {migrationResult.stats.errors}
            </p>
              )}
            </div>
            {migrationResult.casinosCreated && migrationResult.casinosCreated.length > 0 && (
              <div className="mt-3 text-xs text-muted-foreground">
                <p className="font-medium mb-1">Created casinos:</p>
                <ul className="list-disc list-inside space-y-1">
                  {migrationResult.casinosCreated.slice(0, 10).map((name: string, idx: number) => (
                    <li key={idx}>{name}</li>
                  ))}
                  {migrationResult.casinosCreated.length > 10 && (
                    <li>... and {migrationResult.casinosCreated.length - 10} more</li>
                  )}
                </ul>
              </div>
            )}
          </Card>
        )}

        {/* Add Casino Form */}
        {showAddForm && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Casino</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name *</label>
                <Input
                  value={newCasino.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    setNewCasino({ 
                      ...newCasino, 
                      name,
                      slug: newCasino.slug || generateSlug(name)
                    });
                  }}
                  placeholder="Casino Name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Slug</label>
                <Input
                  value={newCasino.slug || ""}
                  onChange={(e) => setNewCasino({ ...newCasino, slug: e.target.value })}
                  placeholder="auto-generated-from-name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Logo URL</label>
                <Input
                  value={newCasino.logo || ""}
                  onChange={(e) => setNewCasino({ ...newCasino, logo: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Website</label>
                <Input
                  value={newCasino.website || ""}
                  onChange={(e) => setNewCasino({ ...newCasino, website: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-background text-foreground"
                  value={newCasino.description || ""}
                  onChange={(e) => setNewCasino({ ...newCasino, description: e.target.value })}
                  placeholder="Casino description..."
                />
              </div>

              {/* Payment & Limits */}
              <div className="md:col-span-2 border-t pt-4 mt-2">
                <h3 className="text-lg font-semibold mb-3">Payment & Limits</h3>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Payment Methods</label>
                <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {paymentMethodsList.map((method) => (
                      <label key={method} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded">
                        <input
                          type="checkbox"
                          checked={(newCasino.paymentMethods || []).includes(method)}
                          onChange={() => handlePaymentMethodToggle(method, true)}
                          className="w-4 h-4"
                        />
                        <span>{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Games & Software - Commented out for future use */}
              {/* <div className="md:col-span-2 border-t pt-4 mt-2">
                <h3 className="text-lg font-semibold mb-3">Games & Software</h3>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Game Providers</label>
                <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {gameProvidersList.map((provider) => (
                      <label key={provider} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded">
                        <input
                          type="checkbox"
                          checked={(newCasino.gameProviders || []).includes(provider)}
                          onChange={() => handleGameProviderToggle(provider, true)}
                          className="w-4 h-4"
                        />
                        <span>{provider}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Game Types</label>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {gameTypesList.map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded">
                        <input
                          type="checkbox"
                          checked={(newCasino.gameTypes || []).includes(type)}
                          onChange={() => handleGameTypeToggle(type, true)}
                          className="w-4 h-4"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div> */}

              {/* Customer Support */}
              <div className="md:col-span-2 border-t pt-4 mt-2">
                <h3 className="text-lg font-semibold mb-3">Customer Support</h3>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Support Options</label>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {supportOptionsList.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded">
                        <input
                          type="checkbox"
                          checked={(newCasino.supportMethods || []).includes(option)}
                          onChange={() => handleSupportMethodToggle(option, true)}
                          className="w-4 h-4"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="md:col-span-2 border-t pt-4 mt-2">
                <h3 className="text-lg font-semibold mb-3">Features</h3>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Positives (one per line)</label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border bg-background text-foreground"
                  value={arrayToString(newCasino.positives).replace(/, /g, "\n")}
                  onChange={(e) => setNewCasino({ ...newCasino, positives: stringToArray(e.target.value) })}
                  placeholder="Fast withdrawals&#10;Great customer support&#10;Wide game selection"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Negatives (one per line)</label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border bg-background text-foreground"
                  value={arrayToString(newCasino.negatives).replace(/, /g, "\n")}
                  onChange={(e) => setNewCasino({ ...newCasino, negatives: stringToArray(e.target.value) })}
                  placeholder="Limited payment methods&#10;High wagering requirements"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleAddCasino} disabled={saving || !newCasino.name}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Casino
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline" disabled={saving}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Casinos List */}
        <div className="grid gap-4">
          {casinos.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No casinos found in the database.</p>
              <p className="text-sm text-muted-foreground mt-2">Click "Add Casino" to create your first casino.</p>
            </Card>
          ) : (
            casinos.map((casino) => (
              <Card key={casino.id} className="p-6">
                {editingId === casino.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Editing: {casino.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={saveEdit}
                          disabled={saving}
                          size="sm"
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="outline"
                          size="sm"
                          disabled={saving}
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Name *</label>
                        <Input
                          value={editData.name || ""}
                          onChange={(e) => {
                            const name = e.target.value;
                            setEditData({ 
                              ...editData, 
                              name,
                              slug: editData.slug || generateSlug(name)
                            });
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Slug</label>
                        <Input
                          value={editData.slug || ""}
                          onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Logo URL</label>
                        <Input
                          value={editData.logo || ""}
                          onChange={(e) => setEditData({ ...editData, logo: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Website</label>
                        <Input
                          value={editData.website || ""}
                          onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <textarea
                          className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-background text-foreground"
                          value={editData.description || ""}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        />
                      </div>

                      {/* Payment & Limits */}
                      <div className="md:col-span-2 border-t pt-4 mt-2">
                        <h3 className="text-lg font-semibold mb-3">Payment & Limits</h3>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">Payment Methods</label>
                        <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {paymentMethodsList.map((method) => (
                              <label key={method} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded">
                                <input
                                  type="checkbox"
                                  checked={(editData.paymentMethods || []).includes(method)}
                                  onChange={() => handlePaymentMethodToggle(method, false)}
                                  className="w-4 h-4"
                                />
                                <span>{method}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Games & Software - Commented out for future use */}
                      {/* <div className="md:col-span-2 border-t pt-4 mt-2">
                        <h3 className="text-lg font-semibold mb-3">Games & Software</h3>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">Game Providers</label>
                        <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {gameProvidersList.map((provider) => (
                              <label key={provider} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded">
                                <input
                                  type="checkbox"
                                  checked={(editData.gameProviders || []).includes(provider)}
                                  onChange={() => handleGameProviderToggle(provider, false)}
                                  className="w-4 h-4"
                                />
                                <span>{provider}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">Game Types</label>
                        <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {gameTypesList.map((type) => (
                              <label key={type} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded">
                                <input
                                  type="checkbox"
                                  checked={(editData.gameTypes || []).includes(type)}
                                  onChange={() => handleGameTypeToggle(type, false)}
                                  className="w-4 h-4"
                                />
                                <span>{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div> */}

                      {/* Customer Support */}
                      <div className="md:col-span-2 border-t pt-4 mt-2">
                        <h3 className="text-lg font-semibold mb-3">Customer Support</h3>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">Support Options</label>
                        <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {supportOptionsList.map((option) => (
                              <label key={option} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded">
                                <input
                                  type="checkbox"
                                  checked={(editData.supportMethods || []).includes(option)}
                                  onChange={() => handleSupportMethodToggle(option, false)}
                                  className="w-4 h-4"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="md:col-span-2 border-t pt-4 mt-2">
                        <h3 className="text-lg font-semibold mb-3">Features</h3>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-1 block">Positives (one per line)</label>
                        <textarea
                          className="w-full min-h-[80px] px-3 py-2 rounded-md border bg-background text-foreground"
                          value={arrayToString(editData.positives).replace(/, /g, "\n")}
                          onChange={(e) => setEditData({ ...editData, positives: stringToArray(e.target.value) })}
                          placeholder="Fast withdrawals&#10;Great customer support&#10;Wide game selection"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-1 block">Negatives (one per line)</label>
                        <textarea
                          className="w-full min-h-[80px] px-3 py-2 rounded-md border bg-background text-foreground"
                          value={arrayToString(editData.negatives).replace(/, /g, "\n")}
                          onChange={(e) => setEditData({ ...editData, negatives: stringToArray(e.target.value) })}
                          placeholder="Limited payment methods&#10;High wagering requirements"
                        />
                      </div>

                      {/* Reviews Management */}
                      <div className="md:col-span-2 border-t pt-4 mt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Reviews</h3>
                          <Button
                            onClick={() => {
                              if (!showReviewForm) {
                                fetchReviews(casino.id);
                              }
                              setShowReviewForm(showReviewForm === casino.id ? null : casino.id);
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            {showReviewForm === casino.id ? "Hide Reviews" : "Manage Reviews"}
                          </Button>
                        </div>

                        {showReviewForm === casino.id && (
                          <div className="space-y-4">
                            {/* Add Review Form */}
                            <Card className="p-4">
                              <h4 className="font-semibold mb-3">Add New Review</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Name *</label>
                                  <Input
                                    value={newReview.name}
                                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                    placeholder="John D."
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Rating *</label>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) || 5 })}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Review Text *</label>
                                  <textarea
                                    className="w-full min-h-[80px] px-3 py-2 rounded-md border bg-background text-foreground"
                                    value={newReview.text}
                                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                    placeholder="Great casino! Fast withdrawals..."
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Avatar Seed (optional)</label>
                                  <Input
                                    value={newReview.seed}
                                    onChange={(e) => setNewReview({ ...newReview, seed: e.target.value })}
                                    placeholder="Auto-generated from name"
                                  />
                                </div>
                                <Button
                                  onClick={() => handleAddReview(casino.id)}
                                  disabled={saving || !newReview.name || !newReview.text}
                                  size="sm"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Review
                                </Button>
                              </div>
                            </Card>

                            {/* Reviews List */}
                            {loadingReviews ? (
                              <div className="flex justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin" />
                              </div>
                            ) : reviews.length > 0 ? (
                              <div className="space-y-2">
                                {reviews.map((review) => (
                                  <Card key={review.id} className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold">{review.name}</span>
                                          <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <Star
                                                key={star}
                                                className={`h-3 w-3 ${
                                                  star <= review.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted-foreground"
                                                }`}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{review.text}</p>
                                      </div>
                                      <Button
                                        onClick={() => handleDeleteReview(review.id, casino.id)}
                                        variant="ghost"
                                        size="sm"
                                        disabled={saving}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-4">No reviews yet</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    {casino.logo && (
                      <div className="relative w-24 h-24 shrink-0">
                        <Image
                          src={casino.logo}
                          alt={casino.name}
                          fill
                          className="object-contain rounded-lg"
                          sizes="96px"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{casino.name}</h3>
                          {casino.slug && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Slug: {casino.slug}
                            </p>
                          )}
                          {casino.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {casino.description}
                            </p>
                          )}
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            {casino.rating && <span>⭐ {casino.rating}</span>}
                            {casino.website && (
                              <a 
                                href={casino.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => startEdit(casino)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

