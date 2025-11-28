"use client";

import { Bonus } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Gift, Copy, CheckCircle2 } from "lucide-react";

interface BonusCardProps {
  bonus: Bonus;
}

export function BonusCard({ bonus }: BonusCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-foreground/5 bg-card shadow-xl transition-all duration-500 hover:border-purple-500/30 hover:shadow-purple-500/10 hover:-translate-y-1">
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="flex flex-col md:flex-row">
        {/* Image/Icon Section */}
        <div className="relative flex h-48 w-full shrink-0 items-center justify-center overflow-hidden bg-muted/50 md:h-auto md:w-64">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 dark:from-purple-900/20 dark:to-blue-900/20" />
          
          <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-110">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-background shadow-inner border border-foreground/5">
              <Gift className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          {bonus.exclusive && (
            <div className="absolute top-4 left-4 z-20">
              <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 border-none font-bold shadow-lg shadow-yellow-500/20">
                EXCLUSIVE
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {bonus.title}
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {bonus.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-foreground/10 bg-foreground/5 text-xs font-medium text-muted-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-3 py-1.5 ring-1 ring-yellow-500/20">
                <span className="text-sm font-bold text-yellow-600 dark:text-yellow-500">{bonus.rating}</span>
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              </div>
            </div>

            <p className="text-muted-foreground line-clamp-2 leading-relaxed">
              {bonus.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-500" />
                    <span>Verified today</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-foreground/20" />
                <span>{bonus.terms}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end pt-6 border-t border-foreground/5">
             {bonus.code && (
                 <div className="flex items-center justify-between rounded-lg border border-dashed border-foreground/20 bg-foreground/5 px-4 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer group/code w-full sm:w-auto">
                     <span className="font-bold tracking-wider">{bonus.code}</span>
                     <Copy className="ml-3 h-3.5 w-3.5 opacity-50 group-hover/code:opacity-100 transition-opacity" />
                 </div>
             )}
            <Button className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 font-bold shadow-lg shadow-foreground/5 transition-all hover:scale-105">
              Get Bonus <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
