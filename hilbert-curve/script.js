document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");
  context.lineWidth = 1;
  context.strokeStyle = "black";
  canvas.width = canvas.height = canvas.parentNode.getBoundingClientRect().height;

  const clear = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  const f = (x, y) => [canvas.width * x, canvas.height * y];

  const margin = 0.01;
  const translate = (x, y) => [
    margin + (1 - 2 * margin) * x,
    margin + (1 - 2 * margin) * y,
  ]
  const draw = (ps) => {
    context.beginPath();
    if (ps.length) {
      context.moveTo(...f(...translate(...ps[0])));
      for (const p of ps.slice(1))
        context.lineTo(...f(...translate(...p)));
      context.stroke();
    }
  }

  const onChange = ({ target }) => {
    clear();
    draw(hilbert(target.value))
  };

  const input = document.querySelector("input");
  input.addEventListener("change", onChange);

  onChange({ target: input });
})

function width(n) {
  if (n < 1)
    return 0;
  else if (n == 1)
    return 1;
  else
    return 2 * width(n - 1) + 1;
}

function hilbertAux(n) {
  if (n < 1)
    return [];
  else if (n == 1)
    return [[0, 0], [0, 1], [1, 1], [1, 0]];
  else {
    const prev = hilbertAux(n - 1);
    const wPrev = width(n - 1);
    const d = wPrev + 1;
    return [].concat(
      prev.map(([x, y]) => [y, x]),
      prev.map(([x, y]) => [x, y + d]),
      prev.map(([x, y]) => [x + d, y + d]),
      prev.map(([x, y]) => [wPrev - y + d, wPrev - x]),
    )
  }
}

const hilbert = n => {
  const w = width(n);
  return hilbertAux(n).map(([x, y]) => [x / w, y / w])
}
