async function calculateEmployability() {
  // Get skills from text input and split by commas
  const skillsInput = document.getElementById('skillsInput').value;
  const selectedSkills = skillsInput
  .split(',')
  .map(skill => skill.trim().toLowerCase())  // Normalize input
  .filter(skill => skill !== '');
  
  console.log("Selected Skills:", selectedSkills);

  if (selectedSkills.length === 0) {
    alert("Please enter at least one skill!");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/get-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills: selectedSkills })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jobs = await response.json();
    console.log("Jobs:", jobs);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = jobs.map(job => `
      <div class="job-card">
        <h3>${job.title} (${job.sector})</h3>
        <p><strong>Companies:</strong> ${job.companies.join(', ')}</p>
        <p><strong>Employability Score:</strong> ${job.employabilityScore}%</p>
        <p><strong>Recruitment Process:</strong></p>
        <ul>
          ${job.recruitmentProcess.map(step => `<li>${step}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please check the console for details.");
  }
}