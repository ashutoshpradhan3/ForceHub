# 🌐 ForceHub - Codeforces Explorer

ForceHub is a sleek, interactive frontend interface for Codeforces users to:
- View user profiles
- Analyze solved problems by rating
- Search problems by rating or topic
- See recent contests and sample problems
- Explore global leaderboards
- Toggle between light and dark themes

## 🚀 Features

- 📊 Chart-based problem solving distribution
- 🔎 Topic & rating-based problem filtering
- 🌘 Light/Dark mode toggle
- 📅 Recent contests display
- 🧠 Leaderboard of top Codeforces users
- 🎨 Rotating logo and modern UI effects

## 🛠 Tech Stack

- HTML5
- CSS3 (with custom dark/light mode)
- JavaScript (Vanilla)
- [Chart.js](https://www.chartjs.org/) for bar charts

## 🔗 APIs Used

- Codeforces Official API:
  - `user.info`
  - `user.status`
  - `user.ratedList`
  - `contest.list`
  - `problemset.problems`

## 📂 Project Structure

```
├── index.html        # Main HTML layout
├── style.css         # Theme, cards, buttons, responsiveness
├── script.js         # API fetch, event handling, interactivity
├── logo.png          # Logo icon used for branding
```

## ⚙️ How to Run

1. Clone the repository or download the files:
   ```
   git clone https://github.com/ashutoshpradhan3/ForceHub.git
   ```

2. Open `index.html` in any modern web browser.

> 💡 No server or build tools needed — works entirely in the browser!

## 📌 Note

- Codeforces API is rate-limited to 1 request every 2 seconds.
- Some topic synonyms (like `bst`) are internally mapped for better results.

## 📷 Preview

![ForceHub UI Preview](logo.png)

---
