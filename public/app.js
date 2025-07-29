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

      if (post.pdfUrl) {
        container.innerHTML = `
          <h2 class="text-lg font-bold text-fichte">${post.title}</h2>
          <p class="text-xs text-gray-400 mt-2">${post.date}</p>
        `;
        container.addEventListener('click', () => {
          showPdfModal(post.pdfUrl);
        });
        return container;
      }

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
    const pdfInput = document.getElementById('pdf');
    const prioritySelect = document.getElementById('priority');

    prioritySelect.addEventListener('change', () => {
      if (prioritySelect.value === 'low') {
        pdfInput.classList.remove('hidden');
      } else {
        pdfInput.classList.add('hidden');
        pdfInput.value = null;
      }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();

      const title = form.title.value.trim();
      const content = form.content.value.trim();
      const date = form.date.value;
      const priority = form.priority.value;
      if (!title || !content || !date || !priority) return;

      const post = { title, content, date };
      if (priority === 'low' && pdfInput.files.length > 0) {
        const file = pdfInput.files[0];
        post.pdfUrl = URL.createObjectURL(file);
      }
      const card = (priority === 'high')
        ? createImportantCard(post)
        : createStandardCard(post);

      if (priority === 'high') {
        important.appendChild(card);
      } else {
        board.appendChild(card);
      }

      form.reset();
      pdfInput.classList.add('hidden');
    });

    // Toggle-Button für Formular
    const toggleBtn = document.getElementById('toggleFormBtn');
    const formSection = document.getElementById('postFormSection');
    toggleBtn.addEventListener('click', () => {
      formSection.classList.toggle('hidden');
    });

    function showPdfModal(url) {
      const modal = document.getElementById('pdfModal');
      const iframe = modal.querySelector('iframe');
      iframe.src = url;
      modal.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      modal.classList.add('opacity-100', 'scale-100');
    }

    const modalHTML = document.createElement('div');
    modalHTML.innerHTML = `
      <div id="pdfModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300 opacity-0 scale-95 pointer-events-none z-50">
        <div class="bg-white rounded-lg overflow-hidden shadow-xl w-11/12 h-5/6 max-w-4xl relative">
          <button id="closePdfModal" class="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-2xl font-bold z-50">&times;</button>
          <iframe class="w-full h-full" frameborder="0"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(modalHTML);

    const pdfModal = document.getElementById('pdfModal');
    const closeBtn = document.getElementById('closePdfModal');
    closeBtn.addEventListener('click', () => {
      const iframe = pdfModal.querySelector('iframe');
      iframe.src = '';
      pdfModal.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
      pdfModal.classList.remove('opacity-100', 'scale-100');
    });

    pdfModal.addEventListener('click', (e) => {
      if (e.target === pdfModal) {
        const iframe = pdfModal.querySelector('iframe');
        iframe.src = '';
        pdfModal.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        pdfModal.classList.remove('opacity-100', 'scale-100');
      }
    });
  });