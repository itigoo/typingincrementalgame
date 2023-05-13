const version = 2;



const initialData = () => {
  return {
    money: new Decimal(1),
    level: new Decimal(0),
    levelresettime: new Decimal(0),
    word : 'hello',
    digit: 0,

    generators: new Array(4).fill(null).map(() => new Decimal(0)),
    generatorsBought: new Array(4).fill(null).map(() => new Decimal(0)),
    generatorsCost: [
      new Decimal(1),
      new Decimal('1e3'),
      new Decimal('1e5'),
      new Decimal('1e7'),
    ],
    saveversion: version
  }
}

Vue.createApp({
  data() {
    return {
      globedata : {
        generatorsCostIncrease: [
          new Decimal(4),
          new Decimal(8),
          new Decimal(16),
          new Decimal(32),
        ],
        generatorName : [
          'パティシエ',
          '工場     ',
          '専門学校  ',
          '企業     ',
        ],
        generatorinfo : [
          'ケーキを1*レベル個作ります',
          'ケーキを100*レベル個作ります',
          'パティシエを1*レベル人作ります',
          '工場を1*レベルつ作ります',
        ],
      },
      player: {
        money: new Decimal(1),
        level: new Decimal(0),
        levelresettime: new Decimal(0),
        word : 'hello',
        digit: 0,

        generators: new Array(4).fill(null).map(() => new Decimal(0)),
        generatorsBought: new Array(4).fill(null).map(() => new Decimal(0)),
        generatorsCost: [
          new Decimal(1),
          new Decimal('1e3'),
          new Decimal('1e5'),
          new Decimal('1e8'),
        ],


        saveversion: version,

      },
      currenttab: 'basic'
    }
  },

  methods: {
    update(e) {
      if (e.key == this.player.word[this.player.digit]){
        this.player.digit++;
        if (this.player.digit == this.player.word.length){
          const randomNumber = Math.floor(Math.random() * words.length);
          this.player.word = words[randomNumber];
          this.player.digit = 0;
        }
      } else {
        return;
      }
      const myText = document.getElementById("myText");
      const blackText = this.player.word.slice(0,this.player.digit);
      const grayText = this.player.word.slice(this.player.digit);
      myText.innerHTML =  "</span>" + blackText + "<span style='color: gray'>" + grayText;

      //generator 0
      let mult = new Decimal(this.player.generatorsBought[0]);
      this.player.money = this.player.money.add(this.player.generators[0].mul(mult));
      //generator 1
      mult = new Decimal(this.player.generatorsBought[1].mul(100));
      this.player.money = this.player.money.add(this.player.generators[1].mul(mult));
      //generator 1
      mult = new Decimal(this.player.generatorsBought[2]);
      this.player.generators[0] = this.player.generators[0].add(this.player.generators[2].mul(mult));
      //generator 1
      mult = new Decimal(this.player.generatorsBought[3]);
      this.player.generators[1] = this.player.generators[1].add(this.player.generators[3].mul(mult));


      // anchor.setAttribute('href',
      //   'https://twitter.com/intent/tweet?text=ポイント:' + this.player.money +
      //   '(' + this.player.money.toExponential().replace('+', '%2B') + ')' +
      //   '%0Adem08656775.github.io/newincrementalgame%0A&hashtags=新しい放置ゲーム'
      // );
      // tweetbutton.replaceChild(anchor, tweetbutton.lastChild);

      // setTimeout(this.update, this.player.tickspeed);
      document.addEventListener('keypress', this.update);

    },
    save() {
      console.log(JSON.stringify(this.player))
      localStorage.setItem("playerStored", JSON.stringify(this.player));
    },
    load() {
      if (!localStorage.getItem("playerStored")) return
      let saveData = JSON.parse(localStorage.getItem("playerStored"));
      this.player = parseInt(saveData.saveversion) === version ?
        {
          money: new Decimal(saveData.money),
          level: new Decimal(saveData.level),
          levelresettime: new Decimal(saveData.levelresettime),
          word : saveData.word,
          digit: 0,

          
          generators: saveData.generators.map(v => new Decimal(v)),
          generatorsBought: saveData.generatorsBought.map(v => new Decimal(v)),
          generatorsCost: saveData.generatorsCost.map(v => new Decimal(v)),

          saveversion: parseInt(saveData.saveversion),
        } :
        readOldFormat(saveData);
    },
    changeTab(tabname){
      this.currenttab = tabname;
    },
    buyGenerator(index) {
      if (this.player.money.greaterThanOrEqualTo(this.player.generatorsCost[index])) {
        this.player.money = this.player.money.sub(this.player.generatorsCost[index])
        this.player.generators[index] = this.player.generators[index].add(1)
        this.player.generatorsBought[index] = this.player.generatorsBought[index].add(1)
        this.player.generatorsCost[index] = this.player.generatorsCost[index].mul(this.globedata.generatorsCostIncrease[index])
      }
    },
    changeMode(index) {
      this.player.generatorsMode[index] += 1;
      if (this.player.generatorsMode[index] > index) {
        this.player.generatorsMode[index] = 0;
      }
    },
    resetData(force) {
      if (force || confirm('これはソフトリセットではありません。\nすべてが無になり何も得られませんが、本当によろしいですか？')) {
        this.player = initialData()
      }
    },
    resetLevel() {
      let gainlevel = new Decimal(this.player.money.log10()).div(10).pow_base(2).round()
      if (confirm('ケーキで世界征服をしますか？')) {
        let nextlevelresettime = this.player.levelresettime.add(new Decimal(1))
        this.resetData(true);
        this.player.levelresettime = nextlevelresettime
      }
    }
  },
  mounted() {
    // tweetbutton = document.getElementById("tweet");
    // anchor = document.createElement('a');
    // anchor.className = 'twitter-hashtag-button';
    // anchor.innerText = 'Tweet #新しい放置ゲーム';
    // anchor.setAttribute('href',
    //   'https://twitter.com/intent/tweet?text=ポイント:' + this.player.money +
    //   '(' + this.player.money.toExponential().replace('+', '%2B') + ')' +
    //   '%0Adem08656775.github.io/newincrementalgame%0A&hashtags=新しい放置ゲーム'
    // );
    // tweetbutton.appendChild(anchor);

    this.load();
    document.addEventListener('keypress', this.update);

    setInterval(this.save, 2000);
  },
}).mount('#app');

function readOldFormat(saveData) {
  return {
    money: new Decimal(saveData.money),
    level: new Decimal(saveData.level),
    levelresettime: new Decimal(saveData.levelresettime),
    word : saveData.word ?? 'hello',
    digit: 0,

    generators: [
      new Decimal(saveData.generator1 ?? 0),
      new Decimal(saveData.generator2 ?? 0),
      new Decimal(saveData.generator3 ?? 0),
      new Decimal(saveData.generator4 ?? 0),
    ],
    generatorsBought: [
      new Decimal(saveData.generator1bought ?? 0),
      new Decimal(saveData.generator2bought ?? 0),
      new Decimal(saveData.generator3bought ?? 0),
      new Decimal(saveData.generator4bought ?? 0),
    ],
    generatorsCost: [
      new Decimal(1),
      new Decimal('1e3'),
      new Decimal('1e5'),
      new Decimal('1e8'),
    ],

    saveversion: version
  }
}
