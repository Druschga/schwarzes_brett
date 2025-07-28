fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const important = document.getElementById('important');
    const board = document.getElementById('board');

    // Zwei wichtige Einträge nehmen (z. B. die ersten beiden)
    const [first, second, ...rest] = data;

    const createImportantCard = (post, bg, text) => {
      const div = document.createElement('div');
      div.className = `p-6 rounded-xl shadow-lg ${bg} ${text}`;
      div.innerHTML = `
        <h2 class="text-2xl font-bold mb-2">${post.title}</h2>
        <p class="text-base">${post.content}</p>
        <p class="text-sm mt-2 opacity-70">${post.date}</p>
      `;
      return div;
    };

    important.appendChild(createImportantCard(first, 'bg-fichte text-white', ''));
    important.appendChild(createImportantCard(second, 'bg-lime text-fichte', ''));

    // Die restlichen normal rendern
    rest.forEach(post => {
      const container = document.createElement('div');
      const rotate = Math.random() > 0.5 ? '-rotate-1' : 'rotate-1';
      const shadow = Math.random() > 0.5 ? 'shadow-lg' : 'shadow-md';
      const borderColor = Math.random() > 0.5 ? 'border-lime' : 'border-fichte';

      container.className = `
        bg-white border-l-4 ${borderColor} p-4 rounded-xl ${rotate} ${shadow} 
        transition-transform duration-200 cursor-pointer relative overflow-hidden
      `;

      const title = `<h2 class="text-lg font-bold text-fichte">${post.title}</h2>`;
      const date = `<p class="text-xs text-gray-400 mt-2">${post.date}</p>`;

      const fullText = document.createElement('div');
      fullText.className = 'mt-2 text-sm text-gray-600 max-h-0 opacity-0 transition-all duration-300 ease-in-out';
      fullText.innerText = post.content;

      container.innerHTML = title + date;
      container.appendChild(fullText);

      container.addEventListener('click', () => {
        const expanded = fullText.classList.contains('max-h-0');
        if (expanded) {
          fullText.classList.remove('max-h-0', 'opacity-0');
          fullText.classList.add('max-h-40', 'opacity-100');
        } else {
          fullText.classList.add('max-h-0', 'opacity-0');
          fullText.classList.remove('max-h-40', 'opacity-100');
        }
      });
// Ergänzung in app.js am Ende, nach dem Laden der bestehenden Posts
const form = document.getElementById('postForm');

form.addEventListener('submit', e => {
  e.preventDefault();

  const title = form.title.value.trim();
  const content = form.content.value.trim();
  const date = form.date.value;
  const priority = form.priority.value;

  if (!title || !content || !date || !priority) return;

  const post = { title, content, date };

  if (priority === 'high') {
    // High Priority: wie wichtig (links)
    const card = createImportantCard(post, 'bg-fichte text-white', '');
    important.appendChild(card);
  } else {
    // Low Priority: wie normal (rechts)
    // Gleiche Logik wie im ursprünglichen board
    const container = document.createElement('div');
    const rotate = Math.random() > 0.5 ? '-rotate-1' : 'rotate-1';
    const shadow = Math.random() > 0.5 ? 'shadow-lg' : 'shadow-md';
    const borderColor = Math.random() > 0.5 ? 'border-lime' : 'border-fichte';

    container.className = `
      bg-white border-l-4 ${borderColor} p-4 rounded-xl ${rotate} ${shadow} 
      transition-transform duration-200 cursor-pointer relative overflow-hidden
    `;

    const titleHTML = `<h2 class="text-lg font-bold text-fichte">${post.title}</h2>`;
    const dateHTML = `<p class="text-xs text-gray-400 mt-2">${post.date}</p>`;

    const fullText = document.createElement('div');
    fullText.className = 'mt-2 text-sm text-gray-600 max-h-0 opacity-0 transition-all duration-300 ease-in-out';
    fullText.innerText = post.content;

    container.innerHTML = titleHTML + dateHTML;
    container.appendChild(fullText);

    container.addEventListener('click', () => {
      const expanded = fullText.classList.contains('max-h-0');
      if (expanded) {
        fullText.classList.remove('max-h-0', 'opacity-0');
        fullText.classList.add('max-h-40', 'opacity-100');
      } else {
        fullText.classList.add('max-h-0', 'opacity-0');
        fullText.classList.remove('max-h-40', 'opacity-100');
      }
    });

    board.appendChild(container);
  }

  // Formular zurücksetzen
  form.reset();
});
const toggleBtn = document.getElementById('toggleFormBtn');
const formSection = document.getElementById('postFormSection');

toggleBtn.addEventListener('click', () => {
  formSection.classList.toggle('hidden');
});

      board.appendChild(container);
    });
  });
