"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Shield } from "lucide-react";
import { SettingsForm } from "./settings-form";
import { useTranslation } from "@/hooks/use-translation";
import { formatXP } from "@/lib/utils";

// ============================================
// ТИПЫ
// ============================================

interface Props {
  initialName: string;
  email: string | null;
  role: string;
  createdAt: string;
  totalXP: number;
}

// ============================================
// SETTINGS CLIENT COMPONENT
// ============================================

export function SettingsClient({ initialName, email, role, createdAt, totalXP }: Props) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-syne text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-emerald-400" />
          {t("settings.title")}
        </h1>
        <p className="text-gray-400 mt-1">{t("settings.subtitle")}</p>
      </div>

      {/* Профиль */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-4 h-4 text-emerald-400" />
            {t("settings.profile")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm initialName={initialName} />
        </CardContent>
      </Card>

      {/* Информация об аккаунте */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="w-4 h-4 text-emerald-400" />
            {t("settings.account")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-400 text-sm">{t("settings.email")}</span>
            <span className="text-white text-sm font-medium">{email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-400 text-sm">{t("settings.role")}</span>
            <Badge variant={role === "admin" ? "default" : "secondary"}>
              {role === "admin" ? t("settings.admin") : t("settings.student")}
            </Badge>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-400 text-sm">{t("settings.registered")}</span>
            <span className="text-white text-sm">
              {new Date(createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 text-sm">{t("settings.totalXP")}</span>
            <span className="text-emerald-400 text-sm font-semibold">
              {formatXP(totalXP)} XP
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
