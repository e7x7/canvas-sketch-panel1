import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import math from 'canvas-sketch-util/math';
import { Pane } from 'tweakpane';

let settings = {
  dimensions: [2080, 2080],
  pixelated: false,
  animate: true,
};

const params = {
  //___Style
  background: '#1e1f1f',
  //background: '#767676',
  //color: '#171b1b',
  color: '#c4e7e7',
  lineCap: 'razor',
  shadowBlur: 14,
  shadowColor: '#7fffff',
  //___Grid
  cols: 7,
  rows: 35,
  scaleMin: 0.07,
  scaleMax: 49,
  cellwidth: 0.777,
  cellheight: 0.049,
  //___Noise
  nois_frqncy: -0.0021,
  amp: 0.07,
  animate: true,
  frame: 1,
};
const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = params.background;
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridw = width * 0.7777777;
    const gridh = height * 0.7777777;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width - gridw) * 0.5;
    const margy = (width - gridh) * 0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = params.cellwidth * cellw;
      const h = params.cellheight * cellh;

      const f = params.animate ? frame : params.frame;
      const n = random.noise3D(x, y, f * 10, params.nois_frqncy);
      const angle = n * Math.PI * params.amp;
      // const scale = ((n + 1) / 2) * 30;
      // const scale = ((n * 0.5) + 0.5) * 30;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      //_____________________________________________________
      context.translate(x, y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;
      context.strokeStyle = params.color;
      context.shadowBlur = params.shadowBlur;
      context.shadowColor = params.shadowColor;

      context.beginPath();
      context.moveTo(w * -0.5, h);
      context.lineTo(w * 0.5, h);
      context.stroke();

      //______________________________________________________
      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new Pane();
  //const pane = new Pane({ container: document.getElementById('paneContainer') },);

  let folder;
  //let controls
  //controls = pane.addFolder({ title: 'controls', expanded: false })
  //____________________________________________
  //___Style
  folder = pane.addFolder({ title: 'Style', expanded: false });
  //
  folder.addInput(params, 'background'/*, { view: 'color', expanded: false, picker: 'inline' }*/);

  folder.addInput(params, 'color');
  //
  folder.addInput(params, 'lineCap', {
    options: { razor: 'razor', round: 'round', square: 'square' },
  });
  folder.addInput(params, 'shadowBlur', { min: 0, max: 100 });
  folder.addInput(params, 'shadowColor');
  //____________________________________________
  //___Grid
  folder = pane.addFolder({ title: 'Grid', expanded: false });
  //
  folder.addInput(params, 'cols', { min: 1, max: 100, step: 1 });
  folder.addInput(params, 'rows', { min: 1, max: 100, step: 1 });
  folder.addInput(params, 'scaleMin', { min: 0.07, max: 100 });
  folder.addInput(params, 'scaleMax', { min: 0.07, max: 100 });

  folder.addInput(params, 'cellwidth', { min: 0.1, max: 10, step: 0.001 });
  folder.addInput(params, 'cellheight', { min: -10, max: 10, step: 0.001 });
  //____________________________________________
  //___Noise
  folder = pane.addFolder({ title: 'Noise', expanded: false });
  //
  folder.addInput(params, 'nois_frqncy', {
    min: -0.01,
    max: 0.01,
    step: 0.0001,
  });
  folder.addInput(params, 'amp', { min: 0, max: 1, step: 0.0001 });
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', { min: 0, max: 999 });
};

createPane();

canvasSketch(sketch, settings);
