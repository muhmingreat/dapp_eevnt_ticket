 // SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import {Errors,Events, Structs} from './Library.sol';
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract EventTicket is Ownable, ReentrancyGuard, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _totalEvents;
    Counters.Counter private _totalTokens;

    AggregatorV3Interface internal priceFeed;


    uint256 public balance;
    uint256 private servicePercentage;
    uint256  public newTicketCost ;
    mapping(uint256 => Structs.EventStruct) events;
    mapping(uint256 => Structs.TicketStruct[]) tickets;
    mapping(uint256 => bool) eventExists;

    constructor(uint256 _percentage) ERC721('MSquare', 'MM') {
        servicePercentage = _percentage;
        priceFeed  = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    }

    function getEHTPrice() public view returns (uint256) {
        (,int price,,,) = priceFeed.latestRoundData();
        return uint256(price);
    }
    function createEvent(
        string memory title,
        string memory description,
        string memory imageUrl,
        uint256 capacity,
        uint256 ticketCost,
        uint256 startsAt,
        uint256 endsAt
        
    ) public {
        if (ticketCost == 0) revert Errors.ZeroValueNotAllowed();
        if (capacity == 0) revert Errors.ZeroValueNotAllowed();
        if (bytes(title).length == 0) revert Errors.ZeroAddressNotAllowed();
        if (bytes(description).length == 0) revert Errors.ZeroAddressNotAllowed();
        if (bytes(imageUrl).length == 0) revert Errors.ZeroAddressNotAllowed();
        if (startsAt == 0) revert Errors.ZeroValueNotAllowed();
        if (endsAt <= startsAt) revert Errors.InvalidEventId();
        // if (ticketSold > capacity * 40 / 100) {
        //     newTicketCost = ticketCost;
        // }
        
        _totalEvents.increment();
        Structs.EventStruct memory newEvent;

        newEvent.id = _totalEvents.current();
        newEvent.title = title;
        newEvent.description = description;
        newEvent.imageUrl = imageUrl;
        newEvent.capacity = capacity;
        newEvent.ticketCost = ticketCost;
        newEvent.startsAt = startsAt;
        newEvent.endsAt = endsAt;
        newEvent.owner = msg.sender;
        newEvent.timestamp = currentTime();

        eventExists[newEvent.id] = true;
        events[newEvent.id] = newEvent;

        emit Events.EventCreatedSuccessfully(title, msg.sender, address(this));
    }

    function updateEvent(
        uint256 eventId,
        string memory title,
        string memory description,
        string memory imageUrl,
        uint256 capacity,
        uint256 ticketCost,
        uint256 startsAt,
        uint256 endsAt
    ) public {
        if (!eventExists[eventId]) revert Errors.InvalidEventId();
        if (events[eventId].owner != msg.sender) revert Errors.NotAManager();
        if (ticketCost == 0) revert Errors.ZeroValueNotAllowed();
        if (capacity == 0) revert Errors.ZeroValueNotAllowed();
        if (bytes(title).length == 0) revert Errors.ZeroAddressNotAllowed();
        if (bytes(description).length == 0) revert Errors.ZeroAddressNotAllowed();
        if (bytes(imageUrl).length == 0) revert Errors.ZeroAddressNotAllowed();
        if (startsAt == 0) revert Errors.ZeroValueNotAllowed();
        if (endsAt <= startsAt) revert Errors.InvalidEventId();

        events[eventId].title = title;
        events[eventId].description = description;
        events[eventId].imageUrl = imageUrl;
        events[eventId].capacity = capacity;
        events[eventId].ticketCost = ticketCost;
        events[eventId].startsAt = startsAt;
        events[eventId].endsAt = endsAt;
    }

    function deleteEvent(uint256 eventId) public {
        if (!eventExists[eventId]) revert Errors.InvalidEventId();
        if (events[eventId].owner != msg.sender && msg.sender != owner()) revert Errors.NotAManager();
        if (events[eventId].paidOut) revert Errors.EventEndedAlready();
        if (events[eventId].refunded) revert Errors.EventCancelledAlready();
        if (events[eventId].deleted) revert Errors.EventCancelledAlready();
        if (!refundTickets(eventId)) revert Errors.EventCancelledAlready();

        events[eventId].deleted = true;
    }

    function getEvents() public view returns (Structs.EventStruct[] memory Events) {
        uint256 available;

        for (uint256 i = 1; i <= _totalEvents.current(); i++) {
            if (!events[i].deleted) {
                available++;
            }
        }

        Events = new Structs.EventStruct[](available);
        uint256 index;

        for (uint256 i = 1; i <= _totalEvents.current(); i++) {
            if (!events[i].deleted) {
                Events[index++] = events[i];
            }
        }
    }

    function getMyEvents() public view returns (Structs.EventStruct[] memory Events) {
        uint256 available;

        for (uint256 i = 1; i <= _totalEvents.current(); i++) {
            if (!events[i].deleted && events[i].owner == msg.sender) {
                available++;
            }
        }

        Events = new Structs.EventStruct[](available);
        uint256 index;

        for (uint256 i = 1; i <= _totalEvents.current(); i++) {
            if (!events[i].deleted && events[i].owner == msg.sender) {
                Events[index++] = events[i];
            }
        }
    }

    function getSingleEvent(uint256 eventId) public view returns (Structs.EventStruct memory) {
        return events[eventId];
    }

    function buyTickets(uint256 eventId, uint256 numOfticket) public payable {
        if (!eventExists[eventId]) revert Errors.InvalidEventId();
        if (msg.value < events[eventId].ticketCost * numOfticket) revert Errors.ZeroValueNotAllowed();
        if (numOfticket == 0) revert Errors.ZeroValueNotAllowed();
        if (events[eventId].seats + numOfticket > events[eventId].capacity) revert Errors.MaxRegistrationsExceeded();

        for (uint i = 0; i < numOfticket; i++) {
            Structs.TicketStruct memory ticket;
            ticket.id = tickets[eventId].length;
            ticket.eventId = eventId;
            ticket.owner = msg.sender;
            ticket.ticketCost = events[eventId].ticketCost;
            ticket.timestamp = currentTime();
            tickets[eventId].push(ticket);
        }

        events[eventId].seats += numOfticket;
        balance += msg.value;

        emit Events.EventRegistrationSuccessful(eventId, msg.sender, events[eventId].title);
    }

    function refundTickets(uint256 eventId) internal returns (bool) {
        for (uint i = 0; i < tickets[eventId].length; i++) {
            tickets[eventId][i].refunded = true;
            payTo(tickets[eventId][i].owner, tickets[eventId][i].ticketCost);
            balance -= tickets[eventId][i].ticketCost;
        }

        events[eventId].refunded = true;
        return true;
    }

    function payout(uint256 eventId) public {
        if (!eventExists[eventId]) revert Errors.InvalidEventId();
        if (events[eventId].paidOut) revert Errors.EventEndedAlready();
        if (currentTime() <= events[eventId].endsAt) revert Errors.EventCancelledAlready();
        if (events[eventId].owner != msg.sender && msg.sender != owner()) revert Errors.NotAManager();
        if (!mintTickets(eventId)) revert Errors.EventCancelledAlready();

        uint256 revenue = events[eventId].ticketCost * events[eventId].seats;
        uint256 feePercentage = (revenue * servicePercentage) / 100;

        payTo(events[eventId].owner, revenue - feePercentage);
        payTo(owner(), feePercentage);

        events[eventId].paidOut = true;
        balance -= revenue;
    }

    function mintTickets(uint256 eventId) internal returns (bool) {
        for (uint i = 0; i < tickets[eventId].length; i++) {
            _totalTokens.increment();
            tickets[eventId][i].minted = true;
            _mint(tickets[eventId][i].owner, _totalTokens.current());
        }

        events[eventId].minted = true;
        return true;
    }

    function getTickets(uint256 eventId) public view returns (TicketStruct[] memory Tickets) {
    return tickets[eventId];
  }
  

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}('');
        require(success);
    }

    function currentTime() internal view returns (uint256) {
        return (block.timestamp * 1000) + 1000;
    }

}