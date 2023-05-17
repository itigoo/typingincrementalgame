const version = 0.10;



const initialData = () => {
  return {
    money: new Decimal(1),
    level: new Decimal(0),
    levelresettime: new Decimal(0),
    word : 'hello',
    digit: 0,
    boost: 0,
    time_count: 0.0,

    generators: new Array(5).fill(null).map(() => new Decimal(0)),
    generatorsBought: new Array(5).fill(null).map(() => new Decimal(0)),
    generatorsCost: [
      new Decimal(1),
      new Decimal('1e3'),
      new Decimal('1e5'),
      new Decimal('1e7'),
      new Decimal('1e11'),
    ],
    challenges1 : 0,
    challenges2 : 0,
    challenges3 : 0,
    challenge_type : 0,
    challenge_num : 0,
    challenge_point : new Decimal(0),
    booster : 0,
    saveversion: version
  }
}

Vue.createApp({
  data() {
    return {
      globedata : {
        generatorsCostIncrease: [
          new Decimal(2),
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
          '国       ',
        ],
        generatorinfo : [
          'ケーキを1*レベル個作ります',
          'ケーキを100*レベル個作ります',
          'パティシエを1*レベル人作ります',
          '工場を1*レベル個作ります',
          '専門学校を10*レベル個作ります',
        ],
        challenge1info : [
          '3600秒以内にクリアしてください',
          '1800秒以内にクリアしてください',
          '900秒以内にクリアしてください',
          '600秒以内にクリアしてください',
        ],
        challenge2info : [
          'ケーキが1e15個から世界征服できます',
          'ケーキが1e20個から世界征服できます',
          'ケーキが1e25個から世界征服できます',
        ],
      },
      player: {
        money: new Decimal(1),
        level: new Decimal(0),
        levelresettime: new Decimal(0),
        word : 'hello',
        digit: 0,
        boost: 0,
        time_count: 0.0,

        generators: new Array(5).fill(null).map(() => new Decimal(0)),
        generatorsBought: new Array(5).fill(null).map(() => new Decimal(0)),
        generatorsCost: [
          new Decimal(1),
          new Decimal('1e3'),
          new Decimal('1e5'),
          new Decimal('1e7'),
          new Decimal('1e11'),
        ],
        challenges1 : 0,
        challenges2 : 0,
        challenges3 : 0,
        challenge_type : 0,
        challenge_num : 0,
        challenge_point : new Decimal(0),
        booster : 0,


        saveversion: version,

      },
      currenttab: 'basic'
    }
  },

  methods: {
    update(e) {
      if (e.key-'1'>=0 && e.key-'1'<=4){
        let number=e.key-'1';
        this.buyGenerator(number);
        return ;
      }
      if (e.key == this.player.word[this.player.digit]){
        this.player.digit++;
        this.player.boost++;
        if (this.player.digit == this.player.word.length){
          const randomNumber = Math.floor(Math.random() * words.length);
          this.player.word = words[randomNumber];
          this.player.digit = 0;
        }
      } else {
        this.player.boost=0;
        return;
      }
      const myText = document.getElementById("myText");
      const blackText = this.player.word.slice(0,this.player.digit);
      const grayText = this.player.word.slice(this.player.digit);
      myText.innerHTML =  "</span>" + blackText + "<span style='color: gray'>" + grayText;

      base_mul = new Decimal(1);
      if (this.player.levelresettime >= 1) base_mul = base_mul.mul(this.player.levelresettime.add(1));
      console.log(base_mul);
      base_mul = base_mul.mul(this.player.challenge_point.add(1));
      if (this.player.challenge_type==1) base_mul=new Decimal(1);
      if (this.player.booster == 1) base_mul = base_mul.mul(1+Math.min(1,this.player.boost/30));

      //generator 0
      let mult = new Decimal(this.player.generatorsBought[0]);
      mult = mult.mul(base_mul);
      this.player.money = this.player.money.add(this.player.generators[0].mul(mult));
      //generator 1
      mult = new Decimal(this.player.generatorsBought[1].mul(100));
      mult = mult.mul(base_mul);
      this.player.money = this.player.money.add(this.player.generators[1].mul(mult));
      //generator 2
      mult = new Decimal(this.player.generatorsBought[2]);
      mult = mult.mul(base_mul);
      this.player.generators[0] = this.player.generators[0].add(this.player.generators[2].mul(mult));
      //generator 3
      mult = new Decimal(this.player.generatorsBought[3]);
      mult = mult.mul(base_mul);
      this.player.generators[1] = this.player.generators[1].add(this.player.generators[3].mul(mult));
      //generator 4
      mult = new Decimal(this.player.generatorsBought[4].mul(10));
      mult = mult.mul(base_mul);
      this.player.generators[2] = this.player.generators[2].add(this.player.generators[4].mul(mult));


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
    time_count(){
      this.player.time_count+=0.1;
      if (this.player.challenge_type==1){
        if (this.player.challenge_num==1 && this.player.time_count>=3600){
          confirm('チャレンジ失敗しました');
          this.player.challenge_type = 0;
          this.player.challenge_num = 0;
        }
        if (this.player.challenge_num==2 && this.player.time_count>=1800){
          confirm('チャレンジ失敗しました');
          this.player.challenge_type = 0;
          this.player.challenge_num = 0;
        }
        if (this.player.challenge_num==3 && this.player.time_count>=900){
          confirm('チャレンジ失敗しました');
          this.player.challenge_type = 0;
          this.player.challenge_num = 0;
        }
        if (this.player.challenge_num==4 && this.player.time_count>=600){
          confirm('チャレンジ失敗しました');
          this.player.challenge_type = 0;
          this.player.challenge_num = 0;
        }
      }
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
          time_count: saveData.time_count,
          boost: saveData.boost,
          booster : saveData.booster,
          challenges1 : saveData.challenges1,
          challenges2 : saveData.challenges2,
          challenges3 : saveData.challenges3,
          challenge_type : saveData.challenge_type,
          challenge_num : saveData.challenge_num,
          challenge_point : saveData.challenge_point,

          
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
    buyAccelerator(index) {
      if (this.player.money.greaterThanOrEqualTo(100000000) && this.player.booster==0) {
        this.player.money = this.player.money.sub(100000000)
        this.player.booster=1;
      }
    },
    resetData(force) {
      if (force || confirm('これはソフトリセットではありません。\nすべてが無になり何も得られませんが、本当によろしいですか？')) {
        this.player = initialData()
      }
    },
    resetLevel(force) {
      if (!force && this.player.challenge_type==2 && !this.player.money.greaterThanOrEqualTo(new Decimal(10).pow(this.player.challenge_num*5+10))){
        confirm('ロングラン中のため世界征服できません');
        return ;
      }
      if (force || confirm('ケーキで世界征服をしますか？')) {
        let nextlevelresettime = this.player.levelresettime;
        let nextlevel = this.player.level;
        if (!force){
          nextlevelresettime = this.player.levelresettime.add(new Decimal(1));
          nextlevel = Decimal.max(this.player.level,this.player.money);
        }
        let challenges1 = this.player.challenges1;
        let challenges2 = this.player.challenges2;
        let challenges3 = this.player.challenges3;
        let challenge_type = this.player.challenge_type;
        let challenge_num = this.player.challenge_num;
        let challenge_point = this.player.challenge_point;
        this.resetData(true);
        if (!force && challenge_type!=0){
          if (challenge_type==1 && (challenges1 >> challenge_num-1)%2==0) {
            challenge_point++;
            challenges1+=(1 << challenge_num-1);
          }
          if (challenge_type==2 && (challenges3 >> challenge_num-1)%2==0) {
            challenge_point++;
            challenges2+=(1 << challenge_num-1);
          }
          if (challenge_type==3 && (challenges3 >> challenge_num-1)%2==0) {
            challenge_point++;
            challenges3+=(1 << challenge_num-1);
          }
        }
        this.player.levelresettime = nextlevelresettime;
        this.player.level = nextlevel;
        this.player.challenges1 = challenges1;
        this.player.challenges2 = challenges2;
        this.player.challenges3 = challenges3;
        if (force){
            this.player.challenge_type = challenge_type;
            this.player.challenge_num = challenge_num;
        }
        this.player.challenge_point=new Decimal(challenge_point);
      }
    },
    startchallenge(id) {
      if (this.player.challenge_num==0 && confirm('挑戦を開始しますか？')) {
        this.player.challenge_type = Math.floor(id/100)+1;
        this.player.challenge_num = id%100+1;
        this.resetLevel(true);
      } else if ((this.player.challenge_num!=0 && confirm('挑戦を破棄しますか？'))){
        this.player.challenge_type = 0;
        this.player.challenge_num = 0;
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
    setInterval(this.time_count, 100);
  },
}).mount('#app');

function readOldFormat(saveData) {
  if (saveData.level == 0 && saveData.levelresettime >=1) saveData.level= new Decimal(10000000000);
  console.log(saveData);
  return {
    money: new Decimal(saveData.money),
    level: new Decimal(saveData.level),
    levelresettime: new Decimal(saveData.levelresettime),
    word : saveData.word ?? 'hello',
    digit: 0,
    time_count: saveData.time_count ?? 0,
    boost: saveData.boost ?? 0,

    generators: [
      new Decimal(saveData.generators[0] ?? 0),
      new Decimal(saveData.generators[1] ?? 0),
      new Decimal(saveData.generators[2] ?? 0),
      new Decimal(saveData.generators[3] ?? 0),
      new Decimal(saveData.generators[4] ?? 0),
    ],
    generatorsBought: [
      new Decimal(saveData.generatorsBought[0] ?? 0),
      new Decimal(saveData.generatorsBought[1] ?? 0),
      new Decimal(saveData.generatorsBought[2] ?? 0),
      new Decimal(saveData.generatorsBought[3] ?? 0),
      new Decimal(saveData.generatorsBought[4] ?? 0),
    ],
    generatorsCost: [
      new Decimal(saveData.generatorsCost[0] ?? 1),
      new Decimal(saveData.generatorsCost[1] ?? '1e3'),
      new Decimal(saveData.generatorsCost[2] ?? '1e5'),
      new Decimal(saveData.generatorsCost[3] ?? '1e7'),
      new Decimal(saveData.generatorsCost[4] ?? '1e11'),
    ],
    challenges1 : saveData.challenges1 ?? 0,
    challenges2 : saveData.challenges2 ?? 0,
    challenges3 : saveData.challenges3 ?? 0,
    challenge_type : saveData.challenge_type ?? 0,
    challenge_num : saveData.challenge_num ?? 0,
    challenge_point : new Decimal(saveData.challenge_point ?? 0),
    booster : saveData.booster ?? 0,

    saveversion: version
  }
}
