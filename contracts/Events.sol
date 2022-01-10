// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Events {

    struct Event {
        address admin;
        string name;
        uint256 date;
        uint256 price;
        uint256 ticketCount;
        uint256 ticketsRemaining;
    }

    mapping(uint256 => Event) public events;
    mapping(address => mapping(uint256 => uint256)) public tickets;
    uint256 public nextIndex;

    function createEvent(
        string calldata _name,
        uint256 _date,
        uint256 _price,
        uint256 _ticketCount
    ) external {
        require(_date > block.timestamp, "The event date must be in the future");
        require(_ticketCount > 0, "Specify at least one ticket to your event");
        require(_price > 0, 'This contract does not support free events');
        events[nextIndex] = Event(
            msg.sender,
            _name,
            _date,
            _price,
            _ticketCount,
            _ticketCount
        );
        nextIndex++;
    }

    function buyTicket(uint256 _id, uint256 _quantity) external payable {
        Event storage _event = events[_id];
        require(_event.date != 0, "Event does not exist");
        require(_event.date > block.timestamp, "Event no longer active");
        require(msg.value == _event.price, "Please double check ticket price");
        require(_event.ticketsRemaining > _quantity, "Not enough tickets");
        _event.ticketsRemaining -= _quantity;
        tickets[msg.sender][_id] -= _quantity;
    }
}