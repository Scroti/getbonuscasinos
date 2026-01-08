import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");

  if (!adminToken) {
    return false;
  }

  // Verify token matches expected value
  const expectedToken = process.env.ADMIN_TOKEN || "admin_authenticated";
  return adminToken.value === expectedToken;
}

export default async function AdminDashboard() {
  const isAuthenticated = await verifyAdmin();

  if (!isAuthenticated) {
    redirect("/admin");
  }

  async function handleLogout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    redirect("/admin");
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
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to the admin panel
              </p>
            </div>
          </div>
          <form action={handleLogout}>
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/admin/dashboard/bonuses">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Manage Bonuses</h3>
                  <p className="text-sm text-muted-foreground">
                    View and edit all bonuses from the database
                  </p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/admin/dashboard/casinos">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Manage Casinos</h3>
                  <p className="text-sm text-muted-foreground">
                    View, add, and edit casinos in the database
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

