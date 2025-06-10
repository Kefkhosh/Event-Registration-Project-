// Registration Form Handling
document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');
    const formSummary = document.getElementById('formSummary');
    const summaryContent = document.getElementById('summaryContent');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function (e) {
            e.preventDefault();
        
            // Get form data
            const formData = new FormData(this);
            const formDataObj = {};
            formData.forEach((value, key) => {
                if (key === 'topics') {
                    if (!formDataObj[key]) {
                        formDataObj[key] = [];
                    }
                    formDataObj[key].push(value);
                } else {
                    formDataObj[key] = value;
                }
            });

            // Create summary HTML
            let summaryHTML = '<ul>';
            for (const [key, value] of Object.entries(formDataObj)) {
                if (key === 'topics') {
                    summaryHTML += `<li><strong>Topics of Interest:</strong> ${value.join(', ')}</li>`;
                } else if (key === 'session') {
                    const sessionMap = {
                        'digital-marketing': 'Digital Marketing Trends 2025',
                        'social-media': 'Social Media Mastery',
                        'content-marketing': 'Content Marketing Excellence'
                    };
                    summaryHTML += `<li><strong>Selected Session:</strong> ${sessionMap[value]}</li>`;
                } else if (key !== 'consent') {
                    summaryHTML += `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</li>`;
                }
            }
            summaryHTML += '</ul>';

            // Show summary
            summaryContent.html(summaryHTML);
            formSummary.slideDown();

            // Redirect to confirmation page after 2 seconds
            setTimeout(() => {
                window.location.href = 'confirmation.html';
            }, 2000);
        });
    }

    // Handle confirmation page
    document.addEventListener('DOMContentLoaded', function () {
        if (window.location.pathname.includes('confirmation.html')) {
            const registrationDetails = $('#registrationDetails');
            const urlParams = new URLSearchParams(window.location.search);
        
            let detailsHTML = '<ul>';
            for (const [key, value] of urlParams.entries()) {
                if (key === 'topics') {
                    detailsHTML += `<li><strong>Topics of Interest:</strong> ${value}</li>`;
                } else if (key === 'session') {
                    const sessionMap = {
                        'digital-marketing': 'Digital Marketing Trends 2025',
                        'social-media': 'Social Media Mastery',
                        'content-marketing': 'Content Marketing Excellence'
                    };
                    detailsHTML += `<li><strong>Selected Session:</strong> ${sessionMap[value]}</li>`;
                } else if (key !== 'consent') {
                    detailsHTML += `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</li>`;
                }
            }
            detailsHTML += '</ul>';
        
            registrationDetails.html(detailsHTML);
        }
    });

    // Schedule Page Functionality
    document.addEventListener('DOMContentLoaded', function() {
        const scheduleContainer = document.querySelector('.schedule-container');
        if (scheduleContainer) {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const sessionRows = document.querySelectorAll('.session-row');

            // Filter functionality
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filterType = this.parentElement.classList.contains('date-filters') ? 'date' : 'type';
                    const filterValue = this.getAttribute(`data-${filterType}`);

                    // Update active state for the specific filter group
                    this.parentElement.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');

                    // Get current filter values
                    const dateFilter = document.querySelector('.date-filters .active').getAttribute('data-date');
                    const typeFilter = document.querySelector('.type-filters .active').getAttribute('data-type');

                    // Filter sessions
                    sessionRows.forEach(row => {
                        const dateMatch = dateFilter === 'all' || row.getAttribute('data-date') === dateFilter;
                        const typeMatch = typeFilter === 'all' || row.getAttribute('data-type') === typeFilter;

                        if (dateMatch && typeMatch) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
            });

            // Hover functionality for session rows
            sessionRows.forEach(row => {
                // Create details div if it doesn't exist
                if (!row.querySelector('.session-details')) {
                    const details = document.createElement('div');
                    details.className = 'session-details';
                    details.innerHTML = `
                        <div class="session-info">
                            <p><strong>Description:</strong> ${row.getAttribute('data-description') || 'Detailed session information will be available soon.'}</p>
                            <p><strong>Speaker Bio:</strong> ${row.getAttribute('data-speaker-bio') || 'Speaker biography will be available soon.'}</p>
                        </div>
                    `;
                    row.appendChild(details);
                }

                // Add hover event listeners
                row.addEventListener('mouseenter', function() {
                    const details = this.querySelector('.session-details');
                    const icon = this.querySelector('.toggle-icon');
                    
                    // Hide all other details
                    document.querySelectorAll('.session-details').forEach(d => {
                        if (d !== details) {
                            d.style.display = 'none';
                            d.previousElementSibling.querySelector('.toggle-icon').classList.remove('active');
                        }
                    });

                    // Show this detail
                    details.style.display = 'block';
                    icon.classList.add('active');
                });

                row.addEventListener('mouseleave', function() {
                    const details = this.querySelector('.session-details');
                    const icon = this.querySelector('.toggle-icon');
                    
                    details.style.display = 'none';
                    icon.classList.remove('active');
                });
            });

            // Initialize filters
            document.querySelector('.date-filters .filter-btn[data-date="all"]').classList.add('active');
            document.querySelector('.type-filters .filter-btn[data-type="all"]').classList.add('active');
        }
    });

    // Speakers Page Functionality
    $(document).ready(function() {
        if ($('.speakers-container').length) {
            // Read More functionality
            $('.read-more').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const $fullBio = $(this).siblings('.speaker-full-bio');
                const $this = $(this);
                
                // Close other open bios
                $('.speaker-full-bio').not($fullBio).slideUp(300);
                $('.read-more').not($this).text('Read More');
                
                // Toggle current bio
                if ($fullBio.is(':visible')) {
                    $fullBio.slideUp(300);
                    $this.text('Read More');
                } else {
                    $fullBio.slideDown(300);
                    $this.text('Show Less');
                }
            });

            // Speaker filtering
            $('.filter-btn').click(function() {
                const $this = $(this);
                const category = $this.data('category');

                // Update active state
                $('.filter-btn').removeClass('active');
                $this.addClass('active');

                // Filter speakers with animation
                if (category === 'all') {
                    $('.speaker-card').slideDown(300);
                } else {
                    $('.speaker-card').slideUp(300);
                    $(`.speaker-card[data-category="${category}"]`).slideDown(300);
                }
            });

            // Speaker card click for modal
            $('.speaker-card').click(function() {
                const $card = $(this);
                const $modal = $('#speakerModal');
                const $modalContent = $modal.find('.modal-content');
                
                // Get speaker data
                const name = $card.find('.speaker-name').text();
                const title = $card.find('.speaker-title').text();
                const image = $card.find('.speaker-image').attr('src');
                const fullBio = $card.find('.speaker-full-bio').html();
                
                // Update modal content
                $modalContent.find('.modal-image').attr('src', image);
                $modalContent.find('.speaker-name').text(name);
                $modalContent.find('.speaker-title').text(title);
                $modalContent.find('.speaker-full-bio').html(fullBio);
                
                // Show modal
                $modal.fadeIn(300);
            });

            // Close modal
            $('.close-modal').click(function() {
                $('#speakerModal').fadeOut(300);
            });

            // Close modal when clicking outside
            $(window).click(function(e) {
                const $modal = $('#speakerModal');
                if ($(e.target).is($modal)) {
                    $modal.fadeOut(300);
                }
            });
        }
    });

    // Resources Page Functionality
    document.addEventListener('DOMContentLoaded', function() {
        const resourcesContainer = document.querySelector('.resources-container');
        if (resourcesContainer) {
            // Get all filter buttons and resource categories
            const filterButtons = document.querySelectorAll('.filter-btn');
            const resourceCategories = document.querySelectorAll('.resource-category');
            const categoryHeaders = document.querySelectorAll('.category-header');

            // Filter button click handler
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');

                    const category = this.getAttribute('data-category');

                    // Show/hide categories based on filter
                    resourceCategories.forEach(category => {
                        if (this.getAttribute('data-category') === 'all') {
                            category.style.display = 'block';
                        } else {
                            if (category.getAttribute('data-category') === this.getAttribute('data-category')) {
                                category.style.display = 'block';
                            } else {
                                category.style.display = 'none';
                            }
                        }
                    });
                });
            });

            // Category header click handler
            categoryHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    const content = this.nextElementSibling;
                    const icon = this.querySelector('.toggle-icon');
                    
                    // Close other content sections
                    categoryHeaders.forEach(otherHeader => {
                        if (otherHeader !== this) {
                            const otherContent = otherHeader.nextElementSibling;
                            const otherIcon = otherHeader.querySelector('.toggle-icon');
                            otherContent.style.display = 'none';
                            otherIcon.classList.remove('active');
                        }
                    });

                    // Toggle current content
                    if (content.style.display === 'block') {
                        content.style.display = 'none';
                        icon.classList.remove('active');
                    } else {
                        content.style.display = 'block';
                        icon.classList.add('active');
                    }
                });
            });
        }
    });

    // FAQ Page Functionality
    $(document).ready(function() {
        // Handle FAQ accordion
        $('.faq-question').click(function() {
            // Get the answer div that follows this question
            var answer = $(this).next('.faq-answer');
            var icon = $(this).find('.toggle-icon');
            
            // Toggle the current answer
            answer.slideToggle(300);
            icon.toggleClass('active');
            
            // Close other answers
            $('.faq-answer').not(answer).slideUp(300);
            $('.toggle-icon').not(icon).removeClass('active');
        });

        // Handle FAQ search
        $('#faqSearch').on('input', function() {
            var searchTerm = $(this).val().toLowerCase();
            var hasResults = false;

            $('.faq-item').each(function() {
                var question = $(this).find('h3').text().toLowerCase();
                var answer = $(this).find('.faq-answer').text().toLowerCase();

                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    $(this).show();
                    hasResults = true;
                } else {
                    $(this).hide();
                }
            });

            $('.no-results').toggle(!hasResults);
        });

        // Resources Page Functionality
        $('.category-header').click(function() {
            var content = $(this).next('.category-content');
            var icon = $(this).find('.toggle-icon');
            
            // First close all other content sections
            $('.category-content').not(content).slideUp(300);
            $('.toggle-icon').not(icon).removeClass('active');
            
            // Then toggle the clicked content
            if (content.is(':visible')) {
                content.slideUp(300);
                icon.removeClass('active');
            } else {
                content.slideDown(300);
                icon.addClass('active');
            }
        });

        // Resources filter functionality
        $('.filter-btn').click(function() {
            var category = $(this).data('category');
            
            // Update active state
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            
            // Filter resources
            if (category === 'all') {
                $('.resource-category').slideDown(300);
            } else {
                $('.resource-category').slideUp(300);
                $('.resource-category[data-category="' + category + '"]').slideDown(300);
            }
        });
    });

    // Featured Sessions on Homepage
    document.addEventListener('DOMContentLoaded', function () {
        if (document.querySelector('.featured-sessions')) {
            // Fetch sessions data
            fetch('data/sessions.json')
                .then(response => response.json())
                .then(data => {
                    // Get the first three sessions (or fewer if less than 3 exist)
                    const featuredSessions = data.sessions.slice(0, 3);
                    const sessionCards = document.querySelector('.session-cards');
                
                    // Clear existing content
                    sessionCards.innerHTML = '';
                
                    // Create cards for each featured session
                    featuredSessions.forEach(session => {
                        const card = document.createElement('div');
                        card.className = 'card';
                    
                        card.innerHTML = `
                        <img src="${session.speaker.image}" alt="${session.title}">
                        <h3>${session.title}</h3>
                        <p>${session.description}</p>
                        <a href="schedule.html" class="btn">Learn More</a>
                    `;
                    
                        sessionCards.appendChild(card);
                    });
                })
                .catch(error => {
                    console.error('Error loading sessions:', error);
                    // Fallback content in case of error
                    const sessionCards = document.querySelector('.session-cards');
                    sessionCards.innerHTML = `
                    <div class="card">
                        <img src="assets/images/session1.jpg" alt="Digital Marketing Trends">
                        <h3>Digital Marketing Trends 2025</h3>
                        <p>Discover the latest trends shaping the future of digital marketing.</p>
                        <a href="schedule.html" class="btn">Learn More</a>
                    </div>
                    <div class="card">
                        <img src="assets/images/session2.jpg" alt="Social Media Strategy">
                        <h3>Social Media Mastery</h3>
                        <p>Learn advanced strategies for social media engagement and growth.</p>
                        <a href="schedule.html" class="btn">Learn More</a>
                    </div>
                    <div class="card">
                        <img src="assets/images/session3.jpg" alt="Content Marketing">
                        <h3>Content Marketing Excellence</h3>
                        <p>Master the art of creating compelling content that converts.</p>
                        <a href="schedule.html" class="btn">Learn More</a>
                    </div>
                `;
                });
        }
    });
})