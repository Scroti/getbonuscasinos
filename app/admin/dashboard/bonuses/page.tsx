"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Edit, Save, X, Loader2, Plus, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import Image from "next/image";
import { Bonus } from "@/lib/data";

export default function AdminBonusesPage() {
  const router = useRouter();
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Bonus>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [casinos, setCasinos] = useState<Array<{ id: string; name: string }>>([]);
  const [newBonus, setNewBonus] = useState<Partial<Bonus>>({
    title: "",
    description: "",
    link: "",
    image: "",
    tags: [],
    terms: "",
    wagering: "",
    minDeposit: "",
    casino: "",
    casinoId: "",
  });

  useEffect(() => {
    fetchBonuses();
    fetchCasinos();
  }, []);

  const fetchCasinos = async () => {
    try {
      const response = await fetch("/api/admin/casinos");
      if (response.ok) {
        const data = await response.json();
        setCasinos(data.casinos || []);
      }
    } catch (err) {
      console.error("Error fetching casinos:", err);
    }
  };

  const fetchBonuses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/bonuses");
      
      if (response.status === 401) {
        router.push("/admin");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch bonuses");
      }

      const data = await response.json();
      setBonuses(data.bonuses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bonuses");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (bonus: Bonus) => {
    setEditingId(bonus.id);
    setEditData({
      title: bonus.title,
      description: bonus.description,
      link: bonus.link,
      image: bonus.image,
      tags: bonus.tags || [],
      terms: bonus.terms || "",
      wagering: bonus.wagering || "",
      minDeposit: bonus.minDeposit || "",
      casino: bonus.casino || bonus.brandName || "",
      casinoId: bonus.casinoId || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (bonusId: string, bonusTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${bonusTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/bonuses?id=${bonusId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete bonus");
      }

      // Refresh bonuses first
      await fetchBonuses();
      
      // Reorder remaining bonuses sequentially
      const reorderResponse = await fetch("/api/admin/bonuses/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reorderAll: true }),
      });

      if (reorderResponse.ok) {
        // Refresh again to get reordered list
        await fetchBonuses();
      }

      setSuccess("Bonus deleted and list reordered successfully!");
      
      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete bonus");
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/admin/bonuses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          ...editData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update bonus");
      }

      // Refresh bonuses
      await fetchBonuses();
      setEditingId(null);
      setEditData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleAddBonus = async () => {
    if (!newBonus.title || !newBonus.link) {
      setError("Title and link are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Get the highest order value and add 1 (next position after the last one)
      const maxOrder = bonuses.length > 0 
        ? Math.max(...bonuses.map((b, idx) => (b as any).order ?? idx))
        : -1;

      const response = await fetch("/api/admin/bonuses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newBonus,
          order: maxOrder + 1,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create bonus");
      }

      // Refresh bonuses
      await fetchBonuses();
      setShowAddForm(false);
      setNewBonus({
        title: "",
        description: "",
        link: "",
        image: "",
        tags: [],
        terms: "",
        wagering: "",
        minDeposit: "",
        casino: "",
        casinoId: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create bonus");
    } finally {
      setSaving(false);
    }
  };

  const handleOrderChange = async (bonusId: string, newOrder: number) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (newOrder < 0) {
        setError("Order must be 0 or greater");
        return;
      }

      // Check if another bonus already has this order
      const existingBonus = bonuses.find(b => {
        const bonusOrder = (b as any).order ?? bonuses.indexOf(b);
        return b.id !== bonusId && bonusOrder === newOrder;
      });

      if (existingBonus) {
        // Swap orders: get the current bonus's order
        const currentBonus = bonuses.find(b => b.id === bonusId);
        const currentOrder = currentBonus ? ((currentBonus as any).order ?? bonuses.indexOf(currentBonus)) : newOrder;

        // Use the reorder endpoint to swap
        const response = await fetch("/api/admin/bonuses/reorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bonusId1: bonusId,
            bonusId2: existingBonus.id,
            order1: newOrder,
            order2: currentOrder,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to swap orders");
        }
      } else {
        // Just update this bonus's order
        const response = await fetch("/api/admin/bonuses", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: bonusId,
            order: newOrder,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to update order");
        }
      }

      setSuccess("Order updated successfully!");
      
      // Refresh bonuses
      await fetchBonuses();
      
      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setSaving(false);
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
              <h1 className="text-3xl font-bold">Manage Bonuses</h1>
              <p className="text-muted-foreground">
                View and edit all bonuses from the database
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAddForm(!showAddForm)} 
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showAddForm ? "Cancel" : "Add Bonus"}
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

        {success && (
          <Card className="p-4 bg-emerald-500/10 border-emerald-500">
            <p className="text-emerald-700 dark:text-emerald-400">{success}</p>
          </Card>
        )}

        {/* Add Bonus Form */}
        {showAddForm && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Bonus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <Input
                  value={newBonus.title || ""}
                  onChange={(e) => setNewBonus({ ...newBonus, title: e.target.value })}
                  placeholder="Bonus Title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Casino</label>
                <select
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  value={newBonus.casinoId || ""}
                  onChange={(e) => {
                    const selectedCasino = casinos.find(c => c.id === e.target.value);
                    setNewBonus({ 
                      ...newBonus, 
                      casinoId: e.target.value,
                      casino: selectedCasino?.name || ""
                    });
                  }}
                >
                  <option value="">Select Casino (optional)</option>
                  {casinos.map((casino) => (
                    <option key={casino.id} value={casino.id}>
                      {casino.name}
                    </option>
                  ))}
                </select>
                {!newBonus.casinoId && (
                  <Input
                    className="mt-2"
                    value={newBonus.casino || ""}
                    onChange={(e) => setNewBonus({ ...newBonus, casino: e.target.value })}
                    placeholder="Or enter casino name manually"
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-background text-foreground"
                  value={newBonus.description || ""}
                  onChange={(e) => setNewBonus({ ...newBonus, description: e.target.value })}
                  placeholder="Bonus description..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Link *</label>
                <Input
                  value={newBonus.link || ""}
                  onChange={(e) => setNewBonus({ ...newBonus, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Image URL</label>
                <Input
                  value={newBonus.image || ""}
                  onChange={(e) => setNewBonus({ ...newBonus, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Wagering</label>
                <Input
                  value={newBonus.wagering || ""}
                  onChange={(e) => setNewBonus({ ...newBonus, wagering: e.target.value })}
                  placeholder="35x"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Min Deposit</label>
                <Input
                  value={newBonus.minDeposit || ""}
                  onChange={(e) => setNewBonus({ ...newBonus, minDeposit: e.target.value })}
                  placeholder="$20"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Terms</label>
                <Input
                  value={newBonus.terms || ""}
                  onChange={(e) => setNewBonus({ ...newBonus, terms: e.target.value })}
                  placeholder="18+. T&Cs apply."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tags</label>
                <select
                  multiple
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-background"
                  value={(newBonus.tags as string[]) || []}
                  onChange={(e) => {
                    const selected = Array.from(e.currentTarget.selectedOptions).map(o => o.value);
                    setNewBonus({ ...newBonus, tags: selected });
                  }}
                >
                  <option value="featured">featured</option>
                  <option value="welcome">welcome</option>
                  <option value="exclusive">exclusive</option>
                  <option value="standard">standard</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple.</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleAddBonus} disabled={saving || !newBonus.title || !newBonus.link}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Bonus
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline" disabled={saving}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <div className="grid gap-4">
          {bonuses.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No bonuses found in the database.</p>
            </Card>
          ) : (
            bonuses.map((bonus, index) => (
              <Card key={bonus.id} className="p-6">
                {editingId === bonus.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Editing: {bonus.title}</h3>
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
                        <label className="text-sm font-medium mb-1 block">Title</label>
                        <Input
                          value={editData.title || ""}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Casino</label>
                        <select
                          className="w-full px-3 py-2 rounded-md border bg-background"
                          value={editData.casinoId || ""}
                          onChange={(e) => {
                            const selectedCasino = casinos.find(c => c.id === e.target.value);
                            setEditData({ 
                              ...editData, 
                              casinoId: e.target.value,
                              casino: selectedCasino?.name || ""
                            });
                          }}
                        >
                          <option value="">Select Casino (optional)</option>
                          {casinos.map((casino) => (
                            <option key={casino.id} value={casino.id}>
                              {casino.name}
                            </option>
                          ))}
                        </select>
                        {!editData.casinoId && (
                          <Input
                            className="mt-2"
                            value={editData.casino || ""}
                            onChange={(e) => setEditData({ ...editData, casino: e.target.value })}
                            placeholder="Or enter casino name manually"
                          />
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <textarea
                          className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-background text-foreground"
                          value={editData.description || ""}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Link</label>
                        <Input
                          value={editData.link || ""}
                          onChange={(e) => setEditData({ ...editData, link: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Image URL</label>
                        <Input
                          value={editData.image || ""}
                          onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Wagering</label>
                        <Input
                          value={editData.wagering || ""}
                          onChange={(e) => setEditData({ ...editData, wagering: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Min Deposit</label>
                        <Input
                          value={editData.minDeposit || ""}
                          onChange={(e) => setEditData({ ...editData, minDeposit: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-1 block">Terms</label>
                        <Input
                          value={editData.terms || ""}
                          onChange={(e) => setEditData({ ...editData, terms: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Tags</label>
                        <select
                          multiple
                          className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-transparent"
                          value={(editData.tags as string[]) || []}
                          onChange={(e) => {
                            const selected = Array.from(e.currentTarget.selectedOptions).map(o => o.value);
                            setEditData({ ...editData, tags: selected });
                          }}
                        >
                          <option value="featured">featured</option>
                          <option value="welcome">welcome</option>
                          <option value="exclusive">exclusive</option>
                          <option value="standard">standard</option>
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <label className="text-xs font-medium text-muted-foreground mb-1">Order</label>
                      <Input
                        type="number"
                        min="0"
                        value={(bonus as any).order ?? index}
                        onChange={(e) => {
                          const newOrder = parseInt(e.target.value) || 0;
                          handleOrderChange(bonus.id, newOrder);
                        }}
                        className="w-16 text-center font-semibold"
                        disabled={saving}
                      />
                      <div className="text-xs text-muted-foreground text-center">
                        Position: {(bonus as any).order !== undefined ? (bonus as any).order + 1 : index + 1}
                      </div>
                    </div>
                    <div className="relative w-24 h-24 shrink-0">
                      <Image
                        src={bonus.image}
                        alt={bonus.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{bonus.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {bonus.casino || bonus.brandName || "No casino name"}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {bonus.description}
                          </p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            {bonus.wagering && <span>Wagering: {bonus.wagering}</span>}
                            {bonus.minDeposit && <span>Min: {bonus.minDeposit}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEdit(bonus)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(bonus.id, bonus.title)}
                            variant="destructive"
                            size="sm"
                            disabled={saving}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
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

