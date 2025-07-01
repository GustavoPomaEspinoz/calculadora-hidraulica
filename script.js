let chart;

const formularioDiv = document.getElementById('formulario');
const resultadoDiv = document.getElementById('resultado');
const ctx = document.getElementById('grafica').getContext('2d');

document.getElementById('operacion').addEventListener('change', function() {
  formularioDiv.innerHTML = '';
  resultadoDiv.innerHTML = '';
  if (chart) chart.destroy();
  const opcion = this.value;
  let html = '';

  switch (opcion) {
    case 'bernoulli':
      html = `
        <h3>Ecuación de Bernoulli</h3>
        <p class="descripcion">
          📌 <strong>¿Para qué sirve?</strong> Calcula la energía total en un fluido combinando presión, velocidad y altura.
        </p>
        <p class="formula">
          <strong>Fórmula:</strong> H = (P/ρg) + (v²/2g) + h
        </p>
        <input type="number" id="P" placeholder="Presión (P) [Pa]">
        <input type="number" id="v" placeholder="Velocidad (v) [m/s]">
        <input type="number" id="h" placeholder="Altura (h) [m]">
        <button onclick="calcularBernoulli()">Calcular</button>`;
      break;

    case 'manning':
      html = `
        <h3>Ecuación de Manning</h3>
        <p class="descripcion">
          📌 <strong>¿Para qué sirve?</strong> Estima la velocidad del flujo en canales abiertos considerando su rugosidad y pendiente.
        </p>
        <p class="formula">
          <strong>Fórmula:</strong> V = (1/n)·R^(2/3)·S^(1/2)
        </p>
        <input type="number" id="n" step="0.001" placeholder="Coef. Manning (n)">
        <input type="number" id="R" placeholder="Radio hidráulico (R) [m]">
        <input type="number" id="S" placeholder="Pendiente (S)">
        <button onclick="calcularManning()">Calcular</button>`;
      break;

    case 'hazen':
      html = `
        <h3>Ecuación de Hazen-Williams</h3>
        <p class="descripcion">
          📌 <strong>¿Para qué sirve?</strong> Estima caudales y pérdidas de carga en tuberías de agua a presión.
        </p>
        <p class="formula">
          <strong>Fórmula:</strong> Q = 0.849 · C · D^2.63 · S^0.54
        </p>
        <input type="number" id="C" placeholder="Coef. Hazen-Williams (C)">
        <input type="number" id="D" placeholder="Diámetro (D) [m]">
        <input type="number" id="S" placeholder="Pendiente (S)">
        <button onclick="calcularHazen()">Calcular</button>`;
      break;

    case 'euler':
      html = `
        <h3>Fórmula de Euler</h3>
        <p class="descripcion">
          📌 <strong>¿Para qué sirve?</strong> Determina la carga crítica que provoca el pandeo en columnas delgadas.
        </p>
        <p class="formula">
          <strong>Fórmula:</strong> Pcr = (π² · E · I) / L²
        </p>
        <input type="number" id="L" placeholder="Longitud (L) [m]">
        <input type="number" id="r" placeholder="Radio de giro (r) [m]">
        <button onclick="calcularEuler()">Calcular</button>`;
      break;

    case 'curva':
      html = `
        <h3>Curva Masa</h3>
        <p class="descripcion">
          📌 <strong>¿Para qué sirve?</strong> Permite conocer el volumen acumulado de agua almacenada a lo largo del tiempo.
        </p>
        <p class="formula">
          <strong>Fórmula:</strong> Volumen acumulado = Q · t
        </p>
        <input type="number" id="Q" placeholder="Caudal acumulado (Q) [m³/s]">
        <input type="number" id="t" placeholder="Tiempo (t) [s]">
        <button onclick="calcularCurva()">Calcular</button>`;
      break;

    case 'talud':
      html = `
        <h3>Volumen de un Talud</h3>
        <p class="descripcion">
          📌 <strong>¿Para qué sirve?</strong> Calcula el volumen de un corte con forma de tronco de prisma (talud).
        </p>
        <p class="formula">
          <strong>Fórmula:</strong> V = ((B + b) / 2) · H
        </p>
        <input type="number" id="B" placeholder="Base mayor (B) [m]">
        <input type="number" id="b" placeholder="Base menor (b) [m]">
        <input type="number" id="H" placeholder="Altura (H) [m]">
        <button onclick="calcularTalud()">Calcular</button>`;
      break;
  }
  formularioDiv.innerHTML = html;
});

function graficar(labels, data, label) {
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'X' } },
        y: { title: { display: true, text: 'Y' } }
      }
    }
  });
}

function calcularBernoulli() {
  const P = parseFloat(document.getElementById('P').value);
  const v = parseFloat(document.getElementById('v').value);
  const h = parseFloat(document.getElementById('h').value);
  const rho = 1000;
  const resultado = (P/(rho*9.81)) + (v**2/(2*9.81)) + h;
  resultadoDiv.innerHTML = `Energía total (H): ${resultado.toFixed(2)} m`;
  const xs = Array.from({length: 20}, (_, i) => i);
  const ys = xs.map(x => resultado);
  graficar(xs, ys, "Energía Total (m)");
}

function calcularManning() {
  const n = parseFloat(document.getElementById('n').value);
  const R = parseFloat(document.getElementById('R').value);
  const S = parseFloat(document.getElementById('S').value);
  const resultado = (1/n) * R**(2/3) * S**0.5;
  resultadoDiv.innerHTML = `Velocidad (V): ${resultado.toFixed(2)} m/s`;
  const xs = Array.from({length: 20}, (_, i) => i);
  const ys = xs.map(x => resultado * x / 10);
  graficar(xs, ys, "Velocidad (m/s)");
}

function calcularHazen() {
  const C = parseFloat(document.getElementById('C').value);
  const D = parseFloat(document.getElementById('D').value);
  const S = parseFloat(document.getElementById('S').value);
  const resultado = 0.849 * C * D**2.63 * S**0.54;
  resultadoDiv.innerHTML = `Caudal (Q): ${resultado.toFixed(2)} L/s`;
  const xs = Array.from({length: 20}, (_, i) => i);
  const ys = xs.map(x => resultado * (1 + 0.05 * x));
  graficar(xs, ys, "Caudal (L/s)");
}

function calcularEuler() {
  const L = parseFloat(document.getElementById('L').value);
  const r = parseFloat(document.getElementById('r').value);
  const resultado = (Math.PI**2 * 9.81 * r**2) / (L**2);
  resultadoDiv.innerHTML = `Carga crítica: ${resultado.toFixed(2)} N`;
  const xs = Array.from({length: 20}, (_, i) => i);
  const ys = xs.map(x => resultado * Math.sin(x/5));
  graficar(xs, ys, "Carga Crítica (N)");
}

function calcularCurva() {
  const Q = parseFloat(document.getElementById('Q').value);
  const t = parseFloat(document.getElementById('t').value);
  const resultado = Q * t;
  resultadoDiv.innerHTML = `Volumen acumulado: ${resultado.toFixed(2)} m³`;
  const xs = Array.from({length: 20}, (_, i) => i*t/20);
  const ys = xs.map(x => Q * x);
  graficar(xs, ys, "Volumen Acumulado (m³)");
}

function calcularTalud() {
  const B = parseFloat(document.getElementById('B').value);
  const b = parseFloat(document.getElementById('b').value);
  const H = parseFloat(document.getElementById('H').value);
  const resultado = ((B + b) / 2) * H;
  resultadoDiv.innerHTML = `Volumen: ${resultado.toFixed(2)} m³`;
  const xs = Array.from({length: 20}, (_, i) => i);
  const ys = xs.map(x => resultado * x/20);
  graficar(xs, ys, "Volumen (m³)");
}
