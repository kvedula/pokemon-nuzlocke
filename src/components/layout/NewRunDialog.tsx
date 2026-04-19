'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunStore } from '@/store/runStore';
import { getStarterOptions, POKEMON_SPECIES } from '@/data/pokemon';
import { GameMode } from '@/types';
import { cn } from '@/lib/utils';
import { Flame, Leaf, Check, Skull, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RULE_PRESETS, DEFAULT_RULES } from '@/data/rules';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NewRunDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRunCreated: () => void;
}

export function NewRunDialog({ open, onOpenChange, onRunCreated }: NewRunDialogProps) {
  const createRun = useRunStore((s) => s.createRun);
  const addPokemon = useRunStore((s) => s.addPokemon);
  
  const [step, setStep] = useState(1);
  const [runName, setRunName] = useState('');
  const [game, setGame] = useState<'firered' | 'leafgreen'>('firered');
  const [gameMode, setGameMode] = useState<GameMode>('nuzlocke');
  const [selectedStarter, setSelectedStarter] = useState<number | null>(null);
  const [starterNickname, setStarterNickname] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('standard');

  const starters = getStarterOptions();

  const totalSteps = gameMode === 'nuzlocke' ? 4 : 3;

  const handleCreate = () => {
    const run = createRun(
      runName || `${game === 'firered' ? 'FireRed' : 'LeafGreen'} ${gameMode === 'nuzlocke' ? 'Nuzlocke' : 'Run'}`,
      game,
      gameMode
    );

    if (selectedStarter) {
      const species = POKEMON_SPECIES[selectedStarter];
      addPokemon({
        speciesId: selectedStarter,
        nickname: starterNickname || species.name,
        species: species.name,
        types: species.types,
        level: 5,
        nature: 'Hardy',
        ability: species.abilities[0],
        currentHp: species.baseStats.hp + 15,
        maxHp: species.baseStats.hp + 15,
        stats: {
          hp: species.baseStats.hp + 15,
          attack: species.baseStats.attack + 5,
          defense: species.baseStats.defense + 5,
          spAtk: species.baseStats.spAtk + 5,
          spDef: species.baseStats.spDef + 5,
          speed: species.baseStats.speed + 5,
        },
        moves: [],
        heldItem: null,
        statusCondition: 'healthy',
        status: 'active',
        encounteredAt: 'pallet-town',
        encounteredDate: new Date().toISOString(),
        capturedDate: new Date().toISOString(),
        deathDate: null,
        deathCause: null,
        deathLocation: null,
        notes: 'Starter Pokémon from Professor Oak',
        isShiny: false,
        gender: 'male',
        metLevel: 5,
      });
    }

    setStep(1);
    setRunName('');
    setGameMode('nuzlocke');
    setSelectedStarter(null);
    setStarterNickname('');
    onOpenChange(false);
    onRunCreated();
  };

  const canProceed = step === 1 ? true : step === 2 ? true : step === 3 ? selectedStarter !== null : true;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {game === 'firered' ? (
              <Flame className="w-5 h-5 text-orange-500" />
            ) : (
              <Leaf className="w-5 h-5 text-green-500" />
            )}
            New {gameMode === 'nuzlocke' ? 'Nuzlocke' : 'Playthrough'}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && 'Set up your new adventure'}
            {step === 2 && 'Choose your game mode'}
            {step === 3 && 'Choose your starter Pokémon'}
            {step === 4 && 'Select your ruleset'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <React.Fragment key={s}>
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    step >= s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < totalSteps && (
                  <div
                    className={cn(
                      'flex-1 h-1 rounded',
                      step > s ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="runName">Run Name</Label>
                  <Input
                    id="runName"
                    placeholder="My Epic Nuzlocke"
                    value={runName}
                    onChange={(e) => setRunName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Game Version</Label>
                  <RadioGroup
                    value={game}
                    onValueChange={(v) => setGame(v as 'firered' | 'leafgreen')}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="firered"
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                        game === 'firered'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-muted hover:border-muted-foreground/50'
                      )}
                    >
                      <RadioGroupItem value="firered" id="firered" />
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">FireRed</span>
                      </div>
                    </Label>
                    <Label
                      htmlFor="leafgreen"
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                        game === 'leafgreen'
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-muted hover:border-muted-foreground/50'
                      )}
                    >
                      <RadioGroupItem value="leafgreen" id="leafgreen" />
                      <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-500" />
                        <span className="font-medium">LeafGreen</span>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {/* Step 2: Game Mode */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <RadioGroup
                  value={gameMode}
                  onValueChange={(v) => setGameMode(v as GameMode)}
                  className="grid grid-cols-1 gap-4"
                >
                  <Label
                    htmlFor="nuzlocke"
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                      gameMode === 'nuzlocke'
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <RadioGroupItem value="nuzlocke" id="nuzlocke" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Skull className="w-5 h-5 text-red-500" />
                        <span className="font-semibold">Nuzlocke Challenge</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Permadeath, first encounter per route only, nickname all Pokémon. 
                        The ultimate test of skill and attachment.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className="text-[10px]">Permadeath</Badge>
                        <Badge variant="outline" className="text-[10px]">Limited Catches</Badge>
                        <Badge variant="outline" className="text-[10px]">Custom Rules</Badge>
                      </div>
                    </div>
                  </Label>
                  
                  <Label
                    htmlFor="normal"
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                      gameMode === 'normal'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <RadioGroupItem value="normal" id="normal" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold">Normal Playthrough</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Track your journey without restrictions. Catch unlimited Pokémon, 
                        no permadeath - just pure fun and nostalgia.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className="text-[10px]">Unlimited Catches</Badge>
                        <Badge variant="outline" className="text-[10px]">No Permadeath</Badge>
                        <Badge variant="outline" className="text-[10px]">Casual Play</Badge>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              </motion.div>
            )}

            {/* Step 3: Starter Selection */}
            {step === 3 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-3">
                  {starters.map((starter) => (
                    <button
                      key={starter.id}
                      onClick={() => {
                        setSelectedStarter(starter.id);
                        setStarterNickname('');
                      }}
                      className={cn(
                        'p-4 rounded-lg border-2 transition-all text-center',
                        selectedStarter === starter.id
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-muted-foreground/50'
                      )}
                    >
                      <img
                        src={starter.spriteUrl}
                        alt={starter.name}
                        className="w-16 h-16 mx-auto pixelated"
                      />
                      <p className="font-medium mt-2">{starter.name}</p>
                      <div className="flex justify-center gap-1 mt-1">
                        {starter.types.map((type) => (
                          <Badge key={type} variant="secondary" className="text-[10px]">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedStarter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="nickname">Nickname (optional)</Label>
                    <Input
                      id="nickname"
                      placeholder={POKEMON_SPECIES[selectedStarter]?.name}
                      value={starterNickname}
                      onChange={(e) => setStarterNickname(e.target.value)}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 4: Rules (Nuzlocke only) */}
            {step === 4 && gameMode === 'nuzlocke' && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <RadioGroup
                  value={selectedPreset}
                  onValueChange={setSelectedPreset}
                  className="space-y-3"
                >
                  {RULE_PRESETS.map((preset) => (
                    <Label
                      key={preset.id}
                      htmlFor={preset.id}
                      className={cn(
                        'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                        selectedPreset === preset.id
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-muted-foreground/50'
                      )}
                    >
                      <RadioGroupItem value={preset.id} id={preset.id} className="mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">{preset.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {preset.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {preset.rules.slice(0, 4).map((ruleId) => {
                            const rule = DEFAULT_RULES.find((r) => r.id === ruleId);
                            return rule ? (
                              <Badge key={ruleId} variant="outline" className="text-[10px]">
                                {rule.name}
                              </Badge>
                            ) : null;
                          })}
                          {preset.rules.length > 4 && (
                            <Badge variant="outline" className="text-[10px]">
                              +{preset.rules.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < totalSteps ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed}>
              Next
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              Start Adventure!
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
