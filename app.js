fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const board = document.getElementById('board');
    data.forEach(post => {
      const div = document.createElement('div');
      div.className = 'post';
      div.innerHTML = `<strong>${post.title}</strong><p>${post.content}</p>`;
      board.appendChild(div);
    });
  });
