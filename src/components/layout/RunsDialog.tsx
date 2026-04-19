'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { getRunSummaries, deleteRun as deleteRunFromDB, getRun } from '@/lib/db';
import { RunSummary, NuzlockeRun } from '@/types';
import { cn } from '@/lib/utils';
import {
  Flame,
  Leaf,
  Trophy,
  Skull,
  Users,
  Clock,
  Trash2,
  Play,
  Plus,
  Loader2,
  AlertTriangle,
  Gamepad2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';

interface RunsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewRun: () => void;
}

function RunCard({ 
  run, 
  isActive, 
  onSelect, 
  onDelete 
}: { 
  run: RunSummary; 
  isActive: boolean; 
  onSelect: () => void;
  onDelete: () => void;
}) {
  const isNuzlocke = run.gameMode === 'nuzlocke';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'p-4 rounded-xl border transition-all',
        isActive 
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Game Icon */}
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
            run.game === 'firered' 
              ? 'bg-gradient-to-br from-orange-500 to-red-600' 
              : 'bg-gradient-to-br from-green-500 to-emerald-600'
          )}>
            {run.game === 'firered' ? (
              <Flame className="w-6 h-6 text-white" />
            ) : (
              <Leaf className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold truncate">{run.name}</h3>
              {isActive && (
                <Badge variant="default" className="text-[10px]">Active</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={isNuzlocke ? 'destructive' : 'secondary'}
                className="text-[10px]"
              >
                {isNuzlocke ? (
                  <>
                    <Skull className="w-3 h-3 mr-1" />
                    Nuzlocke
                  </>
                ) : (
                  <>
                    <Gamepad2 className="w-3 h-3 mr-1" />
                    Normal
                  </>
                )}
              </Badge>
              <Badge 
                variant={
                  run.status === 'active' ? 'outline' : 
                  run.status === 'completed' ? 'default' : 'destructive'
                }
                className="text-[10px] capitalize"
              >
                {run.status}
              </Badge>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                <span>{run.badgeCount}/8</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>{run.partyCount}</span>
              </div>
              {isNuzlocke && (
                <div className="flex items-center gap-1">
                  <Skull className="w-3.5 h-3.5 text-red-500" />
                  <span>{run.deathCount}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Last played {formatDistanceToNow(new Date(run.lastModified), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {!isActive && (
            <Button size="sm" onClick={onSelect} className="gap-1">
              <Play className="w-3 h-3" />
              Load
            </Button>
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function RunsDialog({ open, onOpenChange, onNewRun }: RunsDialogProps) {
  const currentRun = useRunStore((s) => s.currentRun);
  const loadRun = useRunStore((s) => s.loadRun);
  const deleteCurrentRun = useRunStore((s) => s.deleteRun);
  
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loadingRunId, setLoadingRunId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadRuns();
    }
  }, [open]);

  const loadRuns = async () => {
    setLoading(true);
    try {
      const summaries = await getRunSummaries();
      setRuns(summaries);
    } catch (error) {
      console.error('Failed to load runs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRun = async (runId: string) => {
    if (runId === currentRun?.id) return;
    
    setLoadingRunId(runId);
    try {
      const run = await getRun(runId);
      if (run) {
        loadRun(run);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Failed to load run:', error);
    } finally {
      setLoadingRunId(null);
    }
  };

  const handleDeleteRun = async (runId: string) => {
    try {
      await deleteRunFromDB(runId);
      if (currentRun?.id === runId) {
        deleteCurrentRun();
      }
      await loadRuns();
    } catch (error) {
      console.error('Failed to delete run:', error);
    }
    setDeleteConfirmId(null);
  };

  const handleNewRun = () => {
    onOpenChange(false);
    onNewRun();
  };

  const runToDelete = runs.find(r => r.id === deleteConfirmId);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <span className="text-lg">🔥</span>
              </div>
              Your Runs
            </DialogTitle>
            <DialogDescription>
              Manage your Nuzlocke runs and playthroughs. Select a run to continue or start a new adventure.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto py-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : runs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                  <Gamepad2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No runs yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Start your first Pokémon adventure!
                </p>
                <Button onClick={handleNewRun}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Run
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {runs.map((run) => (
                    <RunCard
                      key={run.id}
                      run={run}
                      isActive={currentRun?.id === run.id}
                      onSelect={() => handleSelectRun(run.id)}
                      onDelete={() => setDeleteConfirmId(run.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handleNewRun}>
              <Plus className="w-4 h-4 mr-2" />
              New Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Run?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>"{runToDelete?.name}"</strong>? 
              This action cannot be undone. All progress, Pokémon, and data will be permanently lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDeleteRun(deleteConfirmId)}
            >
              Delete Forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
