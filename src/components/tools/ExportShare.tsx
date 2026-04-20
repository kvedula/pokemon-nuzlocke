'use client';

import React, { useState, useRef } from 'react';
import { useRunStore } from '@/store/runStore';
import { POKEMON_SPECIES, TYPE_COLORS } from '@/data/pokemon';
import { cn } from '@/lib/utils';
import {
  Download,
  Share2,
  Copy,
  Check,
  Image,
  FileJson,
  Clipboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface ExportShareProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportShare({ open, onOpenChange }: ExportShareProps) {
  const currentRun = useRunStore((s) => s.currentRun);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  if (!currentRun) return null;
  
  const party = currentRun.party.map(id => currentRun.pokemon[id]).filter(Boolean);
  const badges = currentRun.badges.filter(b => b.obtained);
  const deaths = currentRun.graveyard.length;
  const hours = Math.floor(currentRun.playTime / 60);
  const minutes = currentRun.playTime % 60;
  
  const generateTextSummary = () => {
    let text = `🎮 ${currentRun.name}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🏆 Badges: ${badges.length}/8\n`;
    text += `⏱️ Time: ${hours}h ${minutes}m\n`;
    text += `💀 Deaths: ${deaths}\n`;
    text += `\n👥 Team:\n`;
    
    party.forEach((p, i) => {
      const species = POKEMON_SPECIES[p.speciesId];
      text += `${i + 1}. ${p.nickname} (${p.species}) Lv.${p.level}\n`;
    });
    
    if (deaths > 0) {
      text += `\n🪦 Fallen:\n`;
      currentRun.graveyard.forEach(id => {
        const p = currentRun.pokemon[id];
        if (p) text += `• ${p.nickname} (${p.species})\n`;
      });
    }
    
    text += `\n#Nuzlocke #Pokemon`;
    return text;
  };
  
  const copyToClipboard = async () => {
    const text = generateTextSummary();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const exportJSON = () => {
    const data = JSON.stringify(currentRun, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentRun.name.replace(/\s+/g, '-').toLowerCase()}-nuzlocke.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const exportImage = async () => {
    if (!cardRef.current) return;
    
    setExporting(true);
    
    try {
      // Dynamic import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1a1a1a',
        scale: 2,
      });
      
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentRun.name.replace(/\s+/g, '-').toLowerCase()}-summary.png`;
      a.click();
    } catch (error) {
      console.error('Failed to export image:', error);
    }
    
    setExporting(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Export & Share
          </DialogTitle>
          <DialogDescription>
            Share your Nuzlocke progress with others
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="preview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4">
            {/* Visual Card Preview */}
            <div 
              ref={cardRef}
              className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border"
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">{currentRun.name}</h3>
                <p className="text-sm text-muted-foreground">Nuzlocke Challenge</p>
              </div>
              
              <div className="flex justify-center gap-6 mb-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{badges.length}</div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{party.length}</div>
                  <div className="text-xs text-muted-foreground">Team</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{deaths}</div>
                  <div className="text-xs text-muted-foreground">Deaths</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{hours}:{minutes.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-muted-foreground">Time</div>
                </div>
              </div>
              
              <div className="grid grid-cols-6 gap-2 mb-4">
                {party.map((p) => {
                  const species = POKEMON_SPECIES[p.speciesId];
                  return (
                    <div key={p.id} className="text-center">
                      {species && (
                        <img 
                          src={species.spriteUrl} 
                          alt={p.species}
                          className="w-10 h-10 mx-auto pixelated"
                        />
                      )}
                      <div className="text-[10px] truncate">{p.nickname}</div>
                      <div className="text-[8px] text-muted-foreground">Lv.{p.level}</div>
                    </div>
                  );
                })}
                {Array.from({ length: 6 - party.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="text-center opacity-30">
                    <div className="w-10 h-10 mx-auto rounded-full border-2 border-dashed" />
                  </div>
                ))}
              </div>
              
              <div className="text-center text-xs text-muted-foreground">
                Tracked with Nuzlocke Tracker
              </div>
            </div>
            
            <Button onClick={exportImage} disabled={exporting} className="w-full gap-2">
              <Image className="w-4 h-4" />
              {exporting ? 'Generating...' : 'Download as Image'}
            </Button>
          </TabsContent>
          
          <TabsContent value="text" className="space-y-4">
            <pre className="p-4 rounded-lg bg-muted text-xs whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {generateTextSummary()}
            </pre>
            
            <Button onClick={copyToClipboard} className="w-full gap-2">
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Clipboard className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export your full run data as JSON. This can be used to backup your progress or import into another device.
            </p>
            
            <Button onClick={exportJSON} className="w-full gap-2">
              <FileJson className="w-4 h-4" />
              Export JSON Data
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
