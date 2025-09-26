document.addEventListener('DOMContentLoaded', function () {
    const searchbutton = document.getElementById('search-btn');
    const usernameinput = document.getElementById('user-input');
    const statscontainer = document.querySelector('.stats-container');
    const easyprogress = document.querySelector('.Easy-progress');
    const mediumprogress = document.querySelector('.Medium-progress');
    const hardprogress = document.querySelector('.Hard-progress');
    const easylabel = document.getElementById('easy-label');
    const mediumlabel = document.getElementById('medium-label');
    const hardlabel = document.getElementById('hard-label');
    const cardstatscontainer = document.querySelector('.stats-card');


    //return true or false based on username validity
    function validateusername(username) {
        if (username.trim() === '') {
            alert('Username cannot be empty');
            return false;
        }
        const regex = /^[a-zA-Z0-9_]{1,15}$/;
        const ismatching = regex.test(username);
        if (!ismatching) {
            alert('Invalid Username');
        }
        return ismatching;
    }

    async function fetchuserdetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchbutton.textContent = 'Searching...';
            searchbutton.disabled = true;

            const response = await fetch(url);
            const data = await response.json();

            console.log("Raw API data:", data);  // 👈 see exactly what comes back

            if (!response.ok || data.status === "error") {
                throw new Error('User not found');
            }

            displayuserdata(data);
        }
        catch (error) {
            console.error("Error:", error);
            statscontainer.innerHTML = `<p>No data Found</p>`;
        }
        finally {
            searchbutton.textContent = 'Search';
            searchbutton.disabled = false;
        }
    }


    function setPieChart(circleEl, percentage, color) {
        // percentage from 0 to 100
        const degree = (percentage / 100) * 360;
        circleEl.style.background = `conic-gradient(${color} 0deg ${degree}deg, #8d9cbbff ${degree}deg 360deg)`;
    }

    function displayuserdata(data) {
        const easyprogress = document.querySelector('.Easy-progress');
        const mediumprogress = document.querySelector('.Medium-progress');
        const hardprogress = document.querySelector('.Hard-progress');

        const easylabel = document.getElementById('easy-label');
        const mediumlabel = document.getElementById('medium-label');
        const hardlabel = document.getElementById('hard-label');

        const totals = { easy: data.totalEasy, medium: data.totalMedium, hard: data.totalHard };
        const solved = { easy: data.easySolved, medium: data.mediumSolved, hard: data.hardSolved };

        const percentages = {
            easy: totals.easy ? Math.round((solved.easy / totals.easy) * 100) : 0,
            medium: totals.medium ? Math.round((solved.medium / totals.medium) * 100) : 0,
            hard: totals.hard ? Math.round((solved.hard / totals.hard) * 100) : 0
        };

        // set text
        easylabel.textContent = `${percentages.easy}%`;
        mediumlabel.textContent = `${percentages.medium}%`;
        hardlabel.textContent = `${percentages.hard}%`;

        // set pie charts
        setPieChart(easyprogress, percentages.easy, '#299f5d');
        setPieChart(mediumprogress, percentages.medium, '#f0ad4e');
        setPieChart(hardprogress, percentages.hard, '#d9534f');

        const carddata = [
            { label: "Overall Easy Submissions", value: data.totalEasy },
            { label: "Overall Medium Submissions", value: data.totalMedium },
            { label: "Overall Hard Submissions", value: data.totalHard },
            { label: "Overall Solved", value: data.totalSolved },
        ];
        console.log("Card ka data:", carddata);

        cardstatscontainer.innerHTML = carddata.map(
            data => `
            <div class="stats-card-item">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
            </div>
            `).join("")


    }





    searchbutton.addEventListener('click', function () {
        const username = usernameinput.value;
        if (validateusername(username)) {
            fetchuserdetails(username);
        }
    });




})
