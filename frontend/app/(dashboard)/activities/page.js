"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity as ActivityIcon, Upload, Users, CheckCircle2, FileText, Settings2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { activitiesApi } from "@/lib/api";
import { getInitials, formatDateTime } from "@/lib/utils";

const TYPE_ICON = {
  visit: CheckCircle2,
  upload: Upload,
  meeting: Users,
  operation: CheckCircle2,
  blog: FileText,
  system: Settings2,
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activitiesApi
      .list({ limit: 50 })
      .then((res) => setActivities(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Activities" description="Recent actions and events across your clinic." />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <EmptyState icon={ActivityIcon} title="No activity yet" />
      ) : (
        <div className="relative space-y-4 before:absolute before:bottom-0 before:left-[27px] before:top-2 before:w-px before:bg-border">
          {activities.map((activity, i) => {
            const Icon = TYPE_ICON[activity.type] || ActivityIcon;
            return (
              <motion.div
                key={activity._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                className="relative pl-14"
              >
                <div className="absolute left-0 top-1 flex h-14 w-14 items-center justify-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={activity.actorAvatar} />
                          <AvatarFallback className="text-[10px]">{getInitials(activity.actor)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDateTime(activity.createdAt)}</span>
                    </div>
                    {activity.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{activity.description}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
