let fullProblemSet = [];
let ratingChart;

async function fetchUserData() {
  const handle = document.getElementById('username').value.trim();
  if (!handle) return alert('Please enter a valid handle!');

  try {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const data = await res.json();
    if (data.status === 'FAILED') throw new Error(data.comment);

    const user = data.result[0];
    document.getElementById('userInfo').classList.remove('hidden');
    document.getElementById('profile').innerHTML = `
      <div class='detail-box'><strong>Handle:</strong> ${user.handle}</div>
      <div class='detail-box'><strong>Rank:</strong> ${user.rank}</div>
      <div class='detail-box'><strong>Rating:</strong> ${user.rating || 'Unrated'}</div>
      <div class='detail-box'><strong>Max Rank:</strong> ${user.maxRank}</div>
      <div class='detail-box'><strong>Max Rating:</strong> ${user.maxRating || 'N/A'}</div>
      <div class='detail-box'><strong>Country:</strong> ${user.country || 'N/A'}</div>
      <div class='detail-box'><strong>Organization:</strong> ${user.organization || 'N/A'}</div>
    `;

    const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
    const statusData = await statusRes.json();

    if (statusData.status === 'OK') {
      const solvedMap = {};
      const solvedSet = new Set();

      statusData.result.forEach(sub => {
        const key = `${sub.problem.contestId}-${sub.problem.index}`;
        if (sub.verdict === 'OK' && !solvedSet.has(key)) {
          solvedSet.add(key);
          if (sub.problem.rating) {
            solvedMap[sub.problem.rating] = (solvedMap[sub.problem.rating] || 0) + 1;
          }
        }
      });

      const ctx = document.getElementById('ratingChart').getContext('2d');
      const labels = Object.keys(solvedMap).sort((a, b) => a - b);
      const values = labels.map(r => solvedMap[r]);

      if (ratingChart) ratingChart.destroy();
      ratingChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Solved Problems',
            data: values,
            backgroundColor: '#61dafb',
            borderRadius: 5
          }]
        },
        options: {
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Problems Solved per Rating' }
          },
          scales: {
            x: { title: { display: true, text: 'Rating' } },
            y: { beginAtZero: true, title: { display: true, text: 'Count' } }
          }
        }
      });

      document.getElementById('solvedCount').classList.remove('hidden');
    }

  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function loadContests() {
  const res = await fetch(`https://codeforces.com/api/contest.list?gym=false`);
  const data = await res.json();
  const contests = data.result.slice(0, 6);
  const container = document.getElementById('contests');
  container.innerHTML = contests.map(contest => `
    <a class="detail-box" href="https://codeforces.com/contest/${contest.id}" target="_blank">
      <strong>${contest.name}</strong><br />
      <span>Type: ${contest.type}</span><br />
      <span>Duration: ${Math.floor(contest.durationSeconds / 60)} mins</span>
    </a>
  `).join('');
}

async function loadProblems() {
  const res = await fetch(`https://codeforces.com/api/problemset.problems`);
  const data = await res.json();
  fullProblemSet = data.result.problems;
  const sample = fullProblemSet.slice(0, 6);
  const container = document.getElementById('problems');
  container.innerHTML = sample.map(p => `
    <a class="detail-box" href="https://codeforces.com/problemset/problem/${p.contestId}/${p.index}" target="_blank">
      <strong>${p.name}</strong><br />
      <span>Rating: ${p.rating || 'N/A'}</span><br />
      <span>Tags: ${p.tags.slice(0, 2).join(', ') || 'None'}</span>
    </a>
  `).join('');
}

function filterProblemsByRating() {
  const rating = parseInt(document.getElementById('ratingInput').value);
  if (isNaN(rating)) return alert('Please enter a valid rating!');

  const filtered = fullProblemSet.filter(p => p.rating === rating);
  const container = document.getElementById('ratedList');
  document.getElementById('ratedProblems').classList.remove('hidden');

  if (filtered.length === 0) {
    container.innerHTML = `<p>No problems found for rating ${rating}.</p>`;
    return;
  }

  container.innerHTML = filtered.slice(0, 80).map(p => `
    <a class="detail-box" href="https://codeforces.com/problemset/problem/${p.contestId}/${p.index}" target="_blank">
      <strong>${p.name}</strong><br />
      <span>Tags: ${p.tags.slice(0, 3).join(', ') || 'None'}</span>
    </a>
  `).join('');
}

function filterProblemsByTags() {
  const input = document.getElementById('topicInput').value.trim();
  if (!input) return alert('Please enter one or more topics!');

  const tags = input.toLowerCase().split(',').map(tag => tag.trim());

  // Standardize synonyms
  const tagMap = {
    bst: ['trees', 'data structures'],
    graph: ['graphs'],
    binarysearch: ['binary search'],
    sorting: ['sortings'],
    math: ['math'],
    string: ['strings'],
    dfs: ['dfs and similar'],
    bfs: ['dfs and similar'],
    greedy: ['greedy']
  };

  let expandedTags = [];
  tags.forEach(tag => {
    if (tagMap[tag]) {
      expandedTags = [...expandedTags, ...tagMap[tag]];
    } else {
      expandedTags.push(tag);
    }
  });

  const container = document.getElementById('taggedList');
  const results = fullProblemSet.filter(p => expandedTags.every(t => p.tags.map(tag => tag.toLowerCase()).includes(t)));

  document.getElementById('taggedProblems').classList.remove('hidden');

  if (results.length === 0) {
    container.innerHTML = `<p>No problems found with topics: ${tags.join(', ')}</p>`;
    return;
  }

  container.innerHTML = results.slice(0, 40).map(p => `
    <a class="detail-box" href="https://codeforces.com/problemset/problem/${p.contestId}/${p.index}" target="_blank">
      <strong>${p.name}</strong><br />
      <span>Rating: ${p.rating || 'N/A'}</span><br />
      <span>Tags: ${p.tags.join(', ')}</span>
    </a>
  `).join('');
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
}

function loadLeaderboard() {
  fetch('https://codeforces.com/api/user.ratedList?activeOnly=true')
    .then(res => res.json())
    .then(data => {
      const topUsers = data.result.slice(0, 10);
      const container = document.getElementById('leaders');
      container.innerHTML = topUsers.map(u => `
        <div class="detail-box">
          <strong>${u.handle}</strong><br/>
          Rank: ${u.rank}<br/>
          Rating: ${u.rating}
        </div>
      `).join('');
      document.getElementById('leaderboard').classList.remove('hidden');
    });
}

loadContests();
loadProblems();
loadLeaderboard();

