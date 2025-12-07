// lib/alert-sound.ts
class AlertSound {
  private audio: HTMLAudioElement;
  private isUnlocked = false;
  private queue: boolean[] = [];

  constructor(private soundUrl: string, private volume: number = 1) {
    if (typeof window !== "undefined") {
      this.audio = new Audio(soundUrl);
      this.audio.volume = volume;
      this.audio.preload = "auto";

      // Unlock audio on first user interaction
      const unlock = async () => {
        try {
          await this.audio.play();
        } catch {
          console.warn("Audio blocked, waiting for first interaction");
        } finally {
          this.audio.pause();
          this.audio.currentTime = 0;
          this.isUnlocked = true;
        }
        window.removeEventListener("click", unlock);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("touchstart", unlock);
      };

      window.addEventListener("click", unlock, { once: true });
      window.addEventListener("keydown", unlock, { once: true });
      window.addEventListener("touchstart", unlock, { once: true });
    } else {
      // Server side fallback
      this.audio = {} as HTMLAudioElement;
    }
  }

  /** Play the alert sound */
  public async play() {
    if (!this.audio) return;

    if (!this.isUnlocked) {
      // Queue the sound until user interacts
      this.queue.push(true);
      console.warn("Audio not unlocked yet, queued");
      return;
    }

    try {
      // Clone the audio to allow overlapping plays
      const audioClone = this.audio.cloneNode(true) as HTMLAudioElement;
      await audioClone.play();
    } catch (err) {
      console.warn("Failed to play alert sound:", err);
    }
  }

  /** Unlock queued sounds after first interaction */
  public unlock() {
    if (!this.isUnlocked) {
      this.isUnlocked = true;
      while (this.queue.length > 0) {
        this.queue.pop();
        this.play();
      }
    }
  }
}

// Singleton
let alertSoundInstance: AlertSound | null = null;

export function getAlertSound(soundUrl: string = "/music/alert.mp3", volume: number = 1) {
  if (!alertSoundInstance) {
    alertSoundInstance = new AlertSound(soundUrl, volume);
  }
  return alertSoundInstance;
}
