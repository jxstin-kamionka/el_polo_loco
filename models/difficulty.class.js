/**
 * Manages selected difficulty and exposes boss balancing values.
 */
class Difficulty {
  /** @type {("easy"|"normal"|"hard")[]} Difficulty cycle order. */
  order = ["easy", "normal", "hard"];

  /** @type {Object.<string, {label:string,bossEnergy:number,bossSpeed:number,bossDamage:number}>} */
  config = {
    easy: {
      label: "Leicht",
      bossEnergy: 120,
      bossSpeed: 1.1,
      bossDamage: 15,
    },
    normal: {
      label: "Normal",
      bossEnergy: 150,
      bossSpeed: 1.35,
      bossDamage: 22,
    },
    hard: {
      label: "Schwer",
      bossEnergy: 200,
      bossSpeed: 1.7,
      bossDamage: 30,
    },
  };

  /** @type {"easy"|"normal"|"hard"} Currently selected difficulty. */
  selected = "normal";

  /**
   * Creates the difficulty manager and restores the saved setting.
   */
  constructor() {
    this.selected = localStorage.getItem("difficulty") || "normal";
    if (!this.config[this.selected]) this.selected = "normal";
  }

  /**
   * Returns the active difficulty config.
   * @returns {{label:string,bossEnergy:number,bossSpeed:number,bossDamage:number}} Difficulty config.
   */
  getCurrentConfig() {
    return this.config[this.selected] || this.config.normal;
  }

  /**
   * Cycles to the next difficulty and persists it.
   * @returns {void}
   */
  toggle() {
    const currentIndex = this.order.indexOf(this.selected);
    const nextIndex = (currentIndex + 1) % this.order.length;
    this.selected = this.order[nextIndex];
    localStorage.setItem("difficulty", this.selected);
    this.updateButton();
  }

  /**
   * Updates the difficulty button label and state class.
   * @returns {void}
   */
  updateButton() {
    const button = document.getElementById("btn-difficulty");
    if (!button) return;

    const currentConfig = this.getCurrentConfig();
    button.textContent = currentConfig.label;
    button.dataset.difficulty = this.selected;
  }
}

/** @type {Difficulty} Shared difficulty manager. */
const difficulty = new Difficulty();

/**
 * Returns the active difficulty config.
 * @returns {{label:string,bossEnergy:number,bossSpeed:number,bossDamage:number}} Difficulty config.
 */
function getCurrentDifficultyConfig() {
  return difficulty.getCurrentConfig();
}

/**
 * Cycles to the next difficulty from the menu button.
 * @returns {void}
 */
function toggleDifficulty() {
  difficulty.toggle();
}

/**
 * Updates the difficulty button from external startup code.
 * @returns {void}
 */
function updateDifficultyButton() {
  difficulty.updateButton();
}
