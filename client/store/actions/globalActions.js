export const globalActions = {
    setTickets: (state , action) => {
      state.tickets = action.payload
    },
    setEvent: (state, action) => {
      state.event = action.payload
    },
    setTicketModal: (state, action) => {
      state.ticketModal = action.payload
    },
  }
  