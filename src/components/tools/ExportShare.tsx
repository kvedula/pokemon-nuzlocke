'use client';

import React, { useState, useRef, useEffect } from 'react';
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

// Convert image URL to base64 data URL
async function imageToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

export function ExportShare({ open, onOpenChange }: ExportShareProps) {
  const currentRun = useRunStore((s) => s.currentRun);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [spriteCache, setSpriteCache] = useState<Record<number, string>>({});
  const [spritesLoaded, setSpritesLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Pre-load sprites when dialog opens
  useEffect(() => {
    if (!open || !currentRun) return;
    
    const loadSprites = async () => {
      setSpritesLoaded(false);
      const party = currentRun.party.map(id => currentRun.pokemon[id]).filter(Boolean);
      const cache: Record<number, string> = {};
      
      await Promise.all(
        party.map(async (p) => {
          const species = POKEMON_SPECIES[p.speciesId];
          if (species?.spriteUrl) {
            try {
              cache[p.speciesId] = await imageToBase64(species.spriteUrl);
            } catch (e) {
              // Fallback: keep empty, will show placeholder
              console.warn(`Failed to load sprite for ${p.species}`);
            }
          }
        })
      );
      
      setSpriteCache(cache);
      setSpritesLoaded(true);
    };
    
    loadSprites();
  }, [open, currentRun]);
  
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
    setExporting(true);
    
    try {
      const scale = 3; // Higher quality
      const width = 500;
      const height = 380;
      const padding = 24;
      
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.scale(scale, scale);
      
      // Rich gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, '#0c0a1d');
      bgGradient.addColorStop(0.5, '#1a1333');
      bgGradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      
      // Decorative circles in background
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(width - 60, 60, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(60, height - 40, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Accent line at top
      const accentGradient = ctx.createLinearGradient(0, 0, width, 0);
      accentGradient.addColorStop(0, '#ef4444');
      accentGradient.addColorStop(0.5, '#f59e0b');
      accentGradient.addColorStop(1, '#22c55e');
      ctx.fillStyle = accentGradient;
      ctx.fillRect(0, 0, width, 4);
      
      // Title with glow effect
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentRun.name, width / 2, 50);
      ctx.shadowBlur = 0;
      
      // Stats cards
      const stats = [
        { value: `${badges.length}/8`, label: 'BADGES', color: '#eab308', icon: '🏆' },
        { value: party.length.toString(), label: 'ALIVE', color: '#22c55e', icon: '💚' },
        { value: deaths.toString(), label: 'FALLEN', color: '#ef4444', icon: '💀' },
        { value: `${hours}:${minutes.toString().padStart(2, '0')}`, label: 'TIME', color: '#3b82f6', icon: '⏱️' },
      ];
      
      const cardWidth = 100;
      const cardHeight = 60;
      const cardSpacing = (width - padding * 2 - cardWidth * 4) / 3;
      const cardY = 70;
      
      stats.forEach((stat, i) => {
        const x = padding + (cardWidth + cardSpacing) * i;
        
        // Card background
        ctx.fillStyle = '#1e1b2e';
        ctx.beginPath();
        ctx.roundRect(x, cardY, cardWidth, cardHeight, 10);
        ctx.fill();
        
        // Card border glow
        ctx.strokeStyle = stat.color + '40';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Value
        ctx.fillStyle = stat.color;
        ctx.font = 'bold 22px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(stat.value, x + cardWidth / 2, cardY + 28);
        
        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 9px system-ui, sans-serif';
        ctx.fillText(stat.label, x + cardWidth / 2, cardY + 48);
      });
      
      // Team section header
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('MY TEAM', padding, 155);
      
      // Divider line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding + 60, 151);
      ctx.lineTo(width - padding, 151);
      ctx.stroke();
      
      // Pokemon row
      const pokemonY = 170;
      const pokemonSize = 56;
      const pokemonSpacing = (width - padding * 2) / 6;
      
      // Load and draw sprites
      for (let i = 0; i < 6; i++) {
        const x = padding + pokemonSpacing * i + pokemonSpacing / 2;
        const p = party[i];
        
        if (p) {
          const spriteData = spriteCache[p.speciesId];
          const typeColor = TYPE_COLORS[p.types[0]] || '#6b7280';
          
          // Glow under sprite
          ctx.shadowColor = typeColor;
          ctx.shadowBlur = 15;
          ctx.fillStyle = typeColor + '30';
          ctx.beginPath();
          ctx.arc(x, pokemonY + pokemonSize / 2, pokemonSize / 2 + 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          
          if (spriteData) {
            try {
              const img = new window.Image();
              img.src = spriteData;
              await new Promise((resolve) => { img.onload = resolve; });
              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(img, x - pokemonSize / 2, pokemonY, pokemonSize, pokemonSize);
            } catch (e) {
              ctx.fillStyle = typeColor;
              ctx.beginPath();
              ctx.arc(x, pokemonY + pokemonSize / 2, pokemonSize / 2 - 2, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            ctx.fillStyle = typeColor;
            ctx.beginPath();
            ctx.arc(x, pokemonY + pokemonSize / 2, pokemonSize / 2 - 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(p.nickname.charAt(0).toUpperCase(), x, pokemonY + pokemonSize / 2 + 7);
          }
          
          // Type badge
          ctx.fillStyle = typeColor;
          const badgeWidth = 36;
          ctx.beginPath();
          ctx.roundRect(x - badgeWidth / 2, pokemonY + pokemonSize + 4, badgeWidth, 14, 7);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.types[0].toUpperCase().substring(0, 4), x, pokemonY + pokemonSize + 14);
          
          // Nickname
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px system-ui, sans-serif';
          const nickname = p.nickname.length > 8 ? p.nickname.substring(0, 7) + '…' : p.nickname;
          ctx.fillText(nickname, x, pokemonY + pokemonSize + 32);
          
          // Level badge
          ctx.fillStyle = '#1e1b2e';
          ctx.beginPath();
          ctx.roundRect(x - 16, pokemonY + pokemonSize + 38, 32, 14, 7);
          ctx.fill();
          ctx.fillStyle = '#94a3b8';
          ctx.font = '9px system-ui, sans-serif';
          ctx.fillText(`Lv.${p.level}`, x, pokemonY + pokemonSize + 49);
        } else {
          // Empty slot
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.arc(x, pokemonY + pokemonSize / 2, pokemonSize / 2 - 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Plus icon
          ctx.fillStyle = '#334155';
          ctx.fillRect(x - 8, pokemonY + pokemonSize / 2 - 1, 16, 2);
          ctx.fillRect(x - 1, pokemonY + pokemonSize / 2 - 8, 2, 16);
        }
      }
      
      // Footer divider
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, height - 45);
      ctx.lineTo(width - padding, height - 45);
      ctx.stroke();
      
      // Footer with Pokeball icon
      ctx.textAlign = 'center';
      
      // Draw mini Pokeball
      const ballX = width / 2 - 85;
      const ballY = height - 26;
      const ballR = 8;
      // Top half (red)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballR, Math.PI, 0);
      ctx.fill();
      // Bottom half (white)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballR, 0, Math.PI);
      ctx.fill();
      // Center line
      ctx.fillStyle = '#1e1b2e';
      ctx.fillRect(ballX - ballR, ballY - 1.5, ballR * 2, 3);
      // Center circle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e1b2e';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Footer text
      ctx.fillStyle = '#64748b';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('Nuzlocke Tracker', width / 2 + 10, height - 22);
      
      // Date
      const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      ctx.fillStyle = '#475569';
      ctx.font = '9px system-ui, sans-serif';
      ctx.fillText(date, width - padding - 30, height - 22);
      
      // Download
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentRun.name.replace(/\s+/g, '-').toLowerCase()}-summary.png`;
      a.click();
    } catch (error) {
      console.error('Failed to export image:', error);
      alert('Failed to export image. Please try again.');
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
            {/* Visual Card Preview - Matching the canvas export design */}
            <div 
              ref={cardRef}
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0c0a1d 0%, #1a1333 50%, #0f172a 100%)',
                border: '1px solid #334155',
                color: '#ffffff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent line */}
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: '3px', 
                background: 'linear-gradient(to right, #ef4444, #f59e0b, #22c55e)' 
              }} />
              
              {/* Title */}
              <div style={{ textAlign: 'center', marginBottom: '12px', marginTop: '8px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, textShadow: '0 0 20px #a855f7' }}>{currentRun.name}</h3>
              </div>
              
              {/* Stats cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {[
                  { value: `${badges.length}/8`, label: 'BADGES', color: '#eab308' },
                  { value: party.length.toString(), label: 'ALIVE', color: '#22c55e' },
                  { value: deaths.toString(), label: 'FALLEN', color: '#ef4444' },
                  { value: `${hours}:${minutes.toString().padStart(2, '0')}`, label: 'TIME', color: '#3b82f6' },
                ].map((stat, i) => (
                  <div key={i} style={{ 
                    background: '#1e1b2e', 
                    borderRadius: '8px', 
                    padding: '10px 8px',
                    textAlign: 'center',
                    border: `1px solid ${stat.color}40`,
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 'bold' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* MY TEAM header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8' }}>MY TEAM</span>
                <div style={{ flex: 1, height: '1px', background: '#334155' }} />
              </div>
              
              {/* Pokemon grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '16px' }}>
                {party.map((p) => {
                  const cachedSprite = spriteCache[p.speciesId];
                  const primaryType = p.types[0];
                  const typeColor = TYPE_COLORS[primaryType] || '#6b7280';
                  return (
                    <div key={p.id} style={{ textAlign: 'center' }}>
                      <div style={{ 
                        position: 'relative',
                        width: '48px', 
                        height: '48px', 
                        margin: '0 auto',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${typeColor}30 0%, transparent 70%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {cachedSprite ? (
                          <img 
                            src={cachedSprite}
                            alt={p.species}
                            style={{ width: '44px', height: '44px', imageRendering: 'pixelated' }}
                          />
                        ) : (
                          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{p.nickname.charAt(0)}</span>
                        )}
                      </div>
                      <div style={{ 
                        marginTop: '4px',
                        padding: '2px 6px', 
                        borderRadius: '6px', 
                        background: typeColor,
                        fontSize: '7px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                      }}>
                        {primaryType.toUpperCase().substring(0, 4)}
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '2px' }}>
                        {p.nickname.length > 7 ? p.nickname.substring(0, 6) + '…' : p.nickname}
                      </div>
                      <div style={{ 
                        fontSize: '8px', 
                        color: '#94a3b8',
                        background: '#1e1b2e',
                        borderRadius: '4px',
                        padding: '1px 6px',
                        display: 'inline-block',
                      }}>
                        Lv.{p.level}
                      </div>
                    </div>
                  );
                })}
                {Array.from({ length: 6 - party.length }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      margin: '0 auto', 
                      borderRadius: '50%', 
                      border: '2px dashed #334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#334155',
                      fontSize: '20px',
                    }}>+</div>
                  </div>
                ))}
              </div>
              
              {/* Footer */}
              <div style={{ 
                borderTop: '1px solid #334155', 
                paddingTop: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '8px',
              }}>
                <div style={{ 
                  width: '14px', 
                  height: '14px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(to bottom, #ef4444 50%, #ffffff 50%)',
                  border: '1px solid #333',
                  position: 'relative',
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#fff',
                    border: '1px solid #333',
                  }} />
                </div>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Nuzlocke Tracker</span>
              </div>
            </div>
            
            <Button onClick={exportImage} disabled={exporting || !spritesLoaded} className="w-full gap-2">
              <Image className="w-4 h-4" />
              {!spritesLoaded ? 'Loading sprites...' : exporting ? 'Generating...' : 'Download as Image'}
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
