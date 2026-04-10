class Sounds {
  soundVolume = 0.5;
  musicVolume = 0.25;
  muted = false;

  SOUNDS = {
    walk: new Audio("../assets/audio/player/walk.mp3"),
    jump: new Audio("../assets/audio/player/jump.mp3"),
    hurt: new Audio("../assets/audio/player/player-hit.wav"),
    coin: new Audio("../assets/audio/player/coin.mp3"),
    throw: new Audio("../assets/audio/player/bottle.mp3"),
    bottlePickup: new Audio("../assets/audio/player/bottle-pickup.mp3"),
    dead: new Audio("../assets/audio/player/dead.mp3"),

    gameOver: new Audio("../assets/audio/world/gameover.mp3"),
    youWin: new Audio("../assets/audio/world/winsound.mp3"),
    background: new Audio("../assets/audio/world/background-musik.mp3"),

    chicken: new Audio("../assets/audio/enemies/chicken.mp3"),
    endboss: new Audio("../assets/audio/enemies/big-chicken.mp3"),
    deadenemie: new Audio("../assets/audio/enemies/dead.mp3"),
  };

  constructor() {
    this.setupSounds();
  }

  setupSounds() {
    Object.keys(this.SOUNDS).forEach((key) => {
      this.SOUNDS[key].preload = "auto";
    });

    this.SOUNDS.background.loop = true;
    this.SOUNDS.background.volume = this.musicVolume;
  }

  get(soundName) {
    return this.SOUNDS[soundName];
  }

  play(soundName) {
    const sound = this.get(soundName);
    if (!sound || this.muted) return;

    sound.pause();
    sound.currentTime = 0;
    sound.volume =
      soundName === "background" ? this.musicVolume : this.soundVolume;

    sound.play().catch((error) => {
      console.warn(`Sound konnte nicht abgespielt werden: ${soundName}`, error);
    });
  }

  playOnce(soundName) {
    const sound = this.get(soundName);
    if (!sound || this.muted) return;

    sound.currentTime = 0;
    sound.volume =
      soundName === "background" ? this.musicVolume : this.soundVolume;

    sound.play().catch((error) => {
      console.warn(`Sound konnte nicht abgespielt werden: ${soundName}`, error);
    });
  }

  playBackground() {
    const music = this.SOUNDS.background;
    if (!music || this.muted) return;

    music.volume = this.musicVolume;
    music.play().catch((error) => {
      console.warn("Hintergrundmusik konnte nicht gestartet werden", error);
    });
  }

  stop(soundName) {
    const sound = this.get(soundName);
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
  }

  pause(soundName) {
    const sound = this.get(soundName);
    if (!sound) return;

    sound.pause();
  }

  stopAll() {
    Object.values(this.SOUNDS).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.SOUNDS.background.volume = this.musicVolume;
  }

  muteAll() {
    this.muted = true;
    Object.values(this.SOUNDS).forEach((sound) => {
      sound.muted = true;
    });
  }

  unmuteAll() {
    this.muted = false;
    Object.values(this.SOUNDS).forEach((sound) => {
      sound.muted = false;
    });
  }

  toggleMute() {
    if (this.muted) {
      this.unmuteAll();
    } else {
      this.muteAll();
    }
  }
}
