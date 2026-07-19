const { db } = require('../config/firebase');

/**
 * Converts a 24h time string "HH:MM" to minutes from midnight
 * @param {string} timeStr - Time string formatted as HH:MM
 * @returns {number} Minutes since midnight
 */
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Checks if seats are available for the requested slot
 * @param {string} date - Reservation date in YYYY-MM-DD format
 * @param {string} time - Reservation time in HH:MM format
 * @param {number} guestCount - Number of guests requested
 * @returns {Promise<{available: boolean, suggested_alternative_slots?: string[]}>}
 */
async function checkAvailability(date, time, guestCount) {
  try {
    // 1. Fetch restaurant capacity details
    const restaurantDoc = await db.collection('restaurants').doc('xyner').get();
    if (!restaurantDoc.exists) {
      throw new Error("Restaurant 'xyner' profile not found in database.");
    }
    const restaurantData = restaurantDoc.data();
    const totalCapacity = restaurantData.total_capacity_seats || 50;
    const { open, close } = restaurantData.operating_hours || { open: "12:00", close: "23:59" };

    // 2. Validate operating hours
    const requestedMinutes = timeToMinutes(time);
    const openMinutes = timeToMinutes(open);
    const closeMinutes = timeToMinutes(close);

    if (requestedMinutes < openMinutes || requestedMinutes > closeMinutes) {
      return {
        available: false,
        message: `XYNER is closed at ${time}. Our operating hours are from ${open} to ${close}.`
      };
    }

    // 3. Fetch all active reservations for the requested date
    const reservationsQuery = await db.collection('reservations')
      .where('restaurant_id', '==', 'xyner')
      .where('booking_date', '==', date)
      .where('status', '==', 'confirmed')
      .get();

    let overlappingGuests = 0;
    const reservationWindowMinutes = 120; // 2 hours window

    reservationsQuery.docs.forEach(doc => {
      const res = doc.data();
      const resMinutes = timeToMinutes(res.booking_time);
      
      // If the reservation falls within a 2-hour window of the requested slot
      if (Math.abs(resMinutes - requestedMinutes) < reservationWindowMinutes) {
        overlappingGuests += Number(res.guest_count || 0);
      }
    });

    const isAvailable = (overlappingGuests + Number(guestCount)) <= totalCapacity;

    if (isAvailable) {
      return { available: true };
    } else {
      // Suggest some alternative slots (e.g., 2 hours earlier or 2 hours later, within operating hours)
      const suggestions = [];
      const alternativeDiffs = [-120, 120]; // +/- 2 hours

      alternativeDiffs.forEach(diff => {
        const altMin = requestedMinutes + diff;
        if (altMin >= openMinutes && altMin <= closeMinutes) {
          const h = Math.floor(altMin / 60).toString().padStart(2, '0');
          const m = (altMin % 60).toString().padStart(2, '0');
          suggestions.push(`${h}:${m}`);
        }
      });

      return {
        available: false,
        suggested_alternative_slots: suggestions
      };
    }
  } catch (error) {
    console.error("Error in checkAvailability service:", error);
    throw error;
  }
}

/**
 * Creates a confirmed reservation in the database
 * @param {string} customerName - Name of the customer
 * @param {string} phoneNumber - WhatsApp/Phone number of the customer
 * @param {string} date - Reservation date in YYYY-MM-DD format
 * @param {string} time - Reservation time in HH:MM format
 * @param {number} guestCount - Number of guests
 * @returns {Promise<{success: boolean, reservationId: string, booking_token: string}>}
 */
async function createReservation(customerName, phoneNumber, date, time, guestCount) {
  try {
    const newReservation = {
      restaurant_id: 'xyner',
      customer_name: customerName,
      phone_number: phoneNumber,
      booking_date: date,
      booking_time: time,
      guest_count: Number(guestCount),
      status: 'confirmed',
      created_at: new Date().toISOString()
    };

    const docRef = await db.collection('reservations').add(newReservation);
    
    // Generate a simple readable booking token (e.g., XY-XXXX)
    const tokenPart = docRef.id.slice(-4).toUpperCase();
    const bookingToken = `XY-${tokenPart}`;

    // Update document with booking token
    await db.collection('reservations').doc(docRef.id).update({ booking_token: bookingToken });

    return {
      success: true,
      reservationId: docRef.id,
      booking_token: bookingToken
    };
  } catch (error) {
    console.error("Error in createReservation service:", error);
    throw error;
  }
}

module.exports = {
  checkAvailability,
  createReservation
};
