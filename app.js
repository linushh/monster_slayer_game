function attackValue(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      roundCounter: 0,
      specialAttackAllowed: false,
      winner: null,
      battleLog: [],
    };
  },

  methods: {
    entireBattleLog(who, whatAction, valueOfAction) {
      this.battleLog.unshift({
        actionBy: who,
        actionType: whatAction,
        actionValue: valueOfAction
      });
    },

    attackMonster() {
      const attackValueFromPlayer = attackValue(12, 5);
      this.monsterHealth -= attackValueFromPlayer;
      this.entireBattleLog("Player", "attack", attackValueFromPlayer);
      this.attackPlayer();
      this.roundCounter++;
    },

    surrender() {
      this.playerHealth = 0;
    },

    restartGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.roundCounter = 0;
      this.specialAttackAllowed = false;
      this.winner = null;
      this.battleLog = [];
    },

    attackPlayer() {
      const attackValueFromMonster = attackValue(15, 8);
      this.playerHealth -= attackValueFromMonster;
      this.entireBattleLog("Monster", "attack", attackValueFromMonster);
    },

    specialAttackMonster() {
      const specialAttackValue = attackValue(10, 25);
      this.monsterHealth -= specialAttackValue;
      this.entireBattleLog("Player", "special attack", specialAttackValue);
      this.attackPlayer();
      this.roundCounter++;
    },

    healPlayer() {
      const healValue = attackValue(8, 20);
      if (healValue + this.playerHealth > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.roundCounter++;
      this.attackPlayer();
      this.entireBattleLog("Player", "heal", healValue);
    },
  },

  computed: {
    monsterHealthBarWidth() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }

      return { width: this.monsterHealth + "%" };
    },

    playerHealthBarWidth() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }

      return { width: this.playerHealth + "%" };
    },

    specialAttackCheck() {
      return this.roundCounter % 3 !== 0;
    },
  },

  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth > 0) {
        // you lost
        this.winner = "Monster";
      } else if (value <= 0 && this.monsterHealth <= 0) {
        // draw
        this.winner = "Draw";
      }

      //this.battleLog.push(this.winner);
    },

    monsterHealth(value) {
      if (value <= 0 && this.playerHealth > 0) {
        // you win
        this.winner = "Player";
      } else if (value <= 0 && this.playerHealth <= 0) {
        // draw
        this.winner = "Draw";
      }
      //this.battleLog.push(this.winner);
    },
  },
});

app.mount("#game");
