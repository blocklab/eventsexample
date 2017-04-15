pragma solidity ^0.4.4;

// TODO: Mass unbooking by an organizer to refund all participants who showed up to remove number of messages
// TODO: Deletion of event
// TODO: Send $$$ to organizer
contract Events {

    address public organizer;

    mapping (uint => Event) public events;

    struct Participant {
      bool registered;
      uint payment;
    }

    struct Event {
      bool exists;
      uint requiredFee;
      uint256 startOfEvent; // in seconds since the epoch
      uint deadline; // number of days before the event
      bytes32 hashedSecret; // keccak256(secret) to be used for attendance verification
      mapping (address => Participant) participants;
    }

    function Events() {
        organizer = tx.origin;
    }

    modifier onlyByOrganizer() {
        if (msg.sender != organizer) throw;
        _;
    }

    modifier eventExists(uint eventInstance) {
        if (!events[eventInstance].exists) throw;
        _;
    }

    /// Create a new event instance with a required (minimum)
    /// fee each user must provide to create a booking.
    function create(uint eventInstance, uint requiredFee, uint256 startTime, uint deadline, bytes32 hashedSecret) onlyByOrganizer {
        if (events[eventInstance].exists) throw;
        events[eventInstance] = Event({exists: true, requiredFee: requiredFee, startOfEvent: startTime, deadline: deadline, hashedSecret: hashedSecret});
    }

    // Returns true if an event with a given instance exists
    function exists(uint eventInstance) returns (bool) {
        return events[eventInstance].exists;
    }

    // Returns fee of an event
    function fee(uint eventInstance) eventExists(eventInstance) returns (uint) {
        return events[eventInstance].requiredFee;
    }

    /// Creates a booking for given event for the message's sender.
    /// The message amount must be equal or higher than the event's fee.
    /// See exists(eventInstance) to get the required fee value.
    function book(uint eventInstance) payable eventExists(eventInstance) {
        Event eventToBook = events[eventInstance];
        if (eventToBook.requiredFee > msg.value) throw;
        if (eventToBook.participants[msg.sender].registered) throw;
        eventToBook.participants[msg.sender].payment = msg.value;
        eventToBook.participants[msg.sender].registered = true;
    }

    /// Returns the sender's booking information (subscription status & payment)
    function myBooking(uint eventInstance) returns (bool, uint) {
        Participant p = events[eventInstance].participants[msg.sender];
        return (p.registered, p.payment);
    }

    /// Returns booking information (subscription status & payment) for any participant
    function anyBooking(uint eventInstance, address participant) onlyByOrganizer returns (bool, uint) {
        Participant p = events[eventInstance].participants[participant];
        return (p.registered, p.payment);
    }

    /// Removes the sender's booking for given event and refunds the provided
    /// fee. Throws an exception if the sender does not have a valid booking
    /// for the event
    function refundMeThroughCancellation(uint eventInstance) {
        performRefund(eventInstance, msg.sender, "");
    }

    /// Removes the given participant's booking for given event - to be performed by the organizer
    function refundParticipantThroughCancellation(uint eventInstance, address participant) onlyByOrganizer {
        performRefund(eventInstance, participant, "");
    }

    // Internal function to perform refund
    function performRefund(uint eventInstance, address participant, string secret) internal {
        Event eventToRefund = events[eventInstance];
        if (!eventToRefund.participants[participant].registered) throw;
        // refund by cancellation in time
        if (bytes(secret).length == 0 && now > eventToRefund.startOfEvent - eventToRefund.deadline * 1 days) throw;
        // refund by knowing the event's secret
        if (bytes(secret).length > 0 && eventToRefund.hashedSecret != keccak256(secret)) throw;
        uint amount = eventToRefund.participants[participant].payment;
        eventToRefund.participants[participant].payment = 0;
        eventToRefund.participants[participant].registered = false;

        if (!participant.send(amount)) {
            throw;
        }
    }

    // Refunds participant's payment when participant attends the event
    function refundThroughAttendance(uint eventInstance, string secret) {
        performRefund(eventInstance, msg.sender, secret);
    }
}
