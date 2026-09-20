"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Loader2, Save, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { useThemeColor } from "@/lib/theme-color-context";
import { useToast } from "@/lib/toast-context";
import { authApi } from "@/lib/api";
import { getInitials, cn } from "@/lib/utils";

export default function SettingsPage() {
  const { admin, setAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const { color, setColor, presets } = useThemeColor();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: admin?.name || "",
    clinicName: admin?.clinicName || "",
    avatar: admin?.avatar || "",
    password: "",
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authApi.updateMe(form);
      setAdmin(data.admin);
      localStorage.setItem("preclinic_admin", JSON.stringify(data.admin));
      toast({ title: "Profile updated", variant: "success" });
      setForm((f) => ({ ...f, password: "" }));
    } catch (err) {
      toast({ title: "Could not update profile", description: err?.response?.data?.message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your admin profile and dashboard appearance." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
            <CardDescription>Update your account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={form.avatar} alt={form.name} />
                  <AvatarFallback className="text-lg">{getInitials(form.name || "AD")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1.5">
                  <Label>Avatar URL</Label>
                  <Input
                    value={form.avatar}
                    onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Clinic name</Label>
                  <Input
                    value={form.clinicName}
                    onChange={(e) => setForm((f) => ({ ...f, clinicName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={admin?.email || ""} disabled />
              </div>

              <div className="space-y-1.5">
                <Label>New password</Label>
                <Input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Switch between light and dark mode.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Dark mode</span>
              <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard color</CardTitle>
              <CardDescription>Pick your dashboard&apos;s primary accent color.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setColor(preset.value)}
                    className="flex flex-col items-center gap-1.5"
                    title={preset.name}
                    type="button"
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-card transition-all",
                        color === preset.value ? "ring-foreground" : "ring-transparent"
                      )}
                      style={{ backgroundColor: `hsl(${preset.primary})` }}
                    >
                      {color === preset.value && <Check className="h-4 w-4 text-white" />}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{preset.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
