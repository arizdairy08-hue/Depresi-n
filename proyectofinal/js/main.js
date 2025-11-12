// main.js - Funcionalidad para renace.html y comparte.html
document.addEventListener("DOMContentLoaded", function () {
  // Tarjeta del día (renace.html)
  if (document.getElementById("tarjeta-dia")) {
    const frases = [
      "Hoy es un nuevo comienzo. Respira y confía en ti.",
      "Tu paz interior es más fuerte que cualquier tormenta.",
      "Eres suficiente tal como eres. Abraza tu luz.",
      "El dolor de hoy será la fuerza de mañana.",
      "Sanar no es olvidar, es aprender a llevarlo con amor.",
      "Tu voz importa. Habla con gentileza a tu corazón.",
      "Cada respiración es un paso hacia la calma.",
      "Eres un milagro en proceso. No te rindas."
    ];

    const randomFrase = frases[Math.floor(Math.random() * frases.length)];
    document.getElementById("frase-dia").textContent = `"${randomFrase}"`;
  }

  // Grabación de voz (comparte.html)
  let recorder, audioBlob;
  const recordBtn = document.getElementById("record-btn");
  const stopBtn = document.getElementById("stop-btn");
  const audioPlayback = document.getElementById("audio-playback");

  if (recordBtn) {
    recordBtn.addEventListener("click", async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => {
        audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        audioPlayback.src = url;
        audioPlayback.style.display = "block";
        document.getElementById("download-link").href = url;
        document.getElementById("download-link").style.display = "inline-block";
      };

      recorder.start();
      recordBtn.disabled = true;
      stopBtn.disabled = false;
      recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Grabando...';
    });

    stopBtn.addEventListener("click", () => {
      recorder.stop();
      recordBtn.disabled = false;
      stopBtn.disabled = true;
      recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Grabar mensaje';
    });
  }
});