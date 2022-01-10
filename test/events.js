const { expectRevert, time } = require("@openzeppelin/test-helpers");
const Events = artifacts.require("Events");

contract("Events", () => {
    let contract;
    beforeEach(async () => {
        contract = await Events.new();
    });
    describe("Event Creation:", () => {
        it("Should successfuly list events", async () => {
            const date = (await time.latest()).add(time.duration.days(1));
            await contract.createEvent("surfing", date, 150, 1000);
            const event = contract.events(0);
            expect(event.id === 0);
            expect(event.name === "surfing");
            expect(event.date === date);
            expect(event.price === 150);
            expect(event.ticketCount === 1000);
        });
        it("Should not allow events to be created in the past", async () => {
            const date = (await time.latest()).sub(time.duration.seconds(1));
            await expectRevert(
                contract.createEvent("concert", date, 5, 10),
                "The event date must be in the future"
            );
        });
        it("Should not allow ticketless events", async () => {
            const date = (await time.latest()).add(time.duration.days(1));
            await expectRevert(
                contract.createEvent("hotbox", date, 50, 0),
                "Specify at least one ticket to your event"
            );
        });
        it("Should not allow ticketless events", async () => {
            const date = (await time.latest()).add(time.duration.days(1));
            await expectRevert(
                contract.createEvent("onlyfans", date, 0, 100),
                "This contract does not support free events"
            );
        });
        it("Should not process nonexistant events", async () => {
            const date = (await time.latest()).add(time.duration.days(1));
            await contract.createEvent("cheese", date, 2, 4);
            await expectRevert(
                contract.buyTicket(5, 2),
                "Event does not exist"
            );
        });
    });
});
