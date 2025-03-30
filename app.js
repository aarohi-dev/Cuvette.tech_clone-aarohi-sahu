document.addEventListener("DOMContentLoaded", () => {
    const jobListings = document.getElementById("job-listings");
    const loading = document.getElementById("loading");
    const searchInput = document.getElementById("search");
    const locationFilter = document.getElementById("location");
    const experienceFilter = document.getElementById("experience");
    const salaryFilter = document.getElementById("salary");
    const filterButton = document.getElementById("apply-filters");

    async function fetchJobs() {
        loading.classList.remove("hidden");
        jobListings.classList.add("hidden");
        jobListings.innerHTML = "";

        const search = searchInput.value.trim();
        const location = locationFilter.value !== "Location" ? locationFilter.value : "";
        const experience = experienceFilter.value !== "Experience" ? experienceFilter.value : "";
        const salary = salaryFilter.value !== "Salary Range" ? salaryFilter.value : "";

        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (location) queryParams.append("location", location);
        if (experience) queryParams.append("experience", experience);
        if (salary) queryParams.append("salary", salary);

        try {
            const response = await fetch(`http://localhost:3000/jobs?${queryParams}`);
            const jobs = await response.json();

            loading.classList.add("hidden");
            jobListings.classList.remove("hidden");

            if (jobs.length === 0) {
                jobListings.innerHTML = "<p class='text-red-500'>No jobs found.</p>";
                return;
            }

            jobs.forEach(job => {
                const jobElement = document.createElement("div");
                jobElement.classList = "bg-white p-4 rounded-lg shadow hover:shadow-md transition";
                jobElement.innerHTML = `
                    <h3 class="text-xl font-semibold">${job.title}</h3>
                    <p class="text-gray-500">${job.company} • ${job.place}</p>
                    <p class="text-sm mt-2">Salary: ${job.package}</p>
                    <p class="text-sm text-gray-400">Experience: ${job.experience}</p>
                    <button class="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition apply-btn" data-url="${job.linkedin_url}">
                        Apply Now
                    </button>
                `;
                jobListings.appendChild(jobElement);
            });

            // Add event listeners to "Apply Now" buttons
            document.querySelectorAll(".apply-btn").forEach(button => {
                button.addEventListener("click", (event) => {
                    const url = event.target.getAttribute("data-url");
                    if (url) {
                        window.open(url, "_blank"); // Open LinkedIn job post in new tab
                    } else {
                        alert("LinkedIn link not available for this job.");
                    }
                });
            });

        } catch (error) {
            console.error("Error fetching jobs:", error);
            loading.innerHTML = "<p class='text-red-500'>Failed to load job listings.</p>";
        }
    }

    filterButton.addEventListener("click", fetchJobs);
    searchInput.addEventListener("keyup", fetchJobs);

    fetchJobs(); // Load jobs on page load
});

fetch("https://cuvette-tech-clone-aarohi-sahu.vercel.app/") 