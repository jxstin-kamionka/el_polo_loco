/**
 * Loads and controls all sound effects and background music.
 */
class Sounds {
  /** @type {number} Volume for one-shot sound effects. */
  soundVolume = 0.5;

  /** @type {number} Volume for background music. */
  musicVolume = 0.25;

  /** @type {boolean} Whether all sounds are muted. */
  muted = false;

  /** @type {Object.<string, HTMLAudioElement>} Available audio elements. */
  SOUNDS = {
    walk: new Audio("assets/audio/player/walk.mp3"),
    jump: new Audio("assets/audio/player/jump.mp3"),
    hurt: new Audio("assets/audio/player/player-hit.wav"),
    coin: new Audio("assets/audio/player/coin.mp3"),
    throw: new Audio("assets/audio/player/bottle.mp3"),
    bottlePickup: new Audio("assets/audio/player/bottle-pickup.mp3"),
    dead: new Audio("assets/audio/player/dead.mp3"),

    gameOver: new Audio("assets/audio/world/gameover.mp3"),
    youWin: new Audio("assets/audio/world/winsound.mp3"),
    background: new Audio("assets/audio/world/background-musik.mp3"),

    chicken: new Audio("assets/audio/enemies/chicken.mp3"),
    endboss: new Audio("assets/audio/enemies/big-chicken.mp3"),
    deadenemie: new Audio("assets/audio/enemies/dead.mp3"),
  };

  /**
   * Creates the sound manager and prepares audio elements.
   */
  constructor() {
    this.setupSounds();
  }

  /**
   * Configures preload, looping, and initial music volume.
   * @returns {void}
   */
  setupSounds() {
    Object.keys(this.SOUNDS).forEach((key) => {
      this.SOUNDS[key].preload = "auto";
    });

    this.SOUNDS.background.loop = true;
    this.SOUNDS.background.volume = this.musicVolume;
  }

  /**
   * Returns an audio element by name.
   * @param {string} soundName Sound key.
   * @returns {?HTMLAudioElement} Matching sound or null.
   */
  get(soundName) {
    return this.SOUNDS[soundName] || null;
  }

  /**
   * Restarts and plays a sound if audio is enabled.
   * @param {string} soundName Sound key.
   * @returns {void}
   */
  play(soundName) {
    const sound = this.get(soundName);
    if (!sound || this.muted) return;

    sound.pause();
    sound.currentTime = 0;
    sound.volume = soundName === "background" ? this.musicVolume : this.soundVolume;

    sound.play().catch((error) => {
      console.warn(`Sound konnte nicht abgespielt werden: ${soundName}`, error);
    });
  }

  /**
   * Plays a sound from the beginning without pausing it first.
   * @param {string} soundName Sound key.
   * @returns {void}
   */
  playOnce(soundName) {
    const sound = this.get(soundName);
    if (!sound || this.muted) return;

    sound.currentTime = 0;
    sound.volume = soundName === "background" ? this.musicVolume : this.soundVolume;

    sound.play().catch((error) => {
      console.warn(`Sound konnte nicht abgespielt werden: ${soundName}`, error);
    });
  }

  /**
   * Starts or resumes background music.
   * @returns {void}
   */
  playBackground() {
    const music = this.SOUNDS.background;
    if (!music || this.muted) return;

    music.volume = this.musicVolume;
    music.play().catch((error) => {
      console.warn("Hintergrundmusik konnte nicht gestartet werden", error);
    });
  }

  /**
   * Stops one sound and rewinds it.
   * @param {string} soundName Sound key.
   * @returns {void}
   */
  stop(soundName) {
    const sound = this.get(soundName);
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
  }

  /**
   * Pauses one sound without rewinding.
   * @param {string} soundName Sound key.
   * @returns {void}
   */
  pause(soundName) {
    const sound = this.get(soundName);
    if (!sound) return;

    sound.pause();
  }

  /**
   * Stops and rewinds all sounds.
   * @returns {void}
   */
  stopAll() {
    Object.values(this.SOUNDS).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Sets clamped sound effect volume.
   * @param {number} volume Volume between 0 and 1.
   * @returns {void}
   */
  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Sets clamped music volume.
   * @param {number} volume Volume between 0 and 1.
   * @returns {void}
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.SOUNDS.background.volume = this.musicVolume;
  }

  /**
   * Mutes all audio elements.
   * @returns {void}
   */
  muteAll() {
    this.muted = true;
    Object.values(this.SOUNDS).forEach((sound) => {
      sound.muted = true;
    });
  }

  /**
   * Unmutes all audio elements.
   * @returns {void}
   */
  unmuteAll() {
    this.muted = false;
    Object.values(this.SOUNDS).forEach((sound) => {
      sound.muted = false;
    });
  }

  /**
   * Toggles muted state.
   * @returns {void}
   */
  toggleMute() {
    if (this.muted) {
      this.unmuteAll();
    } else {
      this.muteAll();
    }
  }
}
