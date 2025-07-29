fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const important = document.getElementById('important');
    const board = document.getElementById('board');

    // Zwei wichtige Einträge (high priority)
    const [first, second, ...rest] = data;

    const createImportantCard = (post) => {
      const div = document.createElement('div');
      div.className = `
        bg-fichte text-white p-6 rounded-xl shadow-lg flex-grow min-h-[150px] flex flex-col justify-between
      `;
      div.innerHTML = `
        <div>
          <h2 class="text-2xl font-bold mb-2">${post.title}</h2>
          <p class="text-base">${post.content}</p>
        </div>
        <p class="text-sm mt-4 opacity-80">${post.date}</p>
      `;
      return div;
    };

    const createStandardCard = (post) => {
      const container = document.createElement('div');
      container.className = `
        bg-white border-l-4 border-fichte p-4 rounded-xl shadow-md cursor-pointer 
        transition-all duration-300 flex-grow min-h-[150px] flex flex-col justify-between
      `;

      const fullText = document.createElement('div');
      fullText.className = 'mt-2 text-sm text-gray-600 max-h-0 opacity-0 transition-all duration-300 overflow-hidden';
      fullText.innerText = post.content;

      container.innerHTML = `
        <h2 class="text-lg font-bold text-fichte">${post.title}</h2>
        <p class="text-xs text-gray-400 mt-2">${post.date}</p>
      `;
      container.appendChild(fullText);

      container.addEventListener('click', () => {
        const expanded = fullText.classList.contains('max-h-0');
        if (expanded) {
          fullText.classList.remove('max-h-0', 'opacity-0');
          fullText.classList.add('max-h-32', 'opacity-100');
        } else {
          fullText.classList.add('max-h-0', 'opacity-0');
          fullText.classList.remove('max-h-32', 'opacity-100');
        }
      });

      return container;
    };

    important.appendChild(createImportantCard(first));
    important.appendChild(createImportantCard(second));
    rest.forEach(post => board.appendChild(createStandardCard(post)));

    // Formular-Handling
    const form = document.getElementById('postForm');
    form.addEventListener('submit', e => {
      e.preventDefault();

      const title = form.title.value.trim();
      const content = form.content.value.trim();
      const date = form.date.value;
      const priority = form.priority.value;
      if (!title || !content || !date || !priority) return;

      const post = { title, content, date };
      const card = (priority === 'high')
        ? createImportantCard(post)
        : createStandardCard(post);

      if (priority === 'high') {
        important.appendChild(card);
      } else {
        board.appendChild(card);
      }

      form.reset();
    });

    // Toggle-Button für Formular
    const toggleBtn = document.getElementById('toggleFormBtn');
    const formSection = document.getElementById('postFormSection');
    toggleBtn.addEventListener('click', () => {
      formSection.classList.toggle('hidden');
    });
  });
