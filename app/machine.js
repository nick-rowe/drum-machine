class DrumMachine {

  constructor(params) {

    this.bpm = 80;
    this.isPlaying = false;
    this.numNotes = 4;
    this.position = 0;
    this.bpmTime = 0;

    this.instruments = {
      crash: '/instruments/crash.ogg',
      hiHat: '/instruments/hi-hat.ogg',
      snare: '/instruments/snare.ogg',
      kick: '/instruments/kick.ogg'
    };

    this.steps = {};

    this.bindControls();

    this.init();

  }

  init() {

    const intruments = Object.keys(this.instruments);

    intruments.forEach((inst) => {

      const instRow = document.createElement('div');
      instRow.classList.add('instrument');

      const instLabel = document.createElement('div');
      instLabel.classList.add('label');
      instLabel.innerHTML = inst;
      instRow.appendChild(instLabel);

      const steps = document.createElement('div');
      steps.classList.add('steps');

      this.steps[inst] = [];

      for (let i = 0; i < this.numNotes * 4; i++) {

        const step = document.createElement('div');
        step.setAttribute('data-instrument', inst)
        step.setAttribute('data-index', i);
        step.className = 'step';
        step.addEventListener('click', (e) => {
          this.toggleStep(e);
        });

        steps.appendChild(step);

        this.steps[inst].push({
          audioEl: new Audio(this.instruments[inst]),
          el: step,
          selected: false
        });

      }

      instRow.appendChild(steps);

      document.querySelector('#timeline').appendChild(instRow);


    });

  }

  toggleStep(e) {

    const el = e.target;
    const inst = el.getAttribute('data-instrument'),
      index = el.getAttribute('data-index');

    let step = this.steps[inst][index];
    // let selected = this.steps[inst][index].selected;

    if (step.selected) {
      step.selected = false;
      el.classList.remove('active');
    } else {
      step.selected = true;
      el.classList.add('active');
    }

  }

  updateBpm(e) {
    this.bpm = e.target.value;
  }

  play() {

    this.bpmTime = 15 / this.bpm * 1000;

    this.timer = setInterval(() => {
      this.step();
    }, this.bpmTime);

  }

  step() {

    const instruments = Object.keys(this.instruments);

    for (const i of instruments) {

      const step = this.steps[i][this.position];

      if (step.selected) {
        step.audioEl.play();
      }

      step.el.classList.add('highlight');

      setTimeout(() => {
        step.el.classList.remove('highlight');
      }, this.bpmTime);

    }

    this.position++;

    if (this.position >= this.numNotes * 4) {
      this.position = 0;
    }

  }

  stop() {
    this.isPlaying = false;
    clearInterval(this.timer);
    this.position = 0;
  }

  clear() {

    const active = document.querySelector('td.active');

    if (active) {
      active.classList.remove('active');
    }

  }

  startStop() {

    if (this.isPlaying) {
      this.stop();
    } else {
      this.isPlaying = true;
      this.play();
    }

  }

  bindControls() {

    document.querySelector('#controls .play')
      .addEventListener('click', _ => this.play());

    document.querySelector('#controls .stop')
      .addEventListener('click', () => this.stop());

    document.addEventListener('keyup', (e) => {

      if (e.keyCode === 32) {
        e.preventDefault();
        this.startStop();
      }

    });

    document.querySelector('input.bpm')
    .addEventListener('change', (e) => {
      this.updateBpm(e);
    });

    document.querySelector('input.bpm')
      .addEventListener('change', (e) => {
        this.updateBpm(e);
      });

  }

}
