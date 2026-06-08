<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Data Analytics Learning Hub</title>

  <link rel="stylesheet" href="style.css"/>

  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>

  <header>
    <h1>Data Analytics & Data Visualization Hub</h1>
    <p>Learn from Basics → Advanced with Interactive Simulations</p>
  </header>

  <nav>
    <a href="#basics">Basics</a>
    <a href="#intermediate">Intermediate</a>
    <a href="#advanced">Advanced</a>
    <a href="#simulation">Simulation Lab</a>
    <a href="#resources">Resources</a>
    <a href="#contact">Contact</a>
  </nav>

  <section class="hero">
    <h2>Master Data Analytics Professionally</h2>
    <p>Understand data, visualize patterns, and build real analytical thinking using interactive tools.</p>
  </section>

  <!-- BASICS -->
  <section id="basics">
    <h2>📊 Basics of Data Analytics</h2>
    <ul>
      <li>What is Data Analytics?</li>
      <li>Types of Data (Structured / Unstructured)</li>
      <li>Data Cleaning Fundamentals</li>
      <li>Mean, Median, Mode</li>
    </ul>
  </section>

  <!-- INTERMEDIATE -->
  <section id="intermediate">
    <h2>📈 Intermediate Concepts</h2>
    <ul>
      <li>Data Visualization Principles</li>
      <li>Correlation & Trends</li>
      <li>Excel / SQL Basics</li>
      <li>Dashboard Thinking</li>
    </ul>
  </section>

  <!-- ADVANCED -->
  <section id="advanced">
    <h2>🚀 Advanced Analytics</h2>
    <ul>
      <li>Predictive Analytics</li>
      <li>Regression Analysis</li>
      <li>Machine Learning Basics</li>
      <li>Business Intelligence Systems</li>
    </ul>
  </section>

  <!-- SIMULATION -->
  <section id="simulation">
    <h2>🧪 Data Visualization Simulation Lab</h2>

    <div class="controls">
      <button onclick="generateData()">Generate Dataset</button>
      <button onclick="renderBarChart()">Bar Chart</button>
      <button onclick="renderLineChart()">Line Chart</button>
    </div>

    <canvas id="chart" width="400" height="200"></canvas>

    <p class="note">
      This simulation helps you understand how raw data converts into visual insights.
    </p>
  </section>

  <!-- RESOURCES -->
  <section id="resources">
    <h2>📚 Learning Resources</h2>
    <ul>
      <li>Python for Data Analysis</li>
      <li>SQL Practice Platforms</li>
      <li>Google Data Analytics Certificate</li>
      <li>Kaggle Datasets</li>
      <li>Tableau Public</li>
    </ul>
  </section>

  <!-- CONTACT -->
  <section id="contact">
    <h2>📞 Contact Us</h2>
    <div class="contact-box">
      <p><b>Name:</b> Debanjan Banerjee</p>
      <p><b>Address:</b> Kolkata, West Bengal, India</p>
      <p><b>Phone:</b> 6289143900</p>
      <p><b>Email:</b> banerjeedebanjan22@gmail.com</p>
    </div>
  </section>

  <footer>
    <p>© 2026 Data Analytics Learning Hub | Built for Educational Purposes</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
