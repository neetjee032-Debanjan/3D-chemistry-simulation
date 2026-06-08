let chart;

function load(page) {

  const box = document.getElementById("content");

  if (chart) {
    chart.destroy();
    chart = null;
  }

  const pages = {

    intro: `
      <h2>Introduction to Data Analytics</h2>
      <p>Data Analytics is the science of analyzing raw data to find patterns, trends, and insights for decision making.</p>
      <ul>
        <li>Used in AI, business, finance, healthcare</li>
        <li>Turns raw data into decisions</li>
      </ul>
    `,

    data: `
      <h2>Types of Data</h2>
      <p>Data is classified into:</p>
      <ul>
        <li><b>Structured:</b> SQL, Excel</li>
        <li><b>Unstructured:</b> Text, images, video</li>
        <li><b>Semi-structured:</b> JSON, XML</li>
      </ul>
    `,

    stats: `
      <h2>Statistics Basics</h2>
      <ul>
        <li>Mean → Average value</li>
        <li>Median → Middle value</li>
        <li>Mode → Most frequent value</li>
      </ul>
    `,

    clean: `
      <h2>Data Cleaning</h2>
      <ul>
        <li>Remove missing values</li>
        <li>Fix duplicates</li>
        <li>Standardize formats</li>
        <li>Handle outliers</li>
      </ul>
    `,

    viz: `
      <h2>Data Visualization</h2>
      <p>Visualization helps humans understand patterns instantly.</p>
    `,

    sim: `
      <h2>Simulation Lab</h2>
      <p>Generating dataset and plotting real-time insights...</p>
    `,

    resources: `
      <h2>Resources</h2>
      <ul>
        <li>Kaggle Datasets</li>
        <li>Pandas Documentation</li>
        <li>Google Data Analytics Certificate</li>
        <li>Tableau Public</li>
      </ul>
    `,

    contact: `
      <h2>Contact</h2>
      <p><b>Name:</b> Debanjan Banerjee</p>
      <p><b>Location:</b> Kolkata, India</p>
      <p><b>Email:</b> banerjeedebanjan22@gmail.com</p>
    `
  };

  box.innerHTML = pages[page];

  if (page === "viz") drawChart();
  if (page === "sim") drawSimulation();
}

/* BAR CHART */
function drawChart() {
  const ctx = document.getElementById("chart").getContext("2d");

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["A","B","C","D","E"],
      datasets: [{
        label: "Sales Data",
        data: [12, 19, 7, 15, 10],
        backgroundColor: "#38bdf8"
      }]
    }
  });
}

/* SIMULATION */
function drawSimulation() {
  const ctx = document.getElementById("chart").getContext("2d");

  const data = Array.from({length: 12}, () => Math.floor(Math.random()*100));

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_,i)=>"P"+i),
      datasets: [{
        label: "Live Dataset Simulation",
        data: data,
        borderColor: "#a78bfa",
        tension: 0.4
      }]
    }
  });
}
