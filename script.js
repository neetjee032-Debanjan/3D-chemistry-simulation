let chart;

function load(page) {

  const box = document.getElementById("content");

  if (chart) {
    chart.destroy();
    chart = null;
  }

  const content = {

intro: `
<h2>What is Data Analytics?</h2>
<p>Data Analytics is the process of examining raw data to extract meaningful insights for decision-making.</p>
<p><b>Example:</b> Netflix recommends shows based on your viewing patterns.</p>
<p><b>Flow:</b> Data → Cleaning → Analysis → Insights → Decision</p>
`,

workflow: `
<h2>Analytics Workflow</h2>
<ol>
<li>Define problem</li>
<li>Collect data</li>
<li>Clean data</li>
<li>Analyze patterns</li>
<li>Visualize results</li>
<li>Make decisions</li>
</ol>
<p><b>Example:</b> Why users stop using an app after 3 days?</p>
`,

data: `
<h2>Types of Data</h2>
<ul>
<li><b>Structured:</b> Excel, SQL tables</li>
<li><b>Unstructured:</b> Text, images, videos</li>
<li><b>Semi-structured:</b> JSON, XML</li>
</ul>
<p><b>Example:</b> Instagram photos = unstructured data</p>
`,

stats: `
<h2>Statistics Basics</h2>
<ul>
<li>Mean = average</li>
<li>Median = middle value</li>
<li>Mode = most frequent value</li>
</ul>
<p><b>Example:</b> 10, 20, 20, 30 → Mode = 20</p>
`,

clean: `
<h2>Data Cleaning</h2>
<ul>
<li>Remove duplicates</li>
<li>Fix missing values</li>
<li>Standardize formats</li>
</ul>
<p><b>Why it matters:</b> Bad data leads to wrong decisions.</p>
`,

viz: `
<h2>Data Visualization</h2>
<p>Charts help humans understand patterns quickly.</p>
<p>Bar = comparison | Line = trend | Pie = proportion</p>
`,

sim: `
<h2>Simulation Lab</h2>
<p>Generating dataset and visualizing trend...</p>
`,

ml: `
<h2>Machine Learning Intro</h2>
<ul>
<li>Supervised Learning</li>
<li>Unsupervised Learning</li>
</ul>
<p><b>Example:</b> Spam email detection</p>
`,

resources: `
<h2>Resources</h2>
<ul>
<li>Kaggle Datasets</li>
<li>Google Data Analytics Certificate</li>
<li>Pandas Documentation</li>
<li>Tableau Public</li>
</ul>
`,

contact: `
<h2>Contact</h2>
<p><b>Name:</b> Debanjan Banerjee</p>
<p><b>Location:</b> Kolkata, India</p>
<p><b>Email:</b> banerjeedebanjan22@gmail.com</p>
<p><b>Phone:</b> 6289143900</p>
`

  };

  box.innerHTML = content[page];

  if (page === "viz") drawChart();
  if (page === "sim") drawSimulation();
}

function drawChart() {
  const ctx = document.getElementById("chart").getContext("2d");

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mon","Tue","Wed","Thu","Fri"],
      datasets: [{
        label: "Sales Data",
        data: [12, 19, 8, 15, 22]
      }]
    }
  });
}

function drawSimulation() {
  const ctx = document.getElementById("chart").getContext("2d");

  const data = Array.from({length: 12}, () => Math.floor(Math.random()*100));

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_,i)=>"D"+i),
      datasets: [{
        label: "Dataset Simulation",
        data: data,
        borderColor: "#a78bfa",
        tension: 0.4
      }]
    }
  });
}
