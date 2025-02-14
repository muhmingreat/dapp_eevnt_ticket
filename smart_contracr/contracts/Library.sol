and the Library  // SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

library Errors {
    error ZeroAddressNotAllowed();
    error ZeroValueNotAllowed();
    error NotAManager();
    error InvalidEventId();
    error CannotRegisterTwice();
    error CannotSignInTwice();
    error EventCancelledAlready();
    error EventEndedAlready();
    error DoesNotHaveEventNFT();
    error MaxRegistrationsExceeded();
    error CannotSigninToUnRegisteredEvent();
    error MaxRegistrationCantBeLessThanRegistrations();
}

library Events {
    event EventCreatedSuccessfully(
        string indexed _eventName,
        address indexed _manager,
        address indexed _nftAddress
    );
    event EventRegistrationSuccessful(
        uint256 indexed _eventId,
        address indexed _user,
        string indexed _eventName
    );
    event EventSignInSuccessful(
        uint256 indexed _eventId,
        address indexed _user,
        string indexed _eventName
    );

    }
    library Structs {
 struct EventStruct {
    uint256 id;
    string title;
    string imageUrl;
    string description;
    address owner;
    uint256 sales;
    uint256 ticketCost;
    uint256 capacity;
    uint256 seats;
    uint256 startsAt;
    uint256 endsAt;
    uint256 timestamp;
    bool deleted;
    bool paidOut;
    bool refunded;
    bool minted;
  }

  struct TicketStruct {
   uint256 id;
    uint256 eventId;
    address owner;
    uint256 ticketCost;
    uint256 timestamp;
    uint256 ticketSold;
    bool refunded;
    bool minted;
  } 
}