// Function to handle venue booking
async function bookVenue(bookingData) {
    try {
        const response = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            throw new Error('Booking failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Function to get user bookings
async function getUserBookings(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/bookings/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Function to display bookings in the Venues page
async function displayUserBookings() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const bookings = await getUserBookings(userId);
        const bookingsContainer = document.getElementById('bookings-container');
        
        if (bookings.length === 0) {
            bookingsContainer.innerHTML = '<p>You have no bookings yet.</p>';
            return;
        }

        bookingsContainer.innerHTML = bookings.map(booking => `
            <div class="booking-card">
                <h3>${booking.venue.name}</h3>
                <p><strong>Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> ${booking.guests}</p>
                <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
                <p><strong>Status:</strong> ${booking.status}</p>
                ${booking.services.length > 0 ? 
                    `<p><strong>Services:</strong> ${booking.services.join(', ')}</p>` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error displaying bookings:', error);
    }
}

// Call this function when the Venues page loads
if (window.location.pathname.includes('venues.html')) {
    document.addEventListener('DOMContentLoaded', displayUserBookings);
}