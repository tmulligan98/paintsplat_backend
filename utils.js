module.exports = {
    parseUsername: function (inputBody) {
        return inputBody["username"]
    },

    parseLobbyId: function (inputBody) {
        return inputBody["lobbyId"]
    }
}
