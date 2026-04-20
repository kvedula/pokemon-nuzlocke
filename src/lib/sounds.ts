'use client';

// Sound effect URLs (using free sound effects)
const SOUND_URLS = {
  catch: '/sounds/catch.mp3',
  death: '/sounds/death.mp3',
  badge: '/sounds/badge.mp3',
  levelUp: '/sounds/levelup.mp3',
  evolution: '/sounds/evolution.mp3',
  heal: '/sounds/heal.mp3',
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  warning: '/sounds/warning.mp3',
};

type SoundType = keyof typeof SOUND_URLS;

class SoundManager {
  private audioElements: Map<SoundType, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;
  private initialized: boolean = false;

  init() {
    if (this.initialized || typeof window === 'undefined') return;
    
    // Pre-load audio elements
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = url;
      audio.volume = this.volume;
      this.audioElements.set(key as SoundType, audio);
    });
    
    this.initialized = true;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume / 100));
    this.audioElements.forEach((audio) => {
      audio.volume = this.volume;
    });
  }

  play(sound: SoundType) {
    if (!this.enabled || typeof window === 'undefined') return;
    
    this.init();
    
    const audio = this.audioElements.get(sound);
    if (audio) {
      // Clone the audio to allow overlapping plays
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = this.volume;
      clone.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }

  // Convenience methods
  playCatch() { this.play('catch'); }
  playDeath() { this.play('death'); }
  playBadge() { this.play('badge'); }
  playLevelUp() { this.play('levelUp'); }
  playEvolution() { this.play('evolution'); }
  playHeal() { this.play('heal'); }
  playClick() { this.play('click'); }
  playSuccess() { this.play('success'); }
  playWarning() { this.play('warning'); }
}

export const soundManager = new SoundManager();

// Hook to sync sound settings
export function useSoundSettings(enabled: boolean, volume: number) {
  soundManager.setEnabled(enabled);
  soundManager.setVolume(volume);
}
